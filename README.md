<p align="center">
  <img src="icons/raptorshield.svg" width="88" height="88" alt="RaptorShield emblem" />
</p>

# RaptorShield

**Browser identity controls and exit-IP inspection for your existing VPN.**

RaptorShield is a provider-independent Chrome extension that helps align browser timezone and language settings with your observed exit country. Inspect your public IP, review possible profile mismatches, and open independent IP reputation reports from an English, Sci-Fi HUD interface inspired by the F-22 Raptor.

**This project is an independent fork of the supplied FoxyShield 1.0.0 extension, originally distributed with FoxyNet branding.** Credit for the inherited implementation belongs to the original FoxyShield contributors. The upstream repository URL and application license were not included in the base package; see [provenance and attribution](NOTICE.md).

Chrome 120+ · Manifest V3 · No extension account, provider subscription, or API key required

## Why use it?

A VPN changes your network exit, but browser APIs can continue to expose a different timezone, language, or other local signals. RaptorShield gives you controls for selected signals and a way to inspect what is happening.

Use it to:

- **Check your exit:** see the observed IP, location, timezone, ISP, ASN, source, and observation time.
- **Align a browser profile:** choose an automatic country preset or set a manual profile and overrides.
- **Investigate IP reputation:** open reports for the observed address without treating a VPN flag or a single score as proof of abuse.
- **Troubleshoot compatibility:** inspect selected page signals, disable individual shields, or exclude a site.
- **Keep provider choice:** use your existing VPN or proxy without entering its subscription link into the extension.

RaptorShield does not establish a VPN connection, repair an IP's reputation, or guarantee anonymity or account safety.

## What does it do?

| Feature                         | Behavior                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| Browser identity profiles       | Applies supported timezone, language, calendar, and related API changes.                     |
| Exit-IP overview                | Shows the IP and metadata returned by lookup services, with freshness and change indicators. |
| Manual IPv4 / IPv6 check        | Attempts independent observations for both address families.                                 |
| Identity mismatch notices       | Highlights differences between the selected profile and observed exit information.           |
| Reputation report links         | Opens AbuseIPDB or Spamhaus for a freshly observed IP. Reports stay on the source website.   |
| Page diagnostics                | Checks configuration delivery, patch installation, and selected browser signals.             |
| Site exceptions                 | Excludes a domain and its subdomains from page/header changes.                               |
| Optional compatibility controls | Includes Stealth mode, Iranian-site exceptions, and experimental Google Flow behavior.       |

For example, a German exit can select the Germany preset with `Europe/Berlin` and `de-DE`. If you manually choose a different country, the popup can show the mismatch. This is profile alignment, not proof that a VPN is connected.

## Install

1. Download this repository using **Code → Download ZIP**, then extract it. Alternatively, use an unpacked release archive if one is provided.
2. Open `chrome://extensions` in Chrome 120 or newer.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the extracted directory containing `manifest.json`.
5. Pin **RaptorShield** from Chrome's Extensions menu for quick access.

No build step, package installation, or account registration is required. Chrome is the declared target; other Chromium browsers have not been verified for this fork. Firefox support is not included.

## How to use it

### 1. Connect your VPN separately

Connect using your existing VPN or proxy application. RaptorShield operates on the browser and does not manage that connection or other apps.

### 2. Inspect your exit

Open the RaptorShield popup and choose **Check exit IP & IPv4 / IPv6**. Review the address, network metadata, source, and last successful check.

A lookup describes the route used to contact that service. Split tunneling, PAC rules, and rotating proxies can give other destinations a different exit. An unavailable IPv6 result does not prove IPv6 is disabled or leak-free.

### 3. Choose a browser profile

In **Overview → Browser profile**, keep **Automatic (based on exit IP)** or choose a supported country manually.

- Automatic mode pauses if exit information is unknown, failed, stale, or has no supported preset.
- A manually selected profile can remain active when lookup information is unavailable.
- The profile does not select or change a VPN server.

Current presets: Albania, Austria, Canada, Finland, France, Germany, Italy, Japan, Netherlands, Poland, Singapore, Spain, Sweden, Switzerland, Turkey, United Arab Emirates, United Kingdom, and United States.

### 4. Reload the website

Reload open pages after changing protection, profile, shield, or exception settings. Patches already installed in a page remain until that page is reloaded, including after protection is switched off.

### 5. Inspect page shields

Open **Shields → Inspect active page** on a regular website. This checks selected signals and reports installed, failed, paused, or unverified shields.

“Installed” is not a security certification. The WebRTC diagnostic reads browser policy; it does not run an actual IP leak test.

### 6. Review an IP report

Open **IP reputation**, select a freshly observed address, then choose **AbuseIPDB** or **Spamhaus**.

Opening a report sends that IP to the chosen service. Results, report dates, categories, and scores appear on its website. RaptorShield does not fetch or store report results and keeps reputation unverified in the extension.

VPN classification alone is not evidence of abuse. No reports does not guarantee safety, and a Spamhaus PBL entry alone does not indicate malicious activity. These reports cannot predict Instagram account decisions.

### 7. Adjust settings or exclude a site

Use the settings button to change shields, profile overrides, exceptions, or compatibility options. In the popup, **Exclude site** adds the current domain; **Restore** removes the matching manual exception. Settings also lets you remove saved exceptions individually.

A parent-domain exception covers its subdomains. Restoring a site covered by that parent removes the matching exception. Site exceptions do not change VPN routing or undo the browser-wide WebRTC policy.

## Shields and defaults

| Shield              | Purpose                                                                                             | Fresh-install default |
| ------------------- | --------------------------------------------------------------------------------------------------- | --------------------- |
| Timezone            | Aligns selected local `Date` behavior with the profile.                                             | On                    |
| Language & calendar | Aligns default locale formatting and browser language values; controls `Accept-Language` rewriting. | On                    |
| WebRTC policy       | Requires relay connections and applies a browser-wide network privacy setting. May disrupt calls.   | On                    |
| Workers             | Patches time/language in supported classic workers. Module workers are not covered.                 | On                    |
| Geolocation         | Returns approximate preset coordinates, not a measured VPN-server location.                         | Off                   |
| Persian fonts       | Conceals selected installed fonts from common probes.                                               | Off                   |
| Persian voices      | Filters Persian speech-synthesis voices.                                                            | Off                   |
| Keyboard layout     | Returns a fixed Latin layout map.                                                                   | Off                   |
| Canvas              | Adds small, site-specific changes to selected image readouts.                                       | Off                   |
| GPU                 | Changes selected GPU strings when a compatible preset is available.                                 | Off                   |
| Audio               | Adds small changes to audio fingerprint readouts.                                                   | Off                   |
| Layout metrics      | Perturbs selected geometry and text measurements.                                                   | Off                   |

Stealth mode, automatic Iranian-site exceptions, and Google Flow compatibility are also **off by default**. Existing explicit settings can be retained when updating the same installation.

## Privacy and permissions

Settings, the installation seed, optional domain list, and recent exit observations are kept in local extension storage. Session storage holds navigation/reload recovery information and rule/privacy status. This build includes no project-operated analytics endpoint or browsing-history upload.

The extension does make external requests:

- **ipwho.is**, with **Cloudflare** as a fallback, for exit metadata.
- **ipify** for explicit IPv4 / IPv6 checks.
- **GitHub** for the optional Iranian-domain exception list.
- **AbuseIPDB / Spamhaus** when you open a report link.

Each contacted service can see the exit IP. See [PRIVACY.md](docs/PRIVACY.md) for request timing, stored data, and permissions.

## Limitations and troubleshooting

| Situation                      | What to do or expect                                                                          |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| Exit unknown or stale          | Check the connection and refresh the IP, or select a manual profile.                          |
| No preset for the exit country | Select one of the supported manual profiles; verify the resulting mismatch notices.           |
| Page uses old settings         | Reload the page. Cached/service-worker pages may need a hard reload.                          |
| A site or video call breaks    | Disable the relevant shield or add a site exception. WebRTC policy affects the whole browser. |
| Rules or privacy settings fail | Review the popup error; another extension or browser policy may control the setting.          |
| Google Flow stops working      | Disable its compatibility option. It depends on Google's current client behavior.             |

Protection covers selected browser APIs and network headers. It is incomplete, may be detectable, and can introduce compatibility issues. Privacy headers do not compel websites to honor them. Native apps, module workers, restricted Chrome pages, and some other execution contexts are outside full coverage.

## Updating and development

Replace files in the same unpacked directory and click **Reload** for RaptorShield in `chrome://extensions`. Then reload websites. Reinstalling elsewhere may create a separate extension installation with different settings.

This fork was adapted from a packaged extension distribution. The original build project, source maps, Git history, and automated test suite were not supplied. Runtime JavaScript is included directly; some inherited names and bundles remain.

| Path                               | Responsibility                                                      |
| ---------------------------------- | ------------------------------------------------------------------- |
| `manifest.json`                    | Extension metadata, permissions, and entry points.                  |
| `background.js`                    | Settings, rules, scheduling, diagnostics, and navigation recovery.  |
| `exit-ip.js`                       | Exit metadata, address validation, caching, and IPv4 / IPv6 checks. |
| `shield.js`                        | Page API patches and installation status.                           |
| `bridge.js`                        | Recovery for cached documents missing configuration.                |
| `flow-unlock.js`, `flow-freeze.js` | Optional Google Flow behavior.                                      |
| `popup.js`, `options.js`, `ui/`    | UI and controls.                                                    |
| `chunks/`                          | Inherited shared country-profile and UI helpers.                    |
| `assets/`, `icons/`                | Styles, bundled assets, and RaptorShield branding.                  |

For JavaScript syntax validation:

```bash
for file in *.js chunks/*.js; do
  node --check "$file" || exit 1
done
```

See [CHANGELOG.md](CHANGELOG.md) for fork changes and [PUBLISHING.md](docs/PUBLISHING.md) for repository metadata, release text, and packaging instructions.

## Attribution and license status

RaptorShield is a fork of **FoxyShield 1.0.0**, supplied with **FoxyNet** branding. It retains inherited browser-shielding and compatibility code while removing the provider subscription requirement and adding a new interface, exit-IP features, and reliability fixes.

The base package did **not** include an application source license or verified upstream repository URL. This repository does not assign a new license to inherited code or claim that its redistribution terms have been established. Record the upstream URL and applicable license when verified; those are outstanding publication details.

The original [third-party notices](THIRD_PARTY_NOTICES.txt) are preserved, including notices for retained fonts and icon material. They describe those components, not a license for the entire application. See [NOTICE.md](NOTICE.md) for provenance.
