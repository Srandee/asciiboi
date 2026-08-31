# asciiboi

Mobile web app: scan a QR code, store the payload, spend a credit, hatch a little guy.

For now the hatch is local. Five portraits live in `public/bois/`, catalogued in `public/bois/catalog.json`. The scanned payload is hashed and mapped onto one of those five photos (same code always hatches the same guy).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Scan** a QR with the camera, upload a QR photo, type a payload, or tap a sample
- Codes are stored in the pocket even before hatching
- **Hatch** costs 1 credit and picks the portrait from the hash
- **Shop** adds demo credits (no real payment)

Starter wallet: 5 credits.
