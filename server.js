const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const UPLOAD_DIR = path.join(ROOT, "uploads");
const DB_PATH = path.join(DATA_DIR, "db.json");
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const seed = {
  users: [
    { id: "USR-1001", name: "Aman Sharma", email: "aman@example.test", role: "customer", language: "en" },
    { id: "ADM-1001", name: "DriveCover Admin", email: "admin@example.test", role: "admin", language: "en" }
  ],
  vehicles: [
    { id: "VEH-1001", ownerId: "USR-1001", registration: "PB-00-DEMO-01", make: "Honda", model: "Activa 6G", year: 2023, usage: "delivery", annualKm: 18000, safety: "standard" }
  ],
  policies: [
    { id: "POL-1001", ownerId: "USR-1001", vehicleId: "VEH-1001", plan: "combined", premium: 3200, status: "active", startDate: "2026-01-01", endDate: "2026-12-31", sumInsured: 50000, demo: true }
  ],
  claims: [
    { id: "CL-1001", ownerId: "USR-1001", policyId: "POL-1001", vehicleId: "VEH-1001", incidentDate: "2026-10-12", location: "Phagwara (demo)", description: "Minor side-panel damage after a low-speed collision.", estimatedDamage: 9000, photos: [], status: "approved", recommendation: "potentially_eligible", recommendationReason: "Demo claim has complete sample details; insurer review is recorded.", approvedAmount: 8000, decisionReason: "Illustrative demo approval after review.", createdAt: "2026-10-12T10:00:00.000Z", updatedAt: "2026-10-12T12:00:00.000Z", demo: true }
  ],
  ledger: [],
  notifications: []
};
function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch (e) { console.error("Could not read database; reseeding:", e.message); }
  const db = JSON.parse(JSON.stringify(seed));
  db.ledger.push(makeLedgerEntry(db, "DEMO-INIT", "DEMO_INITIALIZED", { note: "DriveCover sample ledger initialized" }));
  saveDB(db);
  return db;
}
function saveDB(db) { fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)); }
function makeId(prefix) { return `${prefix}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`; }
function makeLedgerEntry(db, claimId, eventType, payload) {
  const previous = db.ledger.length ? db.ledger[db.ledger.length - 1].hash : "GENESIS";
  const createdAt = new Date().toISOString();
  const id = makeId("TX");
  const content = JSON.stringify({ id, claimId, eventType, payload, createdAt, previousHash: previous });
  return { id, claimId, eventType, payload, createdAt, previousHash: previous, hash: crypto.createHash("sha256").update(content).digest("hex") };
}
let db = loadDB();
if (!db.ledger.length) {
  db.ledger.push(makeLedgerEntry(db, "DEMO-INIT", "DEMO_INITIALIZED", { note: "DriveCover sample ledger initialized" }));
  saveDB(db);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(5).toString("hex")}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) return cb(new Error("Only JPG, PNG and WebP images are accepted."));
    cb(null, true);
  }
});

app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(UPLOAD_DIR));
app.use(express.static(path.join(ROOT, "public")));

function currentDB() { return db; }
function persist() { saveDB(db); }
function userById(id) { return db.users.find(u => u.id === id); }
function policyById(id) { return db.policies.find(p => p.id === id); }
function claimById(id) { return db.claims.find(c => c.id === id); }
function isAdmin(req) { return req.header("x-demo-role") === "admin"; }
function safeUser(user) { return { id: user.id, name: user.name, email: user.email, role: user.role, language: user.language || "en" }; }
function fail(res, status, message) { return res.status(status).json({ error: message }); }

app.get("/api/health", (_req, res) => res.json({ ok: true, app: "DriveCover", mode: "demo" }));
app.get("/api/bootstrap", (_req, res) => {
  const customer = db.users.find(u => u.role === "customer");
  const admin = db.users.find(u => u.role === "admin");
  res.json({ users: [safeUser(customer), safeUser(admin)], plans: [
    { id: "third-party", name: "Third-party", price: 1500, description: "Illustrative liability-cover quote; actual price depends on applicable rules and vehicle details.", features: ["Third-party liability", "Policy document summary", "Digital claim guidance"] },
    { id: "own-damage", name: "Own-damage", price: 2000, description: "Illustrative own-damage quote, subject to eligibility and policy terms.", features: ["Specified vehicle damage", "Claim status tracking", "Photo-assisted reporting"] },
    { id: "combined", name: "Combined cover", price: 3200, description: "Illustrative combined-cover quote; not a market quotation.", features: ["Third-party liability", "Specified own-damage cover", "Digital claims assistance"] }
  ]});
});
app.get("/api/state", (req, res) => {
  const userId = req.query.userId || "USR-1001";
  const role = req.query.role || "customer";
  const user = userById(userId);
  if (!user) return fail(res, 404, "Demo user not found.");
  if (role === "admin" && user.role !== "admin") return fail(res, 403, "Admin demo role required.");
  const vehicles = role === "admin" ? db.vehicles : db.vehicles.filter(v => v.ownerId === userId);
  const policies = role === "admin" ? db.policies : db.policies.filter(p => p.ownerId === userId);
  const claims = role === "admin" ? db.claims : db.claims.filter(c => c.ownerId === userId);
  res.json({ user: safeUser(user), vehicles, policies, claims, ledger: db.ledger.slice().reverse(), notifications: db.notifications.slice(-20).reverse() });
});
app.post("/api/vehicles", (req, res) => {
  const { ownerId = "USR-1001", registration, make, model, year, usage = "personal", annualKm = 8000, safety = "standard" } = req.body || {};
  if (!registration || !make || !model || !year) return fail(res, 400, "Registration, make, model and year are required.");
  const vehicle = { id: makeId("VEH"), ownerId, registration: String(registration).trim().toUpperCase(), make: String(make).trim(), model: String(model).trim(), year: Number(year), usage, annualKm: Number(annualKm), safety };
  db.vehicles.push(vehicle); persist();
  res.status(201).json({ vehicle });
});
app.post("/api/quote", (req, res) => {
  const { vehicleId, planId, ownerId = "USR-1001" } = req.body || {};
  const vehicle = db.vehicles.find(v => v.id === vehicleId && v.ownerId === ownerId);
  if (!vehicle) return fail(res, 400, "Select a valid vehicle first.");
  const base = { "third-party": 1500, "own-damage": 2000, "combined": 3200 }[planId];
  if (!base) return fail(res, 400, "Choose a valid demo plan.");
  const risk = calculateRisk(vehicle, db.claims.filter(c => c.ownerId === ownerId));
  const quote = Math.round(base * (0.85 + risk.score / 100 * 0.3));
  res.json({ quoteId: makeId("QUO"), vehicleId, planId, basePremium: base, indicativePremium: quote, risk, disclaimer: "Illustrative educational quote only. Not an actual insurance offer." });
});
function calculateRisk(vehicle, claims) {
  const age = Math.max(0, new Date().getFullYear() - Number(vehicle.year || 2023));
  const ageScore = Math.min(100, age * 12);
  const usageScore = vehicle.usage === "delivery" ? 75 : (Number(vehicle.annualKm) > 15000 ? 65 : 35);
  const claimCount = claims.filter(c => c.status !== "rejected").length;
  const claimsScore = Math.min(100, claimCount * 35);
  const categoryScore = /sport|heavy/i.test(`${vehicle.make} ${vehicle.model}`) ? 65 : 35;
  const safetyScore = vehicle.safety === "strong" ? 20 : vehicle.safety === "limited" ? 80 : 45;
  const factors = [
    { key: "vehicleAge", label: "Vehicle age and condition", score: ageScore, weight: 0.20, explanation: "Older vehicles can have higher repair and reliability exposure." },
    { key: "usage", label: "Usage and exposure", score: usageScore, weight: 0.25, explanation: vehicle.usage === "delivery" ? "Delivery use may involve more time on the road." : "Estimated annual usage contributes to exposure." },
    { key: "claims", label: "Relevant claims history", score: claimsScore, weight: 0.20, explanation: "Prior demo claim records are a simple illustrative signal." },
    { key: "vehicleCategory", label: "Vehicle category", score: categoryScore, weight: 0.15, explanation: "Vehicle characteristics may affect repair costs and exposure." },
    { key: "safety", label: "Safety and security", score: safetyScore, weight: 0.20, explanation: "Lower score means stronger safety controls in this demo." }
  ];
  const score = Math.round(factors.reduce((sum, f) => sum + f.score * f.weight, 0));
  return { score, category: score <= 30 ? "Lower" : score <= 60 ? "Medium" : "Higher", factors, note: "Illustrative rule-based score, not a validated underwriting model. It must not independently determine eligibility or actual pricing." };
}
app.post("/api/policies/activate", (req, res) => {
  const { ownerId = "USR-1001", vehicleId, planId, premium } = req.body || {};
  const vehicle = db.vehicles.find(v => v.id === vehicleId && v.ownerId === ownerId);
  const base = { "third-party": 1500, "own-damage": 2000, "combined": 3200 }[planId];
  if (!vehicle || !base) return fail(res, 400, "Choose a valid vehicle and demo plan.");
  const amount = Number(premium);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000) return fail(res, 400, "Invalid demo premium.");
  const today = new Date().toISOString().slice(0, 10);
  const policy = {
    id: makeId("POL"), ownerId, vehicleId, plan: planId, premium: Math.round(amount),
    status: "active", startDate: today, endDate: `${new Date().getFullYear() + 1}-12-31`,
    sumInsured: planId === "third-party" ? 0 : 50000, demo: true
  };
  db.policies.unshift(policy);
  db.ledger.push(makeLedgerEntry(db, policy.id, "DEMO_POLICY_ACTIVATED", { ownerId, vehicleId, planId, premium: policy.premium }));
  persist();
  res.status(201).json({ policy, disclaimer: "Demo policy only. No real insurance was issued." });
});
app.post("/api/risk-score", (req, res) => {
  const { vehicleId, ownerId = "USR-1001" } = req.body || {};
  const vehicle = db.vehicles.find(v => v.id === vehicleId && v.ownerId === ownerId);
  if (!vehicle) return fail(res, 400, "Select a valid vehicle first.");
  res.json(calculateRisk(vehicle, db.claims.filter(c => c.ownerId === ownerId)));
});
app.post("/api/claims", upload.array("photos", 5), (req, res) => {
  const { ownerId = "USR-1001", policyId, vehicleId, incidentDate, location, description, estimatedDamage } = req.body || {};
  const policy = db.policies.find(p => p.id === policyId && p.ownerId === ownerId);
  const vehicle = db.vehicles.find(v => v.id === vehicleId && v.ownerId === ownerId);
  if (!policy || !vehicle) return fail(res, 400, "Choose a valid demo policy and vehicle.");
  if (!incidentDate || !description || !location) return fail(res, 400, "Incident date, location and description are required.");
  if (!req.files || req.files.length < 1) return fail(res, 400, "Upload at least one damage photo.");
  const photos = req.files.map(f => ({ name: f.originalname, url: `/uploads/${f.filename}`, size: f.size, type: f.mimetype }));
  const assessment = assessClaim(policy, incidentDate, description, photos, Number(estimatedDamage || 0));
  const claim = {
    id: makeId("CL"), ownerId, policyId, vehicleId, incidentDate, location, description,
    estimatedDamage: Number(estimatedDamage || 0), photos, status: "under_review",
    recommendation: assessment.recommendation, recommendationReason: assessment.reason,
    approvedAmount: null, decisionReason: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), demo: true
  };
  db.claims.unshift(claim);
  db.ledger.push(makeLedgerEntry(db, claim.id, "CLAIM_SUBMITTED", { status: claim.status, photoCount: photos.length, recommendation: assessment.recommendation }));
  persist();
  res.status(201).json({ claim, assessment });
});
function assessClaim(policy, incidentDate, description, photos, estimatedDamage) {
  const reasons = [];
  if (policy.status !== "active") reasons.push("The selected demo policy is not active.");
  if (incidentDate < policy.startDate || incidentDate > policy.endDate) reasons.push("The incident date is outside the recorded demo policy period.");
  if (!photos.length) reasons.push("No damage photos were provided.");
  if (!description || description.trim().length < 12) reasons.push("The incident description needs more detail.");
  if (estimatedDamage <= 0) reasons.push("Estimated damage amount is missing.");
  if (reasons.length) return { recommendation: "manual_review", reason: reasons.join(" ") + " Human review is required; this is not an automatic denial." };
  return { recommendation: "potentially_eligible", reason: "Required demo fields and damage photos are present. Photos have not been machine-vision analyzed; insurer review is still required." };
}
app.post("/api/claims/:id/decision", (req, res) => {
  if (!isAdmin(req)) return fail(res, 403, "Use the admin demo role to review claims.");
  const claim = claimById(req.params.id);
  if (!claim) return fail(res, 404, "Claim not found.");
  const { decision, reason = "", approvedAmount = 0 } = req.body || {};
  if (!["approved", "rejected", "more_info"].includes(decision)) return fail(res, 400, "Invalid decision.");
  if (!reason.trim()) return fail(res, 400, "A decision reason is required.");
  if (decision === "approved" && (!Number.isFinite(Number(approvedAmount)) || Number(approvedAmount) <= 0)) return fail(res, 400, "Enter a valid approved amount.");
  if (claim.status === "approved" || claim.status === "rejected") return fail(res, 409, "This claim has already been closed.");
  claim.status = decision === "more_info" ? "more_info" : decision;
  claim.decisionReason = reason.trim();
  claim.approvedAmount = decision === "approved" ? Number(approvedAmount) : null;
  claim.updatedAt = new Date().toISOString();
  db.ledger.push(makeLedgerEntry(db, claim.id, decision === "approved" ? "CLAIM_APPROVED" : decision === "rejected" ? "CLAIM_REJECTED" : "MORE_INFORMATION_REQUESTED", { reason: claim.decisionReason, approvedAmount: claim.approvedAmount }));
  if (decision === "approved") {
    claim.payoutStatus = "initiated_simulated";
    db.ledger.push(makeLedgerEntry(db, claim.id, "SIMULATED_PAYOUT_INITIATED", { amount: claim.approvedAmount, currency: "INR" }));
  }
  persist();
  res.json({ claim });
});
app.post("/api/chat", (req, res) => {
  const { message = "", language = "en", userId = "USR-1001" } = req.body || {};
  const m = String(message).toLowerCase();
  const claims = db.claims.filter(c => c.ownerId === userId);
  const policies = db.policies.filter(p => p.ownerId === userId);
  const hi = language === "hi";
  let reply;
  if (/premium|quote|price|cost|प्रीमियम|कीमत|कोट/.test(m)) reply = hi ? "आप वाहन चुनकर Get Quote में अनुमानित डेमो प्रीमियम देख सकते हैं। यह वास्तविक बीमा प्रस्ताव नहीं है।" : "Select your vehicle and open Get Quote to see an indicative demo premium. This is not a real insurance offer.";
  else if (/claim status|status|track|क्लेम की स्थिति|स्थिति/.test(m)) {
    const c = claims[0];
    reply = c ? (hi ? `आपके नवीनतम डेमो क्लेम ${c.id} की स्थिति ${c.status} है।` : `Your latest demo claim ${c.id} is ${c.status}.`) : (hi ? "अभी कोई क्लेम नहीं मिला। पहले क्लेम दर्ज करें।" : "No claims found yet. Submit a claim first.");
  } else if (/document|photo|picture|upload|दस्तावेज|फोटो/.test(m)) reply = hi ? "क्लेम के लिए दुर्घटना का विवरण और कम से कम एक JPG, PNG या WebP क्षति फोटो अपलोड करें। बीमाकर्ता अतिरिक्त दस्तावेज मांग सकता है।" : "For a demo claim, provide the incident details and at least one JPG, PNG or WebP damage photo. The insurer may request additional documents.";
  else if (/cover|coverage|third.party|own.damage|कवर|कवरेज/.test(m)) reply = hi ? "थर्ड-पार्टी कवर दूसरों के प्रति कानूनी देयता के लिए है। ओन-डैमेज कवर आपके वाहन के निर्दिष्ट नुकसान के लिए है। वास्तविक कवरेज पॉलिसी की शर्तों पर निर्भर करता है।" : "Third-party cover addresses legal liability to others. Own-damage cover addresses specified damage to your vehicle. Actual cover depends on the policy wording.";
  else if (/eligible|eligibility|policy|पात्र|पॉलिसी/.test(m)) reply = hi ? `आपके पास ${policies.length} डेमो पॉलिसी रिकॉर्ड हैं। पात्रता सक्रिय पॉलिसी, कवरेज और क्लेम की जांच पर निर्भर करती है।` : `You have ${policies.length} demo policy record(s). Eligibility depends on policy status, coverage and claim verification.`;
  else if (/accident|file a claim|report|दुर्घटना|क्लेम दर्ज/.test(m)) reply = hi ? "Claims सेक्शन खोलें, पॉलिसी चुनें, दुर्घटना का विवरण भरें और क्षति की फोटो अपलोड करें। निर्णय बीमाकर्ता की समीक्षा के बाद होगा।" : "Open Claims, select a policy, enter the incident details and upload damage photos. The insurer must review the claim before a decision.";
  else reply = hi ? "मैं DriveCover का डेमो सहायक हूँ। आप प्रीमियम, कवरेज, पात्रता, आवश्यक दस्तावेज़ या क्लेम स्थिति के बारे में पूछ सकते हैं।" : "I'm the DriveCover demo assistant. Ask me about premiums, coverage, eligibility, required documents or claim status.";
  res.json({ reply, mode: "rule-based-demo" });
});
app.post("/api/reset-demo", (req, res) => {
  if (!isAdmin(req)) return fail(res, 403, "Admin demo role required.");
  for (const f of fs.readdirSync(UPLOAD_DIR)) {
    if (f !== ".gitkeep") try { fs.unlinkSync(path.join(UPLOAD_DIR, f)); } catch {}
  }
  db = JSON.parse(JSON.stringify(seed));
  db.ledger = [makeLedgerEntry(db, "DEMO-INIT", "DEMO_RESET", { note: "Demo data reset by administrator" })];
  saveDB(db);
  res.json({ ok: true });
});
app.use((err, _req, res, _next) => {
  const message = err instanceof multer.MulterError
    ? (err.code === "LIMIT_FILE_SIZE" ? "Each photo must be 5 MB or smaller." : "Upload limit exceeded.")
    : err.message || "Unexpected server error.";
  res.status(400).json({ error: message });
});
app.get("*", (_req, res) => res.sendFile(path.join(ROOT, "public", "index.html")));
app.listen(PORT, () => console.log(`DriveCover running at http://localhost:${PORT}`));
