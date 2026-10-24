# Torekh / תורך / دورك — Your Turn

A mobile-first, multilingual civic guide to Israeli election lists: official ballot identification, source-linked party summaries and an exploratory coalition seat counter. No party rankings or voting recommendations.

Live guide: https://www.torekh.org/en

## Source repository

https://github.com/jenniferannlove/torekh

## Preview and rebuild

Open `index.html` in a browser. To rebuild with Python 3 (standard library only), run from the repository root:

```sh
python work/build-guide.py
```

The result is `outputs/torekh-guide.html`; copy it to `index.html` to update the preview. `work/guide-shell.html` contains the interface, with source data under `outputs/` and reviewed policy text in `work/audited-policy-data.json`. `outputs/torekh-prototype.html` is a historical build input for interface translations, not the current published guide.

This repository does not automatically deploy the Odoo site. Source links and sharing destinations access the internet. No Odoo or Cloudflare credentials or private account exports are included.

## Licensing

Original application code and build scripts: **MIT**, see [LICENSE](LICENSE).

Original editorial text, original translations and original annotations: **CC BY 4.0**, see [LICENSE-CONTENT.md](LICENSE-CONTENT.md).

These grants cover only rights held by the publisher or contributors. Third-party material is excluded; factual information is not made proprietary. Mixed HTML, JSON and Python files can contain code, original text and third-party records. See [LICENSING.md](LICENSING.md) for scope and attribution.

## Editorial status

37 active list identities and 109 displayed candidate names were checked against the official register/profile pages. 27 proposal summaries across nine lists were source-matched; 28 lists still lack reviewed policy summaries. Independent action/outcome research and fluent-editor translation review remain incomplete. Identity tags are selected sourced descriptors, not exhaustive profiles. Coalition statements are partial, directed and sometimes group-level interpretations; they do not establish mutual willingness. The seat builder is arithmetic using the dated 23 October N12 poll, not a forecast. Missing seat figures remain unknown, not zero.

Yashar (דרך, Gadi Eisenkot) and the Democrats (אמת, Yair Golan) are separate lists, candidates and policy datasets. Grouping them in an illustrative coalition does not merge their cards.

## AI and liability

Read PROJECT-STATEMENTS.html. AI was used extensively, including in source comparison and fact-checking. This material is not independently expert-reviewed in full. The information/liability notice is a draft, has not been reviewed by a lawyer and cannot guarantee personal immunity. Hosting or open-sourcing a project does not itself erase liability.

## Contributions

Every factual change needs a direct source, source date when available and a checked date. Keep proposals, actions and measured outcomes distinct. Record political refusals by speaker, direction, scope, date and conditions; distinguish a person from a party, nomination from coalition membership and outside support from joining a government. Do not infer personal religion from a party label. Mark missing evidence instead of filling it with guesses. Native editors should review translations. No vote recommendations or party rankings should be introduced into factual summaries.

## Languages and translation review

Arabic was reviewed first, followed by English. The guide includes localized list reading aids, all 37 submitting-party descriptions, nine policy-source notes, all 27 available policy summaries, coalition controls and statements, identity badges, sharing text, accessibility labels and project notices. Official Hebrew names, ballot letters and candidate spelling are deliberately retained for identification; reading aids are unofficial.

`outputs/party-translations.json` holds the original editorial translations of the 37 register descriptions and source notes. The build injects this file into the guide; no network fetch is needed at runtime. `outputs/torekh-blog-localized.html` contains the three-language blog body, with native-language links and language-aware Arabic, English and Hebrew views. `outputs/blog-translations.json` records the native article titles and source notes. Odoo also stores the localized article title, subtitle and metadata separately.

Run `node work/check-localization.cjs` to check the Arabic and English card panels and source notes. Translations remain AI-assisted editorial drafts pending fluent human review. Proper names may have multiple accepted transliterations; verify against original sources.

The native Odoo source directory and language bridge are maintained on the live site; the repository's self-contained guide is independently rebuildable. Publication to Odoo is a separate, deliberate step and is not automated by this repository.

## Your turn hero

The heading reads “Your turn.” alongside the card illustration. It starts in the selected language, then gently fades through Hebrew, Arabic, English, Russian and Amharic every six seconds. A localized pause control and reduced-motion support keep the heading accessible; the screen-reader heading remains in the selected language. Copy is maintained in `outputs/hero-translations.json`.

The Abu Ali article is unpublished on Odoo and no longer promoted on the homepage. Its source remains in this repository for reference.

## What to expect

The [first-time voter page](https://www.torekh.org/en/what-to-expect) is a straightforward guide to the ordinary assigned polling-station process: check the location and ID requirements, check in, go behind the screen, choose one slip and cast the envelope. It includes three illustrations and short FAQs, in Arabic, Hebrew and English. It contains no project roadmap, research-status commentary or development notices.

`outputs/torekh-what-to-expect-copy.json` holds the current reader-facing text. `work/build-first-voter-page.py` builds the standalone HTML and Odoo template; `work/build-expect-page.py` is its compatibility entry point. Voting procedure, identification, hours, envelope sealing, photography and assistance were checked against the Central Elections Committee’s 26th-Knesset FAQ, updated 12 October 2026, and the Ministry of Interior’s 2026 polling-station information, updated 20 October 2026. The page links directly to the official polling-station lookup and FAQ. The author’s unpublished TOI draft is separate from this repository.

## Voting illustrations

The What to expect page includes a conceptual pencil-style preview of a privacy booth, ballot-slip organizer and ballot box. Built-in AI image generation produced the artwork; Odoo’s image editor prepared small transparent WebP versions. `outputs/torekh-voting-illustration-assets.json` embeds those mobile assets so the page can be rebuilt without fetching images. The adjacent copy and prompt JSON files preserve descriptions, accessible alternative text, provenance and generation prompts. The six letter examples are a selection, not a complete ballot display. No list is highlighted. The artwork is not an official ballot reproduction or complete voting instructions.
