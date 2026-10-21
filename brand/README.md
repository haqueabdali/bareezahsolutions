# Bareezah Solutions brand kit

The mark is a **B drawn as two ledger bowls** on a rounded seal, with a **brass dot** for approval:
the firm keeps the books and works only once approvals are in place.

## Files

| Use | File | Size |
|-----|------|------|
| Facebook profile picture | `facebook/facebook-profile-2048.png` | 2048 × 2048, shown as a circle |
| Facebook cover photo | `facebook/facebook-cover-1640x624.png` | 1640 × 624, text kept in the centre so phones don't crop it |
| Instagram profile picture | `instagram/instagram-profile-1080.png` | 1080 × 1080, shown as a circle |
| Official pad, for printing | `letterhead/bareezah-letterhead-A4.pdf` | A4, print without scaling ("Actual size") |
| Official pad, for typing letters | `letterhead/bareezah-letterhead-A4.docx` | A4 Word template; header and footer repeat on every page |
| Official pad preview | `letterhead/bareezah-letterhead-A4.png` | 300 dpi |
| Logo, horizontal (transparent) | `logo/bareezah-logo-horizontal.png` | For light backgrounds |
| Logo, horizontal on green | `logo/bareezah-logo-horizontal-on-green.png` | For dark backgrounds |
| Mark only | `logo/bareezah-mark.svg`, `logo/bareezah-mark-1024.png` | App icons, stamps, watermarks |
| Mark, reverse and one-colour | `logo/bareezah-mark-reverse.svg`, `logo/bareezah-mark-mono.svg` | Dark grounds; single-colour printing, rubber stamps, embroidery |

## Colours

| Name | Hex | Use |
|------|-----|-----|
| Ledger green | `#0F5A3F` | Mark field, rules, buttons |
| Deep green | `#0E3A2A` | Wordmark, dark backgrounds |
| Cream | `#F4E8CF` | The B on green, light grounds |
| Brass | `#B8862B` (light: `#DCAA52`) | Dot, "SOLUTIONS", fine rules |

## Type

- Wordmark and headings: **Anek Bangla** (Bold / ExtraBold), covering both Bangla and English
- Body text: **Hind Siliguri**
- Labels and "SOLUTIONS": **IBM Plex Mono**, wide letter-spacing (English only; never letter-space Bangla)

All three are free on Google Fonts. In Word, use Calibri with Nirmala UI for Bangla (already set in the template).

## Rules

- Keep clear space around the mark of at least the height of the brass dot × 2.
- Don't stretch, rotate, recolour outside the palette, or remove the brass dot.
- Smallest size: mark 16 px on screen, 6 mm in print.

## Updating the letterhead contact details

The address and phone number on the pad are placeholders. Edit `CONTACT` at the top of the render script
(`source/render-brand.js`, needs Node.js and Playwright), run it, then rebuild the Word file with `source/make-docx.py` (Python, python-docx). Or send the details to Claude to regenerate.
