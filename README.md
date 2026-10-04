# Free QR Code Generator

A tiny, open-source QR code generator that runs entirely in your browser.

**Live:** https://agentiloop.github.io/free-qr-code-generator/

- URL, text, WiFi, contact (vCard), email, SMS and phone QR codes
- PNG and SVG download, custom colors, selectable error correction (L/M/Q/H)
- No sign-up, no tracking, no network requests after the page loads: WiFi passwords and contact details never leave your device
- Works offline: save the page or clone the repo and open `index.html`
- Static QR codes never expire, because the content is stored in the code itself

## Use it locally

```sh
git clone https://github.com/AgentiLoop/free-qr-code-generator
open free-qr-code-generator/index.html
```

No build step and no dependencies: `index.html`, `app.js` and the bundled `qrcode.js`.

## Payload formats

| Type | Encoded as |
|------|------------|
| URL | `https://…` (scheme added if missing) |
| WiFi | `WIFI:T:WPA;S:<ssid>;P:<password>;;` (special characters escaped) |
| Contact | vCard 3.0 |
| Email | `mailto:to?subject=…&body=…` |
| SMS | `SMSTO:<number>:<message>` |
| Phone | `tel:<number>` |

## Need an editable QR code?

Codes made here are static: they can't be changed after printing. If you need a dynamic QR code whose destination you can change later, with scan counts and no monthly subscription, see [ForeverQR](https://wasm5.com/?ref=github) (one-time payment, by the same authors). It also has free generators for restaurant menus, Google reviews, bulk CSV → ZIP and printable signs: [wasm5.com/qr-code-generators](https://wasm5.com/qr-code-generators?ref=github).

## License

MIT. Includes [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) by Kazuhiko Arase (MIT).
"QR Code" is a registered trademark of DENSO WAVE INCORPORATED.
