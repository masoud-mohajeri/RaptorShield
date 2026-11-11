# GitHub publication kit

This file contains copy-ready repository metadata and release text. It does not create a GitHub repository or publish a release.

## Repository metadata

**Suggested repository name:** `raptorshield`

**About description:**

```text
F-22-inspired Chrome extension for browser identity alignment, exit-IP inspection, and on-demand reputation reports. Provider-independent fork of FoxyShield.
```

**Suggested topics:**

```text
chrome-extension browser-extension browser-privacy browser-fingerprinting vpn ip-address ip-reputation manifest-v3 javascript
```

Leave the website field empty unless you have an actual project website or store listing. Do not claim a Chrome Web Store listing, external audit, or compatibility certification that has not been obtained.

## Remaining provenance details

The supplied base package establishes **FoxyShield 1.0.0** and its **FoxyNet** branding. It does not establish a verified upstream repository URL, original author identity, or application source license.

Before describing the public repository's licensing:

- Record the verified upstream project URL in `README.md` and `NOTICE.md`.
- Record the applicable upstream application license or separately confirmed distribution terms.
- Preserve inherited copyright and third-party notices.
- Add a `LICENSE` file only when the applicable terms are established. Do not assign a new license to inherited code by assumption.

`THIRD_PARTY_NOTICES.txt` documents component licenses; it is not a substitute for the missing application license. The current README and notice intentionally state this gap instead of presenting an invented license or repository link.

## Prepare the repository

1. Review [README.md](../README.md), [NOTICE.md](../NOTICE.md), and [PRIVACY.md](PRIVACY.md).
2. Finish the provenance details above and review the actual runtime files you intend to publish.
3. Confirm the extension name/version in `manifest.json`; the current version is `1.1.2`.
4. Load the extension from a clean Chrome profile and check the default, unknown/stale exit, manual profile, site exception, and reload behavior. Check calls/WebRTC and IPv4/IPv6 using your actual connection. These live scenarios have not all been verified for this fork.
5. Capture real screenshots of Overview, IP reputation, Shields, and Settings if desired. Redact IPs/hostnames and do not present fixture data as a live result. No screenshot claims or broken screenshot placeholders are included in the README.
6. Create the GitHub repository, add the About description/topics, and upload or push this directory. Keep `.gitignore` and the attribution files.

The supplied working directory has no Git metadata. If this remains true when you publish, initialize a repository yourself, review the staged files, and connect it to your chosen GitHub remote. This is a code fork of the supplied distribution; a GitHub fork relationship and upstream commit history are not available from these files.

The ignore rules exclude local environment files, signing keys, dependencies, and generated archives. Review the staged file list before pushing; runtime code, assets, and attribution documents belong in the repository.

## Validate and package

No build step or dependency installation is needed. From the repository root, validate JavaScript syntax:

```bash
for file in *.js chunks/*.js; do
  node --check "$file" || exit 1
done
```

Create a local unpacked-release archive with Python 3:

```bash
mkdir -p dist
python3 -m zipfile -c dist/raptorshield-v1.1.2.zip \
  manifest.json background.js bridge.js exit-ip.js flow-freeze.js \
  flow-unlock.js options.js popup.js shield.js chunks ui assets icons \
  README.md NOTICE.md CHANGELOG.md THIRD_PARTY_NOTICES.txt docs
```

This explicit file list leaves Git metadata, local environment values, signing keys, and existing archives out of the release. Keep `manifest.json` at the archive root. Change the archive version when the manifest version changes.

Extract the archive to a new directory and confirm that Chrome's **Load unpacked** accepts the directory containing its manifest. The archive is an unpacked extension distribution, not a signed Chrome Web Store installation package.

## Release title

```text
RaptorShield v1.1.2 — Browser identity controls and exit-IP HUD
```

## Release description

Copy and adapt the text below after resolving provenance details and reviewing validation results:

```markdown
RaptorShield is an independent fork of FoxyShield 1.0.0, originally distributed with FoxyNet branding. This version removes the provider subscription requirement and adds an English, F-22-inspired interface for browser identity controls and exit-IP inspection.

### Highlights

- Automatic/manual country profiles alongside your existing VPN or proxy.
- Exit-IP metadata, freshness/change indicators, and explicit IPv4 / IPv6 checks.
- On-demand AbuseIPDB and Spamhaus report links; no internal reputation score.
- Twelve configurable shields, page diagnostics, and site exceptions.
- English/LTR Sci-Fi HUD and platform-native typography.
- Corrected exception handling, WebRTC policy release, and Flow feature gating.

### Install

1. Download and extract `raptorshield-v1.1.2.zip`.
2. Open `chrome://extensions` in Chrome 120+ and enable Developer mode.
3. Select Load unpacked and choose the directory containing `manifest.json`.
4. Connect your VPN separately, open RaptorShield, and inspect your exit/profile.
5. Reload open websites after changing protection settings.

For an existing unpacked installation, update its files and click Reload in Chrome's extension manager.

### Limitations

RaptorShield does not create a VPN, guarantee anonymity, certify an IP as safe, or predict account restrictions. Reputation results are viewed at the chosen source. WebRTC policy is browser-wide and may affect calls. Split tunneling, unsupported execution contexts, and site-specific behavior limit coverage.

See the repository README, privacy document, changelog, and provenance notice for details. Credit for inherited code belongs to the original FoxyShield contributors.
```

Attach the inspected ZIP under GitHub Releases. Select prerelease status if you want to present this as an early build; the version number alone does not establish a stability level.

## Validation record for this working copy

- JavaScript syntax and local asset/reference checks have passed during implementation.
- Background behavior has been exercised using simulated Chrome/network responses.
- The HUD has been inspected in a live Chrome installation.
- No automated test suite was added or supplied with the base distribution.
- Comprehensive multi-provider, actual IP-leak, and cross-browser verification remains incomplete.

Describe these checks accurately; do not present the simulated checks as a real VPN compatibility audit.

## Chrome Web Store, if pursued later

GitHub publication does not automatically create a store listing. A store submission is separate: review current Chrome Web Store requirements, use the privacy document as a description of the implementation, and reconcile every declaration with the packaged version. No store submission or listing has been prepared or performed here.
