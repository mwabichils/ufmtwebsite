# UFMT HIFU service — website

Single page, static HTML, CSS and one small JavaScript file. No build step, no
bundler, no framework, no npm dependencies. It will run on any static host.

Copy originates in `UFMT_Website_Copy_V5.md` and has since been revised against
the *HPCSA Regulatory and Ethical Compliance Audit R1* — see section 9. Layout,
rhythm and motion are modelled on [moovia.be](https://www.moovia.be/), rebuilt on
the UFMT colour, type and accessibility system in `UFMT_Website_Build_Brief.md`.

---

## 1. Files

```
/
├── index.html          all content, all structured data
├── css/styles.css      single stylesheet
├── js/main.js          motion, navigation state, form confirmation only
├── img/                all images ship as WebP with a JPEG or PNG fallback
│   ├── hero-800 / hero            hero photograph, two widths, srcset
│   ├── jc300                      the JC300 HIFU system
│   ├── ufmt-mark                  the icon, cropped out of the master lock-up
│   ├── ufmt-logo-stacked          the full lock-up, used in the overlay menu
│   ├── favicon-32 / favicon-180
│   └── UFMT Logo svg.svg          source file, NOT referenced. See note below.
├── robots.txt
├── llms.txt
├── sitemap.xml
└── README.md
```

## 2. Running it locally

```bash
npx serve -l 8391 .
```

Then open `http://localhost:8391`. Opening `index.html` straight off the disk
also works, but a server is closer to the real thing.

## 3. Deploying

Upload the whole folder to the root of any static host — Netlify, Cloudflare
Pages, Vercel, S3, or ordinary shared hosting. Nothing needs to be compiled.

Before you upload, do a find-and-replace on `DOMAIN-TO-CONFIRM` across
`index.html`, `robots.txt`, `sitemap.xml` and `llms.txt`.

## 4. The form endpoint

The form posts to a third-party form service. There is no database and no
server-side code.

Find this comment in `index.html`:

```html
<!-- FORM ENDPOINT: replace this URL. -->
<form class="form" method="POST" action="https://FORM-ENDPOINT-TO-CONFIRM/" novalidate>
```

Replace the `action` URL with the endpoint from your form service (Formspree,
Basin, Web3Forms and Formsubmit all work with a plain POST). That single change
is all that is required.

How it behaves:

- **With JavaScript off**, the browser posts the form natively and the reader
  lands on the service's own confirmation page.
- **With JavaScript on**, `main.js` intercepts, validates each field, posts with
  `fetch` and shows the approved confirmation message inline without a reload.
- While the action still contains the words `FORM-ENDPOINT`, the script steps
  out of the way entirely so nothing silently swallows a submission during
  development.

A visually hidden honeypot field named `company` catches spam. Configure the
form service to discard any submission where `company` is not empty.

**No analytics, tracking pixels or third-party scripts touch this form.** It
carries health information. Keep it that way. If marketing tracking is added to
the site later, exclude the enquiry form from it and check the position against
POPIA first.

## 5. Placeholders

Everything below renders on the page as literal bracketed text. Nothing has been
invented. Search `index.html` for the bracket to find every instance.

| Placeholder | Appears in |
|---|---|
| `[WORDING TO BE CONFIRMED BY UFMT LEADERSHIP.]` | FAQ 18 |
| `[LINKEDIN, FACEBOOK, INSTAGRAM LINKS TO CONFIRM]` | Footer, Organization schema `sameAs`, and the three `href="#"` social icons |
| `[IMAGE TO CONFIRM]` | Adenomyosis panel background |
| `DOMAIN-TO-CONFIRM` | Canonical, Open Graph, all schema `@id`s, robots.txt, sitemap.xml |
| `FORM-ENDPOINT-TO-CONFIRM` | Enquiry form `action` |

One placeholder lives outside `index.html` and is easy to miss: the three social
`href="#"` values in the footer need real URLs, and the same URLs belong in the
Organization schema `sameAs` array.

### Supplied and applied

**Telephone: 077 265 8716.** Confirmed by UFMT, and now live in six places —
the quick action bar, the enquire contact block, the referring doctors line, the
footer, and the `telephone` field of both the MedicalClinic and Organization
schema. It also replaced the placeholder in the `js/main.js` form error message.

Note the two formats, which are deliberate and both correct:

| Where | Value |
|---|---|
| Anything a reader sees | `077 265 8716` |
| Every `tel:` link and both schema nodes | `+27772658716` |

Schema and `tel:` links want E.164. If the number ever changes, change both.

**Email: vuyon@ufmt.com.** Confirmed by UFMT. Live in the enquire contact block,
the footer, the `email` field of both the MedicalClinic and Organization schema,
and — the easy one to forget — the form success message in `js/main.js`. Both
on-page instances are `mailto:` links.

Two things worth deciding on this address, neither of which blocks launch:

- It is a personal mailbox, not a role address. A shared role address such as
  `hifu@` or `enquiries@`, with the right people on it, is more robust when
  someone is on leave and cleaner under POPIA. It is a one-line change here.
- Publishing an address in plain HTML gets it scraped. That is the normal
  trade-off for a clinic and usually the right call, but expect spam and make
  sure the filtering is good, because a missed enquiry is a lost patient.

**No WhatsApp.** UFMT confirmed there is no WhatsApp line for now, so the
WhatsApp rows were removed from the enquire contact block and the footer rather
than left sitting as visible placeholders. If one is added later it belongs in
those two lists, as `https://wa.me/27772658716` or the equivalent.

**Venue: Epiome Health Village, Melrose Estate, Johannesburg.** This replaced
Life Bedford Gardens Hospital, Bedfordview, throughout — nine mentions in
`index.html` plus two in `llms.txt`. The full list, because it is easy to miss
one: the Open Graph description, the hero location line, the About "Where"
block, FAQ 20 in both its visible and its schema form, the enquire contact
block, the footer venue column, the MedicalClinic description, and the
MedicalClinic postal address.

There is no separate street address or postal code on file. If Epiome has one,
it belongs in `MedicalClinic.address.streetAddress`, which currently holds the
venue name alone.


## 6. Still needed from UFMT

**Images**

1. ~~Adenomyosis panel~~ — **supplied.** The photograph that was originally the
   hero now fills this panel (`img/adenomyosis.*`). On desktop only the top band
   and the right third clear the gradient panel, so `object-position: 62% 32%`
   keeps her face in the visible strip. Adjust that one value if the crop needs
   moving.
2. **A true vector of the logo.** `UFMT Logo svg.svg` is an SVG wrapper around
   two embedded 945 × 1150 PNGs — one for colour, one as an alpha mask. It is
   not a vector, and at 1 MB it is far too heavy to ship. It was, however, the
   only supplied asset with real transparency, so every logo image on the site
   is derived from it:

   | Asset | Derived how | Used for |
   |---|---|---|
   | `ufmt-mark` | icon cropped out, trimmed, 160px | header and footer lock-up |
   | `ufmt-logo-stacked` | full lock-up, 440px | overlay menu |
   | `favicon-32`, `favicon-180` | icon, 32px and 180px | browser tab, home screen |

   A real vector would let these scale cleanly and would allow a reversed
   version. Worth asking the designer for an SVG or EPS with live paths.

   **`img/UFMT Logo svg.svg` is not referenced by the page.** It is kept only as
   the source. Delete it before deploying, or it ships 1 MB of dead weight.
3. **Optional.** A photograph of the clinic or the treatment room would give the
   About section something concrete to sit against.

**A note on the supplied logo files, worth acting on:** the wordmark in both
`UFMT LOGO.png` and `UFMT Logo svg.svg` reads "MEDICAL TECHNOLGIES" — the second
O is missing from "TECHNOLOGIES". The typo is baked into the raster, so it is
visible wherever the full lock-up appears, which on this site is the overlay
menu. In the header and the footer the wordmark is live text set in Inter beside
the icon, so it is spelled correctly there. Fixing it at source would resolve
the inconsistency, and is worth doing before the file goes anywhere else.

**How the logo is put together.** The header and footer pair the rendered icon
with a live-text wordmark rather than using the stacked lock-up. Three reasons:
the stacked lock-up is the wrong orientation for a horizontal bar; a rendered
lock-up cannot reverse to white on Midnight Plum, whereas live text can; and it
sidesteps the spelling error. If a proper reversed vector lock-up arrives, it
replaces the `<picture>` and `<span class="wordmark">` pair in two places.

**Copy and clinical sign-off** — the nine open items in
`UFMT_Website_Copy_V5.md`, section "Before publication", are unchanged. Nothing
in this build closes any of them.

## 7. What the build guarantees

- **Every word renders in the HTML.** Nothing is injected by script. Turn
  JavaScript off and the page is complete, including all twenty-one FAQ answers.
- **The FAQ is native `<details>` and `<summary>`.** Answers are in the source at
  load and collapsed by CSS. Nothing is fetched on click.
- **Protected copy is reproduced exactly** — the fertility block, the POPIA
  consent line and the footer disclaimer.
- **Innovation Rose never carries white text.** Rose buttons use Midnight Plum
  text at 6.4:1. Future Blue is used only as a background or accent, and as text
  only on the Midnight Plum band, where it is 6.04:1.
- **Every visible text node was measured against its actual rendered
  background**, at mobile and desktop, with the overlay menu open and closed.
  Zero fail AA. Two things came out of that audit and are worth knowing:
  1. **Clinical Navy is not safe on Soft Blush.** The brief's verified-pairs
     table checks it against white, at 5.18:1, and it is used for the semantic
     H2s and all small print. On Soft Blush the same colour is 4.19:1, which is
     under AA, and three whole sections sit on Soft Blush. Secondary text
     therefore reads through an `--ink-secondary` token, which blush surfaces
     swap for a 10% darker navy, `#5A6083`, at 4.95:1. It is indistinguishable
     to the eye. Worth adding to the brand contrast table.
  2. **The step numerals are the one open question.** The brief asks for them in
     Innovation Rose, which on white is 2.06:1. They are marked `aria-hidden`
     inside a real `<ol>`, so the sequence is carried programmatically by the
     list and by each step's heading, which makes them decorative duplication
     and exempt on the usual reading. A strict audit may still flag them. There
     is a commented one-line switch to Deep Merlot in `css/styles.css`, under
     section 07. **This is UFMT's call, not ours.**

- **Every section has an `id`** and is reachable by anchor:
  `#top` `#hero` `#what-is-hifu` `#conditions` `#adenomyosis` `#how-it-works`
  `#about` `#compare` `#fertility` `#faq` `#enquire` `#referrals` `#footer`.
- **Six JSON-LD blocks** in one `@graph`: MedicalWebPage, MedicalProcedure,
  Physician, MedicalClinic, Organization, FAQPage. FAQ answer text matches the
  visible text exactly.
- **Motion animates from a visible default.** The reveal styles hang off a `.js`
  class the script adds, so nothing is ever parked at `opacity: 0` for a reader
  without JavaScript. `prefers-reduced-motion: reduce` disables all of it.

## 8. Where the Moovia layout shows up

**Measured, not assumed.** With every image loaded, the whole page transfers
**121 KB**. The brief's target was under 500 KB excluding the hero photograph;
this comes in under it including the hero. Every image has explicit `width` and
`height`, so cumulative layout shift from images is zero.

| Moovia device | Used here for |
|---|---|
| Fixed transparent header, menu retreating upward on scroll | The section navigation |
| Round buttons with a ring that unwinds on hover | Enquire and menu |
| Full-screen overlay menu, gradient panel plus link column, staggered entry | The full navigation |
| Gradient cross-fade as you hover each group in the overlay | The four link groups |
| Full-bleed hero, thin display type, short rule under the H1 | The hero |
| Pointer-tracked layered graphic (`.anime`) | Retired. Replaced by a scroll-driven zoom on the hero photograph |
| Hairline rules bleeding out of the text column | Section openers |
| `.fiche`, a full-bleed image with a gradient panel overhanging it | The adenomyosis block |
| Large thin numerals on a rule | The four-step sequence |
| `« »` display pull quote | "It treats the fibroid … without a cut." |
| Fixed bottom quick-action bar | The primary call to action, always visible |
| Floating-label form with inline state messages | The enquiry form |

Three deliberate departures from the brief, all in service of the Moovia layout,
all reversible:

1. **The hero is full-bleed dark rather than white with the image on the right.**
   Moovia's hero is a full-bleed image with white display type over it, and that
   is the single most recognisable thing about the site. The photograph carries
   a Midnight Plum scrim heavy enough that every piece of white text on it
   clears AA comfortably.
2. **The adenomyosis block is a `.fiche` panel rather than a white inset card.**
   Same intent — "a woman scrolling quickly cannot miss it" — executed with
   Moovia's strongest layout device.
3. **The footer is Midnight Plum, per the brief, not white as on Moovia.** Where
   the brief and the reference disagreed on colour, the brief won. Where they
   disagreed on layout, the reference won.

## 9. Adding the next three pages

The brief scopes a HIFU versus embolisation comparison, an adenomyosis page and
a cost page. The CSS is structured for it:

- `.band-white` / `.band-blush` / `.band-plum` are the full-bleed backgrounds.
- `.cols` with `.col-6` / `.col-12` is the layout primitive. It is the only one.
- `.section-label` plus `.display-line` is the two-line heading pattern.
- `.fiche`, `.panel`, `.definition-block`, `.blockquote`, `.steps`, `.points`
  and `.faq` are all reusable as-is.

A new page needs its own `<head>`, its own JSON-LD and nothing else. Neither
`styles.css` nor `main.js` should need to change.

---

*Prepared by NorthLight for Ultra Focused Medical Technologies (Pty) Ltd | Reg. No. 2024/153773/07*

---

## 9. HPCSA compliance remediation

The copy was revised against the *HPCSA Regulatory and Ethical Compliance Audit
of the UFMT Digital Asset R1* (NorthLight, 7 August 2026), together with a
clarification from UFMT that **Dr R.C.M. Mpehle is not part of UFMT**.

### What changed and why

| Audit finding | Rule | Resolution |
|---|---|---|
| Corporate practice of medicine | Rule 18 | UFMT is now positioned solely as the technology supplier. The hero reads "a programme of UFMT… treatment is administered by the treating clinician." |
| "Clinic" in the practice name | Rule 5 | Every visible use of "clinic" removed. "The practice", "the team", or "Where" as a label. `MedicalClinic` survives only as a schema.org *type*, which is not a trade name. |
| "First dedicated private" claim | Rule 3, canvassing | Replaced everywhere with "a private HIFU service for uterine fibroids and adenomyosis" — hero, About, FAQ 19, title, meta and Open Graph, MedicalClinic schema. |
| Touting in About UFMT | Rule 3 | The "what changes outcomes… that is our work" passage is gone. Replaced with UFMT's own approved copy. |
| Emotive symptom hook | Rule 3, unwarranted anxiety | "You are not imagining how bad it is" replaced with a factual symptom description that also notes many women have no symptoms. |
| Aspersions on colleagues | Booklet 1 | "Told to live with it" / "many women are told the pain is normal" replaced with "Adenomyosis is historically difficult to diagnose." |
| Conflict of interest | Rule 23A | **Moot.** With Dr Mpehle outside UFMT there is no directorship to disclose. The footer disclosure was removed rather than reworded. |
| Scan reports by email | POPIA | The site no longer invites scans by email anywhere. FAQ 21 and step 01 say bring it to your consultation; `MedicalProcedure.preparation` was updated to match. |
| Telehealth boundary | Booklet 10 & 16 | Step 01 now states the team handle bookings only and cannot assess scans or suitability. |

### Structural consequences

- **`#team` section deleted.** With it went the `Your HIFU specialist in
  Johannesburg` H2, which was a strong local-search asset. If a named clinician
  is ever published, that section and its `Physician` node are worth restoring.
- **`Physician` schema node removed**, along with `MedicalWebPage.reviewedBy`,
  `MedicalWebPage.lastReviewed` and `MedicalProcedure.performer`, which pointed
  at it. Five schema nodes remain and all validate.
- **The medical review line is gone** from the hero and the footer. This was the
  page's strongest E-E-A-T signal. Google's guidance for
  Your-Money-or-Your-Life pages, and every AI search engine, weigh a *named*
  reviewer heavily. Expect this to cost visibility. It is reversible the moment
  a named, HPCSA-registered reviewer can be published.
- `dr-mpehle.*` deleted from `img/`. The original `DR MPEHLE.png` is untouched
  in the project root.
- `.person` CSS is retained though currently unused — it is the pattern any
  future practitioner section would use.

### Two collisions in the sign-off, and how they were read

1. **Item 6 approved UFMT's copy verbatim, which contains "South Africa's first
   dedicated private HIFU service" — the exact phrase Decision #2 removed.**
   Decision #2 was applied consistently, including inside the About paragraph.
   Leaving the claim in one section while stripping it from the hero, the title
   and FAQ 19 would have defeated the remediation. **If UFMT intended to keep the
   claim in About, restore it there and revisit the audit's item 1.**
2. **Item 13 supplied "Understanding the impact of severe fibroid symptoms on
   daily life" for the *adenomyosis* display line**, but that sentence is about
   fibroids and the block is about adenomyosis. Using the latitude in "or another
   variation", it reads **"Understanding the impact of adenomyosis on daily
   life."** Say the word if you want the original sentence used as given.

Minor: paragraphs 1 and 2 of the adenomyosis block now both introduce HIFU as an
option ("HIFU offers an alternative treatment pathway to consider" / "HIFU is
another option to discuss with your doctor"). Both were approved separately, so
both were applied. Worth tightening on the next pass.

### Not fixable in the website

The audit raises six items no copy edit resolves. They are recorded here so they
are not lost:

1. **Company form.** The audit holds that clinical practices must be a sole
   proprietorship, partnership, or Personal Liability Company (Inc.), not a
   (Pty) Ltd. Severing the clinician from UFMT may resolve this; confirm with
   the legal reviewer.
2. **PAIA manual** must exist and be available to data subjects.
3. **Secure portal**, if scans are ever to be accepted digitally.
4. **Comparison table figures.** The audit warns the myomectomy and hysterectomy
   columns must reflect accepted South African standard of care, not worst-case
   figures, or the table becomes deceptive advertising. The on-page reminder was
   removed on instruction; **the obligation was not.**
5. **Written informed consent** before prescribing treatment.
6. **Waiting-room notice**, if any financial interest is ever reintroduced.

---

## 10. Later changes

### Images, final state

| Slot | Image | Notes |
|---|---|---|
| Hero | The woman photograph | `object-position: 72% 30%` desktop, `66% 18%` mobile |
| Adenomyosis panel | Sunrise over the sea | 2000 × 1000. On desktop only the top band and the right strip clear the gradient panel |
| About | The HIFU treatment room | Framed directly, no white card — it is a room photograph, not a product cutout |

**The scrim is what protects the hero type, not the photograph.** White text
needs a ground no lighter than 0.183 relative luminance. Plum at 0.72 alpha over
pure white lands at 5.1:1, so the desktop gradient holds
`0.94 → 0.86 → 0.72 → 0.58` across the width: above 0.70 out to roughly 70%,
where the text column ends, then dropping to 0.58 past it, which still clears
3:1 for the round buttons in the top right while letting more of the photograph
through. Mobile runs `0.70 → 0.90 → 0.96` down the page.

**If the hero photograph is ever swapped again, re-check those numbers.** A
darker image lets them relax. A bright one — a white clinical room, a window, a
pale interior — needs the floor raised to 0.66 everywhere, which is what the
treatment-room version of this hero measured at.

**The hero sub-lines are white, not Soft Blush.** Blush measured 3.70:1 at the
lightest edge of the scrim, under AA. Hierarchy is carried by size instead.

### The comparison table

Now a two-column summary headed **What HIFU involves** — `Aspect` and `HIFU`
only. The myomectomy and hysterectomy columns are gone, which removes the
audit's concern that unverified surgical figures could read as deceptive
advertising. There are no longer any third-party figures on the page to verify.

The section keeps its `HIFU compared with myomectomy and hysterectomy` H2 and
the prose paragraph, which is where the actual comparison now lives. The
"How HIFU compares." display line was removed, since it no longer described a
single-column table.

`table.summary` drops the 64rem min-width that the four-column version needed,
so the table no longer scrolls sideways on any viewport. The wider table styles
in section 08 of `styles.css` are retained for future pages.

### The hero motif, and the hero zoom

**The pathway motif is gone from the hero.** The concentric rings and the two
gradient discs that sat over the photograph have been removed, along with their
CSS and the pointer-tracking code in `main.js` that drove them. Two relatives
survive and were deliberately left alone:

- `.motif-bed` — the same rings, at 16% opacity, behind the four-step sequence
- `.divider` — the converging arcs between What is HIFU and the conditions band

Say the word if those should go too.

**In its place, a scroll-driven zoom on the hero photograph.** Section 3 of
`main.js`, about 45 lines, no dependencies. The image scales from `1.0` to
`1.16` across a full scroll through the hero, and back down on the way up.

It is bound to scroll *position*, not played as a one-shot animation. That is
what makes it reverse: at any moment the scale reflects exactly how far into
the hero the reader is, in either direction. Measured behaviour:

| Scroll | Scale |
|---|---|
| 0 | 1.000 |
| 200 | 1.036 |
| 450 | 1.081 |
| 700 | 1.126 |
| 900+ | 1.160 (held) |

Scrolling back up returns the identical values in reverse.

Three notes for anyone changing it:

1. **`MAX_ZOOM` is 0.16 on purpose.** Enough to feel alive behind the type, not
   enough to soften a 1620px source. Push it much past 0.2 and the photograph
   starts to look upscaled at the bottom of the hero.
2. **Scaling only crops inward,** so there is no overscan to keep in step and no
   way to expose an edge — the difference between this and the translate-based
   parallax that preceded it, which needed the image oversized by exactly its
   travel distance. `.head-bg picture` carries `overflow: hidden` to clip it.
3. **Writes are skipped when the scale has not visibly changed** (< 0.0005), so
   a scroll that does not move the hero costs nothing.

**Degradation.** The transform is gated behind a `.hero-zoom` class that the
script adds only when it actually initialises. With JavaScript off, or under
`prefers-reduced-motion: reduce` where the script never initialises, the class
is absent and the photograph sits at its natural scale, flush in its frame.
Verified in both states.

**Why not the GSAP/Lenis component.** A React parallax component was proposed
for this. It would have required React, TypeScript, Tailwind and a bundler —
all four ruled out by section 2 of the build brief — plus about 120 KB gzipped
of GSAP, ScrollTrigger and Lenis against a 500 KB page budget, four layer
images from a third-party CDN, and Lenis intercepting native scroll on a page
that has to meet WCAG 2.2 AA and honour `prefers-reduced-motion`. The whole
site is currently around 115 KB of source with zero npm dependencies.

### Sources and citations removed

The `#sources` section, both inline citations and every outbound reference link
were removed on instruction. Gone from `index.html`, from the overlay menu, from
`MedicalWebPage.significantLink`, and from `llms.txt`. The page now makes no
external requests at all except Google Fonts.

**The claims those sources supported are still on the page.** They were not part
of the instruction, so they were left alone — but they are now unsupported, and
that is the opposite of what the compliance audit asked for. The audit called
the citations *"excellent regulatory practice"* and noted the HPCSA "requires
that clinical information distributed to the public be objective, evidence-based
and scientifically sound."

Five statements are affected:

| Claim | Where | Was supported by |
|---|---|---|
| "close to two thirds of women will have developed them" | Conditions | Baird et al. 2003 |
| "Among African women the figure reaches up to 80 per cent" | Conditions | FIGO 2025 |
| "in clinical use in more than 27 countries" | Hero | — never cited |
| "included in the best practice guidance … published by FIGO" | Hero, What is HIFU | FIGO 2025 |
| "In published research, women … reported significant reductions in period pain, sustained over three to twelve months" | Adenomyosis | Li et al. 2020 |
| "used in the South African public sector since 2015 … its results are published" | FAQ 19 | Setzen 2026, gov.za |

Two ways to close this, whenever UFMT wants to:

1. **Put the sources back** — the fastest fix, and the one the audit points to.
2. **Remove the claims instead** — the statistics and the "published research"
   phrasing come out, leaving only statements that need no citation.

Leaving specific statistics and appeals to published research on the page with
nothing behind them is the weakest of the three positions. Worth a decision
before launch.

There is also an SEO cost: outbound citations to DOIs and a `gov.za` advisory
were a strong signal for AI search engines, which is the channel the brief
identified as the only one that gets cheaper over time.
