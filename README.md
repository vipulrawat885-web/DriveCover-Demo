# DriveCover — Motor Microinsurance Prototype

DriveCover is an educational InsurTech website for the FIN367 assignment. It demonstrates a dark premium interface, sample two-wheeler quotes, explainable risk scoring, a rule-based English/Hindi assistant, photo-assisted claim intake, admin review, a simulated claim ledger, and a sample financial model.

## Requirements

- Node.js 18 or later
- Visual Studio Code (recommended)
- A modern browser

## Run locally

1. Extract/open this folder in VS Code.
2. Open a terminal in this folder.
3. Run `npm install`
4. Run `npm start`
5. Open `http://localhost:3000`

## Demo roles

- Customer: choose the customer demo workspace (Aman Sharma)
- Admin: use the role switch button in the sidebar and choose the administrator workspace

There are no real passwords, policies, underwriting decisions or payments. The app is a demo and should use fictional data only.

## Main features

- Responsive dark navy/blue design
- Customer and admin demo roles
- Vehicle registration and sample quotations
- Explainable weighted risk score
- English/Hindi rule-based chatbot
- Claim submission with 1–5 JPG/PNG/WebP images, max 5 MB each
- Admin claim review, approve/reject/request information
- Simulated append-only, hash-linked ledger
- Sample business and financial metrics
- Compliance checklist

## Important limitations

- The current risk score is a transparent rule-based illustration, not a validated underwriting model.
- The claim intake validates fields and photo presence. It does **not** use computer vision to determine physical damage from an image.
- Final simulated claim decisions are made by the admin demo role.
- `localStorage` is suitable for demo preferences only. The current Node backend stores sample records in `data/db.json` and uploads in `uploads/`. This is not production-grade storage or authentication.
- The demo role switch is not secure authorization. Do not expose sensitive information or use real customer documents.
- The simulated ledger is not a real blockchain.
- Quotes and payouts are simulated; no real payments occur.
- The optional AI API is not connected in v1.

## Deploying publicly

Because the prototype uses Express, disk-based JSON persistence and uploaded images, deploy it to a Node-capable host with persistent storage if you need records and uploads to survive restarts. Static-only hosting such as GitHub Pages cannot run this backend. On ephemeral serverless hosting, local files may be discarded. For a production-quality public deployment, replace demo role switching, JSON-file storage and local uploads with secure authentication, a database, managed file storage, server-side authorization, and appropriate privacy/security controls.

Set the port with the `PORT` environment variable if required by your hosting provider.

## Resetting sample data

Use **Reset demo data** in the sidebar. The administrator role is required. This removes uploaded demo images and restores the server-side sample records. Demo policy activations created in browser storage are also cleared.
