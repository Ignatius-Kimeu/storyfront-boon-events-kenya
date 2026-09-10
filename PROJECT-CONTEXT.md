# Boon Events Kenya — project context handoff

A briefing for anyone (or any AI) picking this build up cold. Everything below
is what was actually verified, built and shipped, plus what is still open.

**Live demo:** https://ignatius-kimeu.github.io/storyfront-boon-events-kenya/
**Repo:** https://github.com/Ignatius-Kimeu/storyfront-boon-events-kenya (public, GitHub Pages on `main` / root)
**Built:** 10 September 2026

---

## 1. The business

| Field | Value |
|---|---|
| Name | Boon Events Kenya |
| Owner / operator | **Mercy** (surname not published anywhere; she signs off "Mercy x") |
| Category | Event planner — venue, decor, catering, balloon decor |
| Location | Karen, Nairobi, Kenya. No street address is published. |
| Phone | 0111 880403 |
| WhatsApp | +254 111 880403 → `wa.me/254111880403` |
| Booking hours | Mon–Sun, 9:00am – 6:00pm |
| Google listing | "BOON EVENTS KENYA", Event planner, Karen. **Zero reviews** ("Be the first to review"). |
| Branch | **A** — no website. The "Website" button on the Google listing points at Instagram. |
| Tier | **Premium** — full-service |

### Social accounts

| Platform | Handle | Reach (as at 10 Sep 2026) |
|---|---|---|
| Instagram | [@boon_eventskenya](https://www.instagram.com/boon_eventskenya/) | 20.9K followers, 1,030 posts, 95 following |
| TikTok | [@boon_eventskenya](https://www.tiktok.com/@boon_eventskenya) | 2,404 followers, 16.8K likes, 181 following |
| Facebook | Boon Events Kenya | 237 followers |
| YouTube | [@boon_eventskenya](https://www.youtube.com/@boon_eventskenya) | not measured |
| Threads | boon_eventskenya | not measured |

Contact details are **consistent across all three main platforms** — same number,
same location, same hours. No drift, no dead links found. Mercy states "NO DMs"
on both Instagram and TikTok; WhatsApp or a call is the only route in. The site
repeats that line on the contact page and in the footer.

---

## 2. Brand identity

Derived by sampling the client's supplied logo JPEG at pixel level (the logo is
a circular seal: "BOON" in heavy blue sans, "EVENTS KENYA" in a green
letterspaced serif, ringed by "VENUE, DECOR PLANNER · CATERING AND BALLOON
DECORATIONS" on cream).

| Token | Hex | Where it came from |
|---|---|---|
| Blue (primary) | `#004AAB` | the "BOON" wordmark |
| Blue ink (dark sections) | `#001B3E` | darkened from the primary |
| Green (accent) | `#13B569` | the "EVENTS KENYA" serif |
| Green deep (AA-safe text/buttons) | `#0B7A46` | darkened — `#13B569` fails contrast as text |
| Cream (page ground) | `#F7F5F1` | the seal's background |
| Ink (body copy) | `#1D1C1A` | the ring lettering |

**Typography:** Montserrat (400–800) for UI and body, echoing the geometric
"BOON" and the letterspaced ring text; Cormorant Garamond (500–700) for display
headings, echoing the serif "EVENTS KENYA". Both from Google Fonts.

**Signature motif:** the circular seal. It reappears as the preload splash (logo
disc inside a slowly rotating dashed ring), as the favicon, and as a large
dashed circle bleeding off the corner of every page header.

**Favicon / OG assets** were generated from the logo: `favicon.ico` (16/32/48),
`favicon.png` (512), `apple-touch-icon.png` (180). The `og-image.jpg` is a
purpose-built 1200×630 card — a garden table photo with a blue scrim on the
left, the seal, the wordmark and a green "All-inclusive from KES 2,500 pp" pill.

The WhatsApp floating button and all WhatsApp CTAs are **brand blue**, never
WhatsApp green — deliberate, since the brand's own accent green is close enough
to WhatsApp's to read as the default if used there.

---

## 3. Pages built

All at repo root. Shared header, footer, stylesheet and script across every page.

| File | What it is |
|---|---|
| `index.html` | Home — hero, reach stats, the founding story, six occasion cards, the two films, the three package cards, three testimonials, CTA band, map |
| `services.html` | Packages & pricing — three package cards in full, the three venues, "Kindly note" terms, the seven FAQs |
| `gallery.html` | All 40 photographs, filterable by occasion, with the fullscreen lightbox; the two films repeated below |
| `about.html` | Mercy's story in her own words, how the model works, all eight testimonials |
| `book.html` | **The Premium feature** — the five-step booking request flow |
| `contact.html` | Details, map, "prefer a form?" pointer, the review ask, social links |
| `404.html` | On-brand not-found page |
| `sitemap.xml`, `robots.txt` | Both at root, pointing at the live URL |
| `assets/style.css`, `assets/app.js`, `assets/booking.js` | Shared, cached once across the whole site |

There is **no `films.html`** — deliberate, per instruction. Only two films exist,
and they live in a two-column grid on the home page (and again on the gallery).

---

## 4. The one Premium feature — and why

**A five-step booking request flow (`book.html`) that assembles a structured
WhatsApp message.**

Chosen because Boon is a solo operator (Mercy runs everything herself) and
because her real bottleneck is *incomplete first messages* — she needs occasion,
date, headcount and colours before she can even answer. A real slot-booking
calendar would be wrong here: her availability isn't public, and booking is
explicitly first-pay, not first-click.

The flow: **Occasion → Date & guests → Setting & colours → Extras & notes →
Review & send.**

What makes it more than a form:

- **It knows her rules.** Picking a date detects weekday vs weekend and enforces
  her real minimum — 10 adults on weekends, 15 on weekdays — warning inline
  rather than blocking. A date inside 24 hours triggers her last-minute-notice
  note and suggests phoning instead.
- **It costs the event live.** Adults × 2,500 + children × 1,600, updating as the
  steppers move, clearly labelled a guide and not a quote.
- **It shows the message being written.** A WhatsApp-styled preview pane fills in
  as the user types, so they can see exactly what Mercy will receive.
- **It adapts.** The optional church-setup extra only appears if the occasion is
  a wedding reception.
- Option cards auto-advance on tap; Enter moves forward; validation is per-step.

It is **entirely front-end**. No backend, no database, nothing stored or posted.
The final button opens `wa.me` with the message pre-filled — the user presses
send themselves.

---

## 5. Content — what's real, and where it came from

**Nothing on this site is invented.** Sources below.

### Pricing (published on the site)
- **KES 2,500 per adult** — all-inclusive package. Confirmed in *three* separate
  places: the "BOON EVENTS KAREN" package graphic, the wedding-reception
  graphic, and Google's own "From BOON EVENTS KENYA" business description.
- **KES 2,500 per person** — wedding reception, up to 150 pax, no garden fees.
- **KES 1,600 per child** — kids package. ⚠️ Sourced from a PACKAGES highlight
  that was **78 weeks old** when the lead pack was pulled. Flagged in a code
  comment in `content.py`; a caution note on `services.html` tells visitors to
  confirm current rates with Mercy. **Re-check this figure before quoting it.**

### What the package covers
Verbatim from the package graphic: venue, canopy tent, buffet lunch, water &
soda, gold/white chiavari seats, seat tie backs, dressed tables, charger plates
& cutlery, table runners & napkins, pampas-grass centrepieces.

### "Kindly note" terms and FAQs
All nine terms and all seven FAQs are reproduced **verbatim** from Mercy's own
Instagram highlights, lightly re-punctuated only.

### Testimonials
Eight, transcribed word-for-word from the WhatsApp screenshots in her "KIND
WORDS" highlights. **First names only, and only where Mercy used the name
herself in her reply** — Mukami, Emma, Sharon, Synthia. The other four are shown
as "Anonymous". Each is labelled "Sent to Mercy on WhatsApp". No review is
fabricated, and no star rating is displayed anywhere, because none exists.

### About copy
Mercy's founding story is quoted directly from her "ABOUT ME" highlight.

### Reach numbers
The four home-page stats (20.9K IG followers, 1,030 posts, 16.8K TikTok likes,
150 guests catered) are read straight off her profiles and the package graphic,
with an on-page line saying so.

---

## 6. Media inventory

**40 photographs**, all Boon's own work at Boon's own venues — verified by
reviewing every single one on contact sheets. No stock, nothing borrowed from a
neighbouring business. 35 came through as WhatsApp images, 5 from Instagram
(SnapInsta downloads).

All were **quality-enhanced** (gentle contrast +6%, saturation +7%, brightness
+2%, then an unsharp mask) and written out at two sizes: full at 1600px long
edge (q82) for the lightbox, and a 700px thumbnail (q78) for the grid. Total
~17MB; the gallery grid only ever loads the ~95KB thumbnails, lazily.

Gallery categories: `weddings` (12), `showers` (10), `birthdays` (5),
`graduations` (2), `indoor` (5), `details` (5), `venues` (1).

Every image carries descriptive alt text of what is actually shown.

**2 films**, both from TikTok, both compressed with ffmpeg (CRF 27, faststart,
640px long edge) from ~8.5MB down to ~4.5MB each, with poster frames extracted:

| File | Real view count | Caption (burned into the client's own video) |
|---|---|---|
| `videos/film-civil-wedding.mp4` | 88.8K | "POV: Civil wedding reception (AG). Kes 2500p/p (venue, decor, food)" |
| `videos/film-ag-reception.mp4` | 83.3K | "From the Ag office to your reception. Book the package. Kes 2500 per adult (venue, tent, decor, food)" |

Film titles on the site are written from those real captions rather than being
placeholder text — a deliberate call, since real captions existed and dummy text
would have read as filler. View counts came from the source filenames.

Both autoplay muted on scroll into view, carry a brand-styled sound toggle and a
fullscreen button, and **only one film can have sound at a time** — turning one
on mutes the other.

---

## 7. Decisions taken with the operator (asked, not guessed)

Four ambiguities were put to the operator before any code was written:

1. **Venue count.** Her FAQ and pinned TikTok say *three* venues; the packages
   graphic says *two*. → **Decision: say three.**
2. **Social proof, given zero Google reviews.** → **Decision: transcribe the
   WhatsApp testimonials as text, first-name attribution.** Reach stats are also
   shown, but no star rating is invented.
3. **Pricing.** → **Decision: publish both** the 2,500 adult and 1,600 child
   rates, with the kids figure flagged as possibly stale.
4. **"Boon Garden Events".** A second logo variant and an `@boon_gardenevents`
   watermark appear in her highlights. → **Decision: ignore it; build Boon Events
   Kenya only.** See open questions below.

---

## 8. Open questions / pending actions

- **`@boon_gardenevents`** — is this a former name, a second arm, or a dormant
  account? Not represented on the site at all. Worth asking Mercy.
- **The kids package rate (KES 1,600)** is 78 weeks old. Confirm before quoting.
- **Google review deep-link.** The footer and contact page "Leave us a review"
  buttons currently point at a Google Maps *search* URL for the business, which
  works but takes one extra tap. Once her **Place ID** is captured, swap in the
  proper `https://search.google.com/local/writereview?placeid=…` form. It's a
  one-line change in `common.py` → `REVIEW_URL`.
- **Exact street address** is not published anywhere; the map embed resolves on
  the business name + "Karen, Nairobi". If Mercy shares an address, tighten it.
- **No Google API key is embedded.** The map uses the keyless
  `google.com/maps?q=…&output=embed` iframe, so there is **no key to restrict**
  and no cost/abuse exposure from the public repo. If anyone later swaps in a
  Maps JavaScript or Places API key, it must be restricted by HTTP referrer to
  the live domain before that change ships.
- **Owner's surname** unknown — the site only ever says "Mercy", which is how she
  refers to herself.

---

## 9. Technical notes

- Static files only. Mobile-first. No build step, no framework, no dependencies —
  vanilla CSS and JS throughout.
- Shared `assets/style.css`, `assets/app.js` on every page; `assets/booking.js`
  loads only on `book.html`.
- Header is a smart sticky: hides on scroll down, returns on *any* upward scroll
  from anywhere. Uses a solid background and z-index, **no `backdrop-filter`** —
  that breaks fixed mobile nav panels in Chromium.
- Scroll reveals, counter animations, film autoplay and the lightbox all use
  `IntersectionObserver`, and every animation is gated behind
  `prefers-reduced-motion`.
- Lightbox: keyboard (←/→/Esc), touch swipe, focus return to the opener,
  per-photo caption and an "n of 40" counter.

### Two bugs worth knowing about (found in QA, both fixed)

1. `[hidden]` was being silently defeated by explicit `display:` rules on
   `.btn`, `.note` and friends — the Send button and a warning note were visible
   on the wrong step. Fixed with a global `[hidden]{display:none !important}`.
2. The lightbox used `grid-template-rows:1fr auto`; a bare `1fr` takes its auto
   minimum from the image's *intrinsic* height, so tall portrait photos pushed
   the caption off screen. Fixed with `minmax(0,1fr)` plus an
   absolutely-positioned `object-fit:contain` image.

### QA performed

- Every local reference checked — 58 unique paths, all resolve.
- WCAG AA contrast audit across 28 text/background pairs. Two small-print greys
  failed at 4.15 and 4.45; `#7A766F` was darkened to `#6E6A63` (4.94 / 5.30).
  Everything now passes AA for its size.
- Playwright screenshots of all seven pages at 390px and 1440px.
- Functional tests: full booking flow including validation, the estimate maths,
  the weekday/weekend minimum logic, gallery filtering, the lightbox
  (open/next/Esc), and the mobile nav panel.
- Live smoke test against the deployed URL — zero console, page or request
  errors; OG tags verified as 1200×630 with absolute URLs.
