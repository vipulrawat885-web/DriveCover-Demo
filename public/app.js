const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const state = { user: null, role: "customer", page: "home", lang: "en", data: null, plans: [], currentQuote: null, selectedPhotos: [], chatMessages: [], adminTab: "claims", compliance: {} };
const I18N = {
  en: { workspace:"WORKSPACE", overview:"Overview", vehicles:"My vehicles", plans:"Insurance plans", claims:"Claims", assistant:"AI assistant", manage:"MANAGE", ledger:"Claim ledger", admin:"Admin console", demoMode:"Demo environment", demoNote:"Sample data · No real payments", resetDemo:"Reset demo data", prototype:"PROTOTYPE", personalWorkspace:"PERSONAL WORKSPACE", welcomeBack:"Welcome back,", welcomeSubtitle:"Here’s your motor protection at a glance.", getQuote:"Get a quote", protectionOverview:"PROTECTION OVERVIEW", heroTitle:"Confidence for every<br>road ahead.", heroText:"Simple motor protection, clearer claims, and support when you need it.", viewPolicy:"View my policy", activePolicies:"Active policies", activeCoverage:"Your current coverage", openClaims:"Open claims", claimUpdates:"Status and claim updates", riskAssessment:"Risk assessment", riskEstimate:"Illustrative risk estimate", annualPremium:"Annual premium", illustrativeQuote:"Illustrative policy premium", yourCoverage:"YOUR COVERAGE", policySnapshot:"Policy snapshot", viewDetails:"View details ↗", SHORTCUTS:"SHORTCUTS", quickActions:"Quick actions", addVehicle:"Add a vehicle", addVehicleSub:"Manage your two-wheeler", comparePlans:"Compare plans", comparePlansSub:"Find a suitable cover", fileClaim:"File a claim", fileClaimSub:"Report an incident", askAssistant:"Ask the assistant", askAssistantSub:"Get help with your policy", RECENT_ACTIVITY:"RECENT ACTIVITY", recentClaims:"Recent claims & updates", viewAll:"View all →", claimId:"CLAIM ID", incident:"INCIDENT", date:"DATE", status:"STATUS", footerDisclaimer:"Illustrative demo only · Not an insurance offer", customer:"Customer", administrator:"Administrator", signInTitle:"Choose your demo workspace", signInText:"This academic prototype uses sample accounts only.", continueCustomer:"Continue as customer", continueAdmin:"Continue as administrator", cancel:"Cancel", submit:"Submit", save:"Save", close:"Close", back:"Back", noPolicy:"No policy found", noClaims:"No claims yet", loading:"Loading…", active:"Active", under_review:"Under review", submitted:"Submitted", approved:"Approved", rejected:"Rejected", more_info:"More information needed" },
  hi: { workspace:"कार्यक्षेत्र", overview:"अवलोकन", vehicles:"मेरे वाहन", plans:"बीमा योजनाएँ", claims:"क्लेम", assistant:"AI सहायक", manage:"प्रबंधन", ledger:"क्लेम लेजर", admin:"एडमिन कंसोल", demoMode:"डेमो वातावरण", demoNote:"नमूना डेटा · वास्तविक भुगतान नहीं", resetDemo:"डेमो डेटा रीसेट करें", prototype:"प्रोटोटाइप", personalWorkspace:"व्यक्तिगत कार्यक्षेत्र", welcomeBack:"वापसी पर स्वागत है,", welcomeSubtitle:"आपके मोटर सुरक्षा विवरण यहाँ हैं।", getQuote:"कोटेशन लें", protectionOverview:"सुरक्षा अवलोकन", heroTitle:"हर सफर के लिए<br>बेहतर भरोसा।", heroText:"सरल मोटर सुरक्षा, स्पष्ट क्लेम और जरूरत के समय सहायता।", viewPolicy:"मेरी पॉलिसी देखें", activePolicies:"सक्रिय पॉलिसियाँ", activeCoverage:"आपका वर्तमान कवर", openClaims:"खुले क्लेम", claimUpdates:"स्थिति और अपडेट", riskAssessment:"जोखिम आकलन", riskEstimate:"अनुमानित जोखिम", annualPremium:"वार्षिक प्रीमियम", illustrativeQuote:"उदाहरण पॉलिसी प्रीमियम", yourCoverage:"आपका कवर", policySnapshot:"पॉलिसी विवरण", viewDetails:"विवरण देखें ↗", SHORTCUTS:"शॉर्टकट", quickActions:"त्वरित कार्य", addVehicle:"वाहन जोड़ें", addVehicleSub:"अपना दोपहिया प्रबंधित करें", comparePlans:"योजनाएँ तुलना करें", comparePlansSub:"उपयुक्त कवर चुनें", fileClaim:"क्लेम दर्ज करें", fileClaimSub:"घटना की रिपोर्ट करें", askAssistant:"सहायक से पूछें", askAssistantSub:"पॉलिसी सहायता पाएँ", RECENT_ACTIVITY:"हाल की गतिविधि", recentClaims:"हाल के क्लेम और अपडेट", viewAll:"सभी देखें →", claimId:"क्लेम आईडी", incident:"घटना", date:"तारीख", status:"स्थिति", footerDisclaimer:"केवल डेमो · वास्तविक बीमा प्रस्ताव नहीं", customer:"ग्राहक", administrator:"एडमिनिस्ट्रेटर", signInTitle:"डेमो कार्यक्षेत्र चुनें", signInText:"यह शैक्षणिक प्रोटोटाइप केवल नमूना खातों का उपयोग करता है।", continueCustomer:"ग्राहक के रूप में जारी रखें", continueAdmin:"एडमिन के रूप में जारी रखें", cancel:"रद्द करें", submit:"जमा करें", save:"सहेजें", close:"बंद करें", back:"वापस", noPolicy:"कोई पॉलिसी नहीं मिली", noClaims:"अभी कोई क्लेम नहीं", loading:"लोड हो रहा है…", active:"सक्रिय", under_review:"समीक्षा में", submitted:"जमा किया गया", approved:"स्वीकृत", rejected:"अस्वीकृत", more_info:"अधिक जानकारी आवश्यक" }
};
const money = n => new Intl.NumberFormat(state.lang === "hi" ? "hi-IN" : "en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(Number(n || 0));
const dateFmt = s => s ? new Date(s).toLocaleDateString(state.lang === "hi" ? "hi-IN" : "en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const statusText = s => (I18N[state.lang][s] || s || "—");
async function api(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (state.role === "admin") headers["x-demo-role"] = "admin";
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}
function toast(message, type = "") {
  const el = document.createElement("div"); el.className = `toast ${type}`; el.textContent = message;
  $("#toastRegion").append(el); setTimeout(() => el.remove(), 3600);
}
function openModal(title, body, onReady) {
  $("#modalTitle").textContent = title; $("#modalBody").innerHTML = body; $("#modalBackdrop").hidden = false;
  if (onReady) onReady();
}
function closeModal() { $("#modalBackdrop").hidden = true; $("#modalBody").innerHTML = ""; }
async function refreshData() {
  const data = await api(`/api/state?userId=${encodeURIComponent(state.user.id)}&role=${state.role}`);
  state.data = data; renderShell(); renderPage();
}
function init() {
  $("#closeModal").addEventListener("click", closeModal);
  $("#modalBackdrop").addEventListener("click", e => { if (e.target === $("#modalBackdrop")) closeModal(); });
  $("#languageToggle").addEventListener("click", () => { state.lang = state.lang === "en" ? "hi" : "en"; applyLanguage(); renderPage(); });
  $("#roleSwitch").addEventListener("click", () => showRoleChooser());
  $("#mobileMenu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $("#resetDemoBtn").addEventListener("click", resetDemo);
  $("#notificationBtn").addEventListener("click", () => toast(state.lang === "hi" ? "आप नवीनतम डेमो अपडेट देख रहे हैं।" : "You're viewing the latest demo updates."));
  document.addEventListener("click", handleClicks);
  $("#pageContent").addEventListener("submit", handleForms);
  $("#pageContent").addEventListener("change", handleChanges);
  start();
}
async function start() {
  try {
    const boot = await api("/api/bootstrap"); state.plans = boot.plans;
    const saved = sessionStorage.getItem("drivecoverDemoUser");
    const parsed = saved ? JSON.parse(saved) : null;
    if (parsed && ["customer","admin"].includes(parsed.role)) {
      state.role = parsed.role; state.user = boot.users.find(u => u.role === state.role) || boot.users[0];
    } else { state.user = boot.users[0]; state.role = "customer"; }
    await refreshData();
    if (!parsed) showRoleChooser();
  } catch (e) { $("#pageContent").innerHTML = `<div class="notice warning">Could not connect to the DriveCover backend. Start the server using <code>npm start</code> and reload. Details: ${esc(e.message)}</div>`; }
}
function showRoleChooser() {
  openModal(I18N[state.lang].signInTitle, `<p class="muted" style="margin:0 0 18px">${I18N[state.lang].signInText}</p><div class="section-grid"><button class="role-choice panel" data-role-choice="customer" style="text-align:left"><span class="metric-icon blue">♙</span><h3>${I18N[state.lang].continueCustomer}</h3><p class="muted">Aman Sharma · aman@example.test</p></button><button class="role-choice panel" data-role-choice="admin" style="text-align:left"><span class="metric-icon violet">▧</span><h3>${I18N[state.lang].continueAdmin}</h3><p class="muted">DriveCover Admin · admin@example.test</p></button></div><p class="modal-footnote">Demo authentication only. There are no real passwords or identity checks.</p>`);
}
async function selectRole(role) {
  const boot = await api("/api/bootstrap");
  state.role = role; state.user = boot.users.find(u => u.role === role); state.page = role === "admin" ? "admin" : "home";
  sessionStorage.setItem("drivecoverDemoUser", JSON.stringify({ role }));
  closeModal(); await refreshData(); toast(role === "admin" ? "Admin demo workspace opened." : "Customer demo workspace opened.", "success");
}
function applyLanguage() {
  document.documentElement.lang = state.lang === "hi" ? "hi" : "en";
  $$("[data-i18n]").forEach(el => { const key = el.dataset.i18n; if (I18N[state.lang][key]) el.innerHTML = I18N[state.lang][key]; });
  $("#languageToggle").textContent = state.lang === "en" ? "हिंदी" : "English";
}
function renderShell() {
  const t = I18N[state.lang];
  $("#profileName").textContent = state.user.name;
  $("#profileRole").textContent = state.role === "admin" ? t.administrator : t.customer;
  $("#profileAvatar").textContent = state.user.name.split(/\s+/).map(s => s[0]).join("").slice(0,2).toUpperCase();
  $("#welcomeName").textContent = state.user.name.split(" ")[0];
  $$(".admin-only").forEach(el => el.hidden = state.role !== "admin");
  $("#claimCount").textContent = state.data.claims.filter(c => !["approved","rejected"].includes(c.status)).length;
  applyLanguage();
}
function go(page) {
  if (page === "admin" && state.role !== "admin") { toast("Switch to the administrator demo role first.", "error"); return; }
  state.page = page; $("#sidebar").classList.remove("open");
  $$(".nav-link[data-page]").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  renderPage(); window.scrollTo({ top:0, behavior:"smooth" });
}
function handleClicks(e) {
  const role = e.target.closest("[data-role-choice]"); if (role) return selectRole(role.dataset.roleChoice);
  const nav = e.target.closest("[data-page]"); if (nav) { go(nav.dataset.page); return; }
  const action = e.target.closest("[data-action]"); if (action) { runAction(action.dataset.action); return; }
  const topic = e.target.closest("[data-chat-topic]"); if (topic) { go("assistant"); setTimeout(() => sendChat(topic.dataset.chatTopic), 30); return; }
  const remove = e.target.closest("[data-remove-photo]"); if (remove) { state.selectedPhotos.splice(Number(remove.dataset.removePhoto), 1); updatePhotoPreview(); return; }
  const pick = e.target.closest("[data-select-vehicle]"); if (pick) { state.selectedVehicleId = pick.dataset.selectVehicle; renderPage(); return; }
  const review = e.target.closest("[data-review-claim]"); if (review) { showClaimReview(review.dataset.reviewClaim); return; }
  const tab = e.target.closest("[data-admin-tab]"); if (tab) { state.adminTab = tab.dataset.adminTab; renderPage(); return; }
  const decision = e.target.closest("[data-decision]"); if (decision) { submitDecision(decision.dataset.decision); return; }
  const showClaim = e.target.closest("[data-show-claim]"); if (showClaim) { go("claims"); return; }
  const choosePlan = e.target.closest("[data-choose-plan]"); if (choosePlan) { showQuoteModal(choosePlan.dataset.choosePlan); return; }
  const close = e.target.closest("[data-close-modal]"); if (close) closeModal();
}
function runAction(action) {
  if (action === "new-quote") { go("plans"); return; }
  if (action === "view-policy") { go("plans"); toast("Your demo policy details are shown in the plans and policy sections."); return; }
  if (action === "add-vehicle") { showVehicleModal(); return; }
  if (action === "new-claim") { showClaimModal(); return; }
  if (action === "risk-assessment") { go("vehicles"); return; }
  if (action === "chat-send") { const input = $("#chatInput"); if (input && input.value.trim()) sendChat(input.value.trim()); return; }
}
function renderPage() {
  const titles = { home:"Overview", vehicles:"My vehicles", plans:"Insurance plans", claims:"Claims", assistant:"AI assistant", ledger:"Claim ledger", admin:"Admin console" };
  $("#pageTitle").textContent = state.lang === "hi" ? ({home:"अवलोकन",vehicles:"मेरे वाहन",plans:"बीमा योजनाएँ",claims:"क्लेम",assistant:"AI सहायक",ledger:"क्लेम लेजर",admin:"एडमिन कंसोल"}[state.page] || titles[state.page]) : titles[state.page];
  const renderers = { home:renderHome, vehicles:renderVehicles, plans:renderPlans, claims:renderClaims, assistant:renderAssistant, ledger:renderLedger, admin:renderAdmin };
  (renderers[state.page] || renderHome)();
}
function pageHeader(title, subtitle, action = "") { return `<div class="page-header"><div><p class="eyebrow">DRIVECOVER WORKSPACE</p><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`; }
function statusPill(status) { return `<span class="status-pill status-${esc(status)}">${esc(statusText(status))}</span>`; }
function renderHome() {
  const d = state.data, policies = d.policies.filter(p => p.status === "active"), openClaims = d.claims.filter(c => !["approved","rejected"].includes(c.status));
  const policy = policies[0], vehicle = policy && d.vehicles.find(v => v.id === policy.vehicleId), risk = vehicle ? calcRiskLocal(vehicle, d.claims) : null;
  $("#pageContent").innerHTML = `<section class="welcome-row"><div><p class="eyebrow">${I18N[state.lang].personalWorkspace}</p><h1>${state.lang==="hi"?"वापसी पर स्वागत है,":"Welcome back,"} ${esc(state.user.name.split(" ")[0])}<span class="wave">✦</span></h1><p class="muted">${state.lang==="hi"?"आपके मोटर सुरक्षा विवरण यहाँ हैं।":"Here’s your motor protection at a glance."}</p></div><button class="btn btn-primary" data-action="new-quote">＋ ${I18N[state.lang].getQuote}</button></section>
  <section class="hero-card"><div class="hero-copy"><div class="hero-kicker"><span class="tiny-shield">◆</span> PROTECTION OVERVIEW</div><h2>Confidence for every<br>road ahead.</h2><p>Simple motor protection, clearer claims, and support when you need it.</p><button class="btn btn-light" data-page="plans">View my policy ↗</button></div><div class="hero-art"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="hero-glow"></div><svg class="bike-art" viewBox="0 0 440 250" aria-label="Stylized motorcycle illustration"><circle cx="106" cy="182" r="45" fill="#0a1427" stroke="#91b5e9" stroke-width="7"/><circle cx="106" cy="182" r="25" fill="none" stroke="#37557d" stroke-width="3"/><circle cx="331" cy="182" r="45" fill="#0a1427" stroke="#91b5e9" stroke-width="7"/><circle cx="331" cy="182" r="25" fill="none" stroke="#37557d" stroke-width="3"/><path d="M106 182 164 118 223 182 157 182 190 131 265 130 331 182" fill="none" stroke="#6da9f7" stroke-width="8" stroke-linejoin="round"/><path d="M164 118 143 101 111 102M265 130 288 93 320 94" fill="none" stroke="#c4e1ff" stroke-width="8" stroke-linecap="round"/><path d="M170 116 Q193 92 222 108 L251 130 223 151 179 147Z" fill="#6da9f7"/><path d="M194 102 210 76 253 77 277 95 263 107 222 108Z" fill="#407ee0"/><path d="M214 76 226 61 257 63 272 79" fill="none" stroke="#c4e1ff" stroke-width="6" stroke-linecap="round"/></svg><div class="art-tag"><span class="art-tag-icon">✦</span><span><strong>Smart protection</strong><small>Built around your journey</small></span></div></div></section>
  <section class="metric-grid"><article class="metric-card"><div class="metric-top"><span class="metric-icon blue">◇</span><span class="metric-trend">DEMO</span></div><p>Active policies</p><div class="metric-value">${String(policies.length).padStart(2,"0")}</div><small>Your current coverage</small></article><article class="metric-card"><div class="metric-top"><span class="metric-icon violet">▤</span><span class="metric-trend neutral">TRACKING</span></div><p>Open claims</p><div class="metric-value">${String(openClaims.length).padStart(2,"0")}</div><small>Status and claim updates</small></article><article class="metric-card"><div class="metric-top"><span class="metric-icon green">✓</span><span class="metric-trend positive">READY</span></div><p>Risk assessment</p><div class="metric-value metric-word">${risk ? risk.category : "—"}</div><small>Illustrative risk estimate</small></article><article class="metric-card"><div class="metric-top"><span class="metric-icon amber">↗</span><span class="metric-trend neutral">DEMO</span></div><p>Annual premium</p><div class="metric-value">${money(policy?.premium || 0)}</div><small>Illustrative policy premium</small></article></section>
  <section class="dashboard-grid"><article class="panel policy-panel"><div class="panel-heading"><div><p class="eyebrow">YOUR COVERAGE</p><h3>Policy snapshot</h3></div><button class="text-btn" data-page="plans">View details ↗</button></div>${policy ? `<div class="policy-hero"><div class="policy-symbol">◇</div><div class="policy-copy"><strong>${esc(planName(policy.plan))}</strong><small>${esc(policy.id)} · ${esc(vehicle ? `${vehicle.make} ${vehicle.model}` : "Vehicle")}</small></div>${statusPill(policy.status)}</div><div class="policy-meta"><div><small>POLICY START</small><strong>${dateFmt(policy.startDate)}</strong></div><div><small>VALID UNTIL</small><strong>${dateFmt(policy.endDate)}</strong></div><div><small>SUM INSURED</small><strong>${money(policy.sumInsured)}</strong></div></div>` : `<div class="empty-state"><strong>No active policy yet</strong>Compare plans to create a demo policy.</div><button class="btn btn-primary" data-page="plans">Explore plans</button>`}</article><article class="panel quick-panel"><div class="panel-heading"><div><p class="eyebrow">SHORTCUTS</p><h3>Quick actions</h3></div><span class="panel-more">•••</span></div><div class="quick-actions"><button class="quick-action" data-action="add-vehicle"><span class="quick-icon qi-blue">＋</span><span><strong>Add a vehicle</strong><small>Manage your two-wheeler</small></span><b>›</b></button><button class="quick-action" data-action="new-quote"><span class="quick-icon qi-violet">◇</span><span><strong>Compare plans</strong><small>Find a suitable cover</small></span><b>›</b></button><button class="quick-action" data-action="new-claim"><span class="quick-icon qi-amber">▤</span><span><strong>File a claim</strong><small>Report an incident</small></span><b>›</b></button><button class="quick-action" data-page="assistant"><span class="quick-icon qi-green">✳</span><span><strong>Ask the assistant</strong><small>Get help with your policy</small></span><b>›</b></button></div></article></section>
  <section class="panel activity-panel"><div class="panel-heading"><div><p class="eyebrow">RECENT ACTIVITY</p><h3>Recent claims & updates</h3></div><button class="text-btn" data-page="claims">View all →</button></div>${claimsTable(d.claims.slice(0,5))}</section><footer class="footer"><span>© 2026 DriveCover · Academic prototype</span><span>Illustrative demo only · Not an insurance offer</span></footer>`;
}
function planName(id) { return ({ "third-party":"Third-party liability", "own-damage":"Own-damage cover", combined:"Combined cover" })[id] || id; }
function calcRiskLocal(vehicle, claims = []) {
  const age = Math.max(0, new Date().getFullYear() - Number(vehicle.year || 2023));
  const factors = [
    { label:"Vehicle age and condition", score:Math.min(100, age*12), weight:.20, explanation:"Older vehicles can have higher repair and reliability exposure." },
    { label:"Usage and exposure", score:vehicle.usage==="delivery" ? 75 : Number(vehicle.annualKm)>15000 ? 65 : 35, weight:.25, explanation:"Estimated road exposure contributes to risk." },
    { label:"Relevant claims history", score:Math.min(100, claims.filter(c=>c.status!=="rejected").length*35), weight:.20, explanation:"Prior demo claim records are a simple illustrative signal." },
    { label:"Vehicle category", score:/sport|heavy/i.test(`${vehicle.make} ${vehicle.model}`)?65:35, weight:.15, explanation:"Vehicle characteristics may affect repair costs." },
    { label:"Safety and security", score:vehicle.safety==="strong"?20:vehicle.safety==="limited"?80:45, weight:.20, explanation:"A lower score represents stronger safety measures in this demo." }
  ];
  const score = Math.round(factors.reduce((s,f)=>s+f.score*f.weight,0));
  return { score, category:score<=30?"Lower":score<=60?"Medium":"Higher", factors, note:"Illustrative rule-based score, not a validated underwriting model." };
}
function claimsTable(claims) {
  if (!claims.length) return `<div class="empty-state"><strong>No claims yet</strong>When you report an incident, it will appear here.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>CLAIM ID</th><th>INCIDENT</th><th>DATE</th><th>STATUS</th><th></th></tr></thead><tbody>${claims.map(c=>`<tr><td><strong>${esc(c.id)}</strong></td><td>${esc(c.description.slice(0,40))}${c.description.length>40?"…":""}</td><td>${dateFmt(c.incidentDate)}</td><td>${statusPill(c.status)}</td><td><button class="table-link" data-show-claim="${esc(c.id)}">Details ↗</button></td></tr>`).join("")}</tbody></table></div>`;
}
function renderVehicles() {
  const vehicles = state.data.vehicles;
  $("#pageContent").innerHTML = `${pageHeader("My vehicles","Manage your motorcycles and scooters. Vehicle details power your illustrative risk assessment.",`<button class="btn btn-primary" data-action="add-vehicle">＋ Add vehicle</button>`)}
  <section class="section-grid">${vehicles.map(v=>`<article class="panel"><div class="panel-heading"><div><p class="eyebrow">REGISTERED VEHICLE</p><h3>${esc(v.make)} ${esc(v.model)}</h3></div><span class="metric-icon blue">◈</span></div><div class="policy-hero"><div class="policy-symbol">🏍</div><div class="policy-copy"><strong>${esc(v.registration)}</strong><small>${esc(v.year)} · ${v.usage==="delivery"?"Delivery use":"Personal use"}</small></div></div><div class="policy-meta"><div><small>ANNUAL USAGE</small><strong>${Number(v.annualKm).toLocaleString()} km</strong></div><div><small>RISK CATEGORY</small><strong>${calcRiskLocal(v,state.data.claims).category}</strong></div><div><small>SAFETY</small><strong>${esc(v.safety)}</strong></div></div><div class="form-actions"><button class="btn btn-primary" data-select-vehicle="${esc(v.id)}">Assess risk</button><button class="btn btn-ghost" data-quote-vehicle="${esc(v.id)}" data-action="quote-vehicle">Get quote</button></div></article>`).join("") || `<div class="panel empty-state"><strong>No vehicles added</strong>Add your first two-wheeler to continue.</div>`}</section>
  <section class="panel" style="margin-top:16px"><div class="panel-heading"><div><p class="eyebrow">RISK MODEL</p><h3>Vehicle risk assessment</h3></div></div>${state.selectedVehicleId ? renderRiskDetails(state.selectedVehicleId) : `<p class="muted">Select “Assess risk” on a vehicle card to see the model score and factor breakdown.</p>`}</section>`;
}
function renderRiskDetails(vehicleId) {
  const v=state.data.vehicles.find(x=>x.id===vehicleId); if(!v) return "";
  const risk=calcRiskLocal(v,state.data.claims);
  return `<div class="risk-layout"><div class="risk-score-card"><div class="risk-gauge" style="--score-angle:${risk.score*3.6}deg"><div class="risk-gauge-inner"><strong>${risk.score}</strong><small>OUT OF 100</small></div></div><div><p class="eyebrow">ILLUSTRATIVE RISK</p><h3 style="margin:0 0 7px">${risk.category} risk</h3><p class="form-note">${risk.note}</p></div></div><div>${risk.factors.map(f=>`<div class="factor-row"><div class="factor-head"><span>${f.label} <small style="color:#71839f">(${Math.round(f.weight*100)}%)</small></span><span>${f.score}/100</span></div><div class="factor-track"><div class="factor-fill" style="width:${f.score}%"></div></div><p class="form-note">${f.explanation}</p></div>`).join("")}</div></div>`;
}
function showVehicleModal() {
  openModal("Add a two-wheeler", `<form id="vehicleForm"><div class="form-grid"><div class="field"><label>Registration number *</label><input name="registration" placeholder="PB-00-AB-1234" required></div><div class="field"><label>Vehicle type *</label><select name="kind"><option value="scooter">Scooter</option><option value="motorcycle">Motorcycle</option></select></div><div class="field"><label>Make *</label><input name="make" placeholder="Honda" required></div><div class="field"><label>Model *</label><input name="model" placeholder="Activa 6G" required></div><div class="field"><label>Manufacturing year *</label><input name="year" type="number" min="1990" max="${new Date().getFullYear()}" value="2023" required></div><div class="field"><label>Usage</label><select name="usage"><option value="personal">Personal</option><option value="delivery">Delivery / commercial use</option></select></div><div class="field"><label>Estimated annual kilometres</label><input name="annualKm" type="number" min="0" value="8000" required></div><div class="field"><label>Safety measures</label><select name="safety"><option value="standard">Standard</option><option value="strong">Strong</option><option value="limited">Limited</option></select></div></div><div class="form-actions"><button class="btn btn-primary" type="submit">Save vehicle</button><button class="btn btn-ghost" type="button" data-close-modal>Cancel</button></div></form><p class="modal-footnote">Use fictional vehicle information for the public demo.</p>`);
}
function renderPlans() {
  const vehicles=state.data.vehicles;
  $("#pageContent").innerHTML=`${pageHeader("Insurance plans","Compare illustrative two-wheeler cover options. Final coverage and pricing depend on actual policy terms.",`<button class="btn btn-ghost" data-page="vehicles">Manage vehicles</button>`)}
  ${!vehicles.length?`<div class="notice warning">Add a vehicle before generating a quote. <button class="text-btn" data-action="add-vehicle">Add vehicle →</button></div>`:`<div class="panel" style="margin-bottom:16px"><div class="form-grid"><div class="field"><label>Choose vehicle</label><select id="quoteVehicleSelect">${vehicles.map(v=>`<option value="${esc(v.id)}" ${v.id===state.selectedVehicleId?"selected":""}>${esc(v.make)} ${esc(v.model)} · ${esc(v.registration)}</option>`).join("")}</select></div><div class="field"><label>Quote note</label><div class="notice">Sample prices are for academic demonstration only and are not real offers.</div></div></div></div><div class="plan-grid">${state.plans.map(p=>`<article class="plan-card ${p.id==="combined"?"featured":""}">${p.id==="combined"?'<span class="plan-badge">DEMO FEATURED</span>':'<span class="plan-badge">SAMPLE PLAN</span>'}<h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="plan-price">${money(p.price)}<small> / year*</small></div><ul class="feature-list">${p.features.map(f=>`<li>${esc(f)}</li>`).join("")}</ul><button class="btn ${p.id==="combined"?"btn-primary":"btn-ghost"}" style="width:100%" data-choose-plan="${esc(p.id)}">Calculate quote →</button></article>`).join("")}</div><p class="form-note" style="margin-top:14px">*All premiums are fictional demo assumptions. No policy is issued and no payment is collected.</p>`}`;
}
function showQuoteModal(planId, vehicleId) {
  const vId=vehicleId||$("#quoteVehicleSelect")?.value||state.data.vehicles[0]?.id;
  if(!vId) { closeModal(); showVehicleModal(); return; }
  const plan=state.plans.find(p=>p.id===planId); if(!plan) return;
  api("/api/quote",{method:"POST",body:JSON.stringify({vehicleId:vId,planId,ownerId:state.user.id})}).then(q=>{
    state.currentQuote={...q,planName:plan.name,vehicle:state.data.vehicles.find(v=>v.id===vId)};
    openModal("Your illustrative quote",`<div class="notice">This is a sample educational quote, not a binding insurance offer.</div><div class="policy-hero" style="margin-top:14px"><div class="policy-symbol">◇</div><div class="policy-copy"><strong>${esc(plan.name)}</strong><small>${esc(state.currentQuote.vehicle.make)} ${esc(state.currentQuote.vehicle.model)}</small></div></div><div class="risk-score-card" style="margin-top:12px"><div><p class="eyebrow">INDICATIVE ANNUAL PREMIUM</p><div class="plan-price">${money(q.indicativePremium)}</div><p class="form-note">Base demo rate ${money(q.basePremium)} adjusted by the illustrative risk score.</p></div><div class="risk-gauge" style="--score-angle:${q.risk.score*3.6}deg"><div class="risk-gauge-inner"><strong>${q.risk.score}</strong><small>RISK SCORE</small></div></div></div><p class="form-note" style="margin-top:12px">Risk category: <strong>${q.risk.category}</strong>. ${esc(q.risk.note)}</p><div class="form-actions" style="margin-top:18px"><button class="btn btn-primary" id="activateDemoPolicy">Activate demo policy</button><button class="btn btn-ghost" data-close-modal>Close</button></div>`);
    $("#activateDemoPolicy").addEventListener("click",()=>activatePolicy(q,plan));
  }).catch(e=>toast(e.message,"error"));
}
async function activatePolicy(q, plan) {
  try {
    await api("/api/policies/activate", { method:"POST", body:JSON.stringify({
      ownerId:state.user.id, vehicleId:q.vehicleId, planId:q.planId, premium:q.indicativePremium
    }) });
    toast("Demo policy activated. No real insurance was issued.","success"); closeModal(); await refreshData(); go("home");
  } catch(e){toast(e.message,"error");}
}
function renderClaims() {
  const d=state.data;
  $("#pageContent").innerHTML=`${pageHeader("Claims & assistance","Submit accident evidence, receive a preliminary assessment, and track the insurer's review.",`<button class="btn btn-primary" data-action="new-claim">＋ File a claim</button>`)}
  <div class="notice warning" style="margin-bottom:16px"><strong>Photo assessment limitation:</strong> Version 1 checks policy details, required fields and evidence completeness. It does not visually recognize vehicle damage. Final claim decisions require insurer review.</div>
  <section class="panel activity-panel"><div class="panel-heading"><div><p class="eyebrow">CLAIM HISTORY</p><h3>Your claims</h3></div><span class="metric-trend neutral">${d.claims.length} RECORDS</span></div>${claimsTable(d.claims)}</section>
  ${d.claims.map(c=>`<section class="panel" style="margin-top:14px"><div class="panel-heading"><div><p class="eyebrow">${esc(c.id)}</p><h3>${esc(c.description)}</h3></div>${statusPill(c.status)}</div><div class="policy-meta"><div><small>INCIDENT DATE</small><strong>${dateFmt(c.incidentDate)}</strong></div><div><small>ASSESSMENT</small><strong>${esc(c.recommendation||"Pending")}</strong></div><div><small>ESTIMATED DAMAGE</small><strong>${money(c.estimatedDamage)}</strong></div></div><p class="form-note">${esc(c.recommendationReason||"Awaiting review.")}</p>${c.photos?.length?`<div class="claim-photo-list">${c.photos.map(p=>`<a href="${esc(p.url)}" target="_blank" rel="noopener"><img src="${esc(p.url)}" alt="Claim damage photo"></a>`).join("")}</div>`:""}${c.decisionReason?`<div class="notice">${esc(c.decisionReason)} ${c.approvedAmount?`Approved demo amount: <strong>${money(c.approvedAmount)}</strong>.`:""}</div>`:""}</section>`).join("")}`;
}
function showClaimModal() {
  const d=state.data, policies=d.policies.filter(p=>p.ownerId===state.user.id), vehicles=d.vehicles;
  if(!policies.length) { toast("Create a demo policy before submitting a claim.","error"); go("plans"); return; }
  state.selectedPhotos=[];
  openModal("Report an accident",`<form id="claimForm"><div class="notice warning" style="margin-bottom:15px">Use sample images only. Uploads are stored by the local demo server. Do not upload real personal or sensitive documents.</div><div class="form-grid"><div class="field"><label>Policy *</label><select name="policyId" required>${policies.map(p=>`<option value="${esc(p.id)}">${esc(p.id)} · ${esc(planName(p.plan))}</option>`).join("")}</select></div><div class="field"><label>Vehicle *</label><select name="vehicleId" required>${vehicles.map(v=>`<option value="${esc(v.id)}">${esc(v.make)} ${esc(v.model)} · ${esc(v.registration)}</option>`).join("")}</select></div><div class="field"><label>Incident date *</label><input type="date" name="incidentDate" max="${new Date().toISOString().slice(0,10)}" required></div><div class="field"><label>Incident location *</label><input name="location" placeholder="e.g. demo road / city" required></div><div class="field"><label>Estimated damage (₹) *</label><input name="estimatedDamage" type="number" min="1" value="5000" required></div><div class="field"><label>Incident type</label><select name="incidentType"><option>Collision</option><option>Fall / skid</option><option>Object impact</option><option>Other</option></select></div></div><div class="field"><label>Describe what happened *</label><textarea name="description" minlength="12" placeholder="Describe the incident and visible damage…" required></textarea></div><div class="field"><label>Damage photographs * (JPG, PNG or WebP; up to 5 photos, 5 MB each)</label><label class="photo-drop" for="claimPhotos"><span class="drop-icon">⇧</span><strong>Click to upload damage photos</strong><small>Front, side, rear or close-up images</small></label><input id="claimPhotos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden><div class="photo-grid" id="photoPreview"></div></div><label class="compliance-item"><input type="checkbox" name="declaration" required><span><strong>I confirm these are sample/demo details and understand this is not a real insurance claim.</strong><small>For a real policy, the insurer's evidence and declaration requirements would apply.</small></span></label><div class="form-actions"><button class="btn btn-primary" type="submit">Submit demo claim</button><button class="btn btn-ghost" type="button" data-close-modal>Cancel</button></div></form>`,()=>{
    $("#claimPhotos").addEventListener("change", e=>{
      const files=[...e.target.files]; if(files.length>5){toast("Choose up to 5 photos.","error");e.target.value="";return;}
      if(files.some(f=>f.size>5*1024*1024)){toast("Each photo must be 5 MB or smaller.","error");e.target.value="";return;}
      if(files.some(f=>!["image/jpeg","image/png","image/webp"].includes(f.type))){toast("Only JPG, PNG and WebP images are accepted.","error");e.target.value="";return;}
      state.selectedPhotos=files; updatePhotoPreview();
    });
  });
}
function updatePhotoPreview() {
  const box=$("#photoPreview"); if(!box)return;
  box.innerHTML=state.selectedPhotos.map((f,i)=>`<div class="photo-thumb"><img src="${URL.createObjectURL(f)}" alt="Selected damage photo"><button type="button" data-remove-photo="${i}" aria-label="Remove photo">×</button></div>`).join("");
}
async function handleForms(e) {
  if(e.target.id==="vehicleForm") {
    e.preventDefault(); const f=new FormData(e.target); const body=Object.fromEntries(f.entries()); delete body.kind;
    try { const result=await api("/api/vehicles",{method:"POST",body:JSON.stringify({...body,ownerId:state.user.id})}); state.selectedVehicleId=result.vehicle.id; closeModal(); await refreshData(); go("vehicles"); toast("Vehicle saved.","success"); }
    catch(err){toast(err.message,"error");}
  }
  if(e.target.id==="claimForm") {
    e.preventDefault(); if(!state.selectedPhotos.length){toast("Upload at least one damage photo.","error");return;}
    const form=e.target; const fd=new FormData();
    ["policyId","vehicleId","incidentDate","location","description","estimatedDamage"].forEach(k=>fd.append(k,form.elements[k].value));
    fd.append("ownerId",state.user.id); state.selectedPhotos.forEach(f=>fd.append("photos",f));
    try { const result=await api("/api/claims",{method:"POST",body:fd}); closeModal(); await refreshData(); go("claims"); toast(`Claim ${result.claim.id} submitted for review.`,"success"); }
    catch(err){toast(err.message,"error");}
  }
}
function handleChanges(e) {
  if(e.target.id==="quoteVehicleSelect") state.selectedVehicleId=e.target.value;
}
function renderAssistant() {
  const intro=state.lang==="hi"?"नमस्ते! मैं DriveCover का डेमो बीमा सहायक हूँ। मैं पॉलिसी, प्रीमियम, पात्रता, दस्तावेज़ और क्लेम स्थिति में मदद कर सकता हूँ।":"Hello! I'm the DriveCover demo insurance assistant. I can help with policy coverage, premiums, eligibility, required documents and claim status.";
  $("#pageContent").innerHTML=`${pageHeader("AI insurance assistant","Ask about policy coverage, quotations and claims. Version 1 uses predefined, data-aware responses.",`<button class="btn btn-ghost" id="clearChat">Clear chat</button>`)}
  <div class="notice" style="margin-bottom:14px">Rule-based demo assistant · Optional AI API integration is reserved for a future version. Do not enter sensitive personal information.</div>
  <section class="chat-layout"><aside class="chat-topics"><h3>Suggested questions</h3><button class="topic-btn" data-chat-topic="What does my policy cover?">◇ What does my policy cover?</button><button class="topic-btn" data-chat-topic="How is my premium calculated?">₹ How is my premium calculated?</button><button class="topic-btn" data-chat-topic="What documents do I need for a claim?">▤ Required claim documents</button><button class="topic-btn" data-chat-topic="How do I report an accident?">＋ How do I report an accident?</button><button class="topic-btn" data-chat-topic="Check my claim status">◷ Check my claim status</button><button class="topic-btn" data-chat-topic="Am I eligible for a claim?">✓ Policy eligibility</button></aside>
  <div class="chat-window"><div class="chat-head"><div class="bot-avatar">✳</div><div><strong>DriveCover Assistant</strong><small>● Online · Demo mode</small></div></div><div class="chat-messages" id="chatMessages">${state.chatMessages.length?state.chatMessages.map(m=>`<div class="chat-message ${m.role}">${esc(m.text)}</div>`).join(""):`<div class="chat-message bot">${intro}</div>`}</div><form class="chat-compose" id="chatForm"><input class="chat-input" id="chatInput" name="message" placeholder="${state.lang==="hi"?"अपना सवाल लिखें…":"Ask a question…"}" autocomplete="off" required><button class="btn btn-primary" type="submit">Send ↗</button></form></div></section>`;
  $("#clearChat").addEventListener("click",()=>{state.chatMessages=[];renderAssistant();});
  const msgs=$("#chatMessages"); msgs.scrollTop=msgs.scrollHeight;
}
async function sendChat(message) {
  state.chatMessages.push({role:"user",text:message});
  try { const result=await api("/api/chat",{method:"POST",body:JSON.stringify({message,language:state.lang,userId:state.user.id})}); state.chatMessages.push({role:"bot",text:result.reply}); }
  catch(e){state.chatMessages.push({role:"bot",text:"I couldn't retrieve demo information just now. Please try again."});}
  renderAssistant();
}
document.addEventListener("submit", e=>{ if(e.target.id==="chatForm"){e.preventDefault();const input=$("#chatInput");if(input.value.trim())sendChat(input.value.trim());} });
function renderLedger() {
  const entries=state.data.ledger;
  $("#pageContent").innerHTML=`${pageHeader("Simulated claim ledger","A demo append-only event history for claim decisions and simulated payouts.",`<button class="btn btn-ghost" id="verifyLedger">Verify ledger</button>`)}
  <div class="notice warning" style="margin-bottom:16px">This is a local simulation, not a deployed blockchain. Entries are hash-linked for educational demonstration; a real system needs server-side access controls and durable storage.</div>
  <section class="panel"><div class="panel-heading"><div><p class="eyebrow">EVENT HISTORY</p><h3>Transaction records</h3></div><span class="metric-trend neutral">${entries.length} EVENTS</span></div>${entries.map(e=>`<div class="ledger-row"><div class="ledger-dot">▦</div><div><strong>${esc(e.eventType.replaceAll("_"," "))}</strong><small>${esc(e.claimId)} · ${new Date(e.createdAt).toLocaleString()}</small><small>${esc(JSON.stringify(e.payload||{}))}</small></div><div class="ledger-hash">HASH<br>${esc((e.hash||"").slice(0,20))}…</div></div>`).join("")}</section>`;
  $("#verifyLedger").addEventListener("click",()=>{const valid=entries.every((e,i)=>i===0?e.previousHash==="GENESIS":e.previousHash===entries[i-1].hash);toast(valid?"Ledger link check passed for displayed entries.":"Ledger link mismatch detected.","success");});
}
function renderAdmin() {
  const d=state.data, claims=d.claims, open=claims.filter(c=>!["approved","rejected"].includes(c.status)), approved=claims.filter(c=>c.status==="approved"), premiums=d.policies.reduce((s,p)=>s+p.premium,0), payout=approved.reduce((s,c)=>s+Number(c.approvedAmount||0),0);
  $("#pageContent").innerHTML=`${pageHeader("Administrator console","Review demo claims, inspect photo evidence, and monitor prototype performance.",`<button class="btn btn-ghost" data-page="ledger">View ledger ↗</button>`)}
  <div class="notice warning" style="margin-bottom:16px">Admin access is a demo role switch, not production authentication. Use fictional data only.</div>
  <section class="admin-metrics"><article class="admin-metric"><small>DEMO POLICIES</small><strong>${d.policies.length}</strong></article><article class="admin-metric"><small>OPEN CLAIMS</small><strong>${open.length}</strong></article><article class="admin-metric"><small>APPROVED CLAIMS</small><strong>${approved.length}</strong></article><article class="admin-metric"><small>SIMULATED APPROVALS</small><strong>${money(payout)}</strong></article></section>
  <div class="admin-tabs"><button class="tab-btn ${state.adminTab==="claims"?"active":""}" data-admin-tab="claims">Claim review</button><button class="tab-btn ${state.adminTab==="finance"?"active":""}" data-admin-tab="finance">Financial model</button><button class="tab-btn ${state.adminTab==="compliance"?"active":""}" data-admin-tab="compliance">Compliance checklist</button><button class="tab-btn ${state.adminTab==="policies"?"active":""}" data-admin-tab="policies">Policies</button></div>
  <div id="adminPanel">${renderAdminTab()}</div>`;
}
function renderAdminTab() {
  const d=state.data;
  if(state.adminTab==="claims") return d.claims.length?d.claims.map(c=>`<article class="claim-review-card"><div class="claim-review-head"><div><h4>${esc(c.id)} · ${esc(c.description.slice(0,65))}</h4><p>${esc(c.ownerId)} · Incident ${dateFmt(c.incidentDate)} · Estimate ${money(c.estimatedDamage)}</p></div>${statusPill(c.status)}</div><p class="form-note">Preliminary recommendation: <strong>${esc(c.recommendation||"pending")}</strong> — ${esc(c.recommendationReason||"No assessment yet.")}</p>${c.photos?.length?`<div class="claim-photo-list">${c.photos.map(p=>`<a href="${esc(p.url)}" target="_blank" rel="noopener"><img src="${esc(p.url)}" alt="Claim damage photo"></a>`).join("")}</div>`:`<p class="form-note">No photos attached to this sample claim.</p>`}<button class="btn btn-primary" data-review-claim="${esc(c.id)}" ${["approved","rejected"].includes(c.status)?"disabled":""}>Review claim</button>${c.decisionReason?`<p class="form-note">Decision: ${esc(c.decisionReason)}</p>`:""}</article>`).join(""):`<div class="panel empty-state"><strong>No claims to review</strong>New submitted claims will appear here.</div>`;
  if(state.adminTab==="finance") {
    const serviceRevenue=d.policies.length*300, operatingCosts=100000, grossPremium=d.policies.reduce((s,p)=>s+p.premium,0), claimCosts=d.claims.filter(c=>c.status==="approved").reduce((s,c)=>s+Number(c.approvedAmount||0),0);
    return `<div class="section-grid"><article class="admin-metric"><small>ILLUSTRATIVE GROSS PREMIUMS</small><strong>${money(grossPremium)}</strong><p class="form-note">Insurer-side sample portfolio figure, not DriveCover revenue.</p></article><article class="admin-metric"><small>DRIVECOVER SERVICE REVENUE</small><strong>${money(serviceRevenue)}</strong><p class="form-note">Assumed ₹300 service revenue per demo policy.</p></article><article class="admin-metric"><small>APPROVED DEMO CLAIMS</small><strong>${money(claimCosts)}</strong><p class="form-note">Sum of approved sample claim amounts.</p></article><article class="admin-metric"><small>ILLUSTRATIVE OPERATING RESULT</small><strong>${money(serviceRevenue-operatingCosts)}</strong><p class="form-note">Service revenue minus assumed ₹100,000 annual operating costs.</p></article></div><div class="notice">These figures are educational assumptions. Insurance premiums are not automatically DriveCover's revenue. Actual costs, taxes, reserves, reinsurance and legal arrangements are excluded.</div>`;
  }
  if(state.adminTab==="policies") return `<div class="panel">${d.policies.map(p=>{const v=d.vehicles.find(v=>v.id===p.vehicleId);return `<div class="ledger-row"><div class="ledger-dot">◇</div><div><strong>${esc(p.id)} · ${esc(planName(p.plan))}</strong><small>${esc(p.ownerId)} · ${esc(v?`${v.make} ${v.model}`:"Vehicle unavailable")}</small></div><div>${money(p.premium)}<br>${statusPill(p.status)}</div></div>`}).join("")}</div>`;
  const items=[["Authorization and distribution","The proposed service works with an appropriately authorized insurer and permitted distribution partners."],["Clear policy wording","Coverage, exclusions, limits, premium assumptions and claim conditions are disclosed."],["Privacy and consent","Collect only necessary information and explain its use."],["Secure claims handling","Protect evidence files and restrict access to claim records."],["AI fairness and oversight","Treat risk scores and photo-related flags as decision support, not automatic denial."],["Grievance redressal","Provide a clear complaint and escalation route."],["Audit records","Maintain decision history and simulated transaction records."],["Product classification","Verify applicable IRDAI rules before describing a product as formally regulated microinsurance."]];
  return `<div class="panel"><div class="panel-heading"><div><p class="eyebrow">PROJECT CHECKLIST</p><h3>Compliance readiness</h3></div><span class="metric-trend neutral">DEMO CHECKLIST</span></div>${items.map((it,i)=>`<label class="compliance-item"><input type="checkbox" data-compliance="${i}" ${state.compliance[i]?"checked":""}><span><strong>${esc(it[0])}</strong><small>${esc(it[1])}</small></span></label>`).join("")}<p class="form-note">This checklist is for coursework planning and is not legal advice or proof of regulatory compliance.</p></div>`;
}
function showClaimReview(claimId) {
  const c=state.data.claims.find(c=>c.id===claimId); if(!c)return;
  openModal(`Review ${c.id}`,`<div class="notice warning">Photo files are displayed as evidence. The current model does not visually classify damage or verify accident authenticity.</div><p class="form-note" style="margin:12px 0">${esc(c.recommendationReason||"No recommendation.")}</p>${c.photos?.length?`<div class="claim-photo-list">${c.photos.map(p=>`<a href="${esc(p.url)}" target="_blank" rel="noopener"><img src="${esc(p.url)}" alt="Damage evidence"></a>`).join("")}</div>`:""}<form id="decisionForm"><div class="field"><label>Decision</label><select name="decision"><option value="approved">Approve claim</option><option value="rejected">Reject claim</option><option value="more_info">Request more information</option></select></div><div class="field"><label>Approved amount (₹), if approved</label><input name="approvedAmount" type="number" min="1" value="${Math.max(1,Number(c.estimatedDamage||1000))}"></div><div class="field"><label>Decision reason *</label><textarea name="reason" minlength="5" required placeholder="Explain the review decision…"></textarea></div><div class="form-actions"><button class="btn btn-primary" type="submit">Save decision</button><button class="btn btn-ghost" type="button" data-close-modal>Cancel</button></div></form>`);
  $("#decisionForm").addEventListener("submit",async e=>{
    e.preventDefault();const f=new FormData(e.target),body=Object.fromEntries(f.entries());
    try {await api(`/api/claims/${encodeURIComponent(c.id)}/decision`,{method:"POST",body:JSON.stringify(body)});closeModal();await refreshData();go("admin");toast("Claim decision saved to the simulated ledger.","success");}
    catch(err){toast(err.message,"error");}
  });
}
async function submitDecision(decision) { toast(`Selected ${decision}. Open claim review to provide the required decision details.`); }
async function resetDemo() {
  if(!confirm("Reset all server-side demo data and remove uploaded demo photos? This cannot be undone."))return;
  try { await api("/api/reset-demo",{method:"POST",body:JSON.stringify({})}); await refreshData(); go(state.role==="admin"?"admin":"home"); toast("Demo data reset.","success"); }
  catch(e){toast(e.message,"error");}
}
document.addEventListener("click", e=>{
  if(e.target.id==="verifyLedger") { const entries=state.data.ledger; const valid=entries.every((entry,i)=>i===0?entry.previousHash==="GENESIS":entry.previousHash===entries[i-1].hash);toast(valid?"Ledger links are consistent in the displayed data.":"Ledger link mismatch detected.",valid?"success":"error"); }
  const qv=e.target.closest("[data-quote-vehicle]"); if(qv){state.selectedVehicleId=qv.dataset.quoteVehicle;go("plans");setTimeout(()=>showQuoteModal("combined",state.selectedVehicleId),50);}
});
document.addEventListener("change", e=>{
  if(e.target.matches("[data-compliance]")){state.compliance[e.target.dataset.compliance]=e.target.checked;}
});
document.addEventListener("submit", e=>{
  if(e.target.id==="chatForm"){e.preventDefault();const input=$("#chatInput");if(input.value.trim())sendChat(input.value.trim());}
});
init();

