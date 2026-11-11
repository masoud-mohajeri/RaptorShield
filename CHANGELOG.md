# Changelog

This records the changes made to the supplied working copy. It is not a verified upstream release history.

## Unreleased

- Added a user-focused README with installation and usage instructions.
- Added fork attribution and explicit provenance/license gaps.
- Added privacy documentation, GitHub metadata, and publication/packaging instructions.
- Added Git ignore rules for local files and release artifacts.

## 1.1.2

- Renamed the fork to RaptorShield.
- Added an angular F-22-inspired aircraft emblem and toolbar icons.
- Updated extension titles, asset references, diagnostic markers, and documentation.

## 1.1.1

- Translated the interface, countries, errors, diagnostics, accessibility labels, and date/number formatting to English.
- Switched popup/settings layout and keyboard navigation to LTR.
- Adopted platform-native UI typography with monospace technical readouts and larger small text.

## 1.1.0

- Removed FoxyNet subscription-based activation and related provider requests/UI.
- Added automatic/manual browser profiles independent of VPN provider.
- Added an exit-IP overview, network metadata, freshness/change indicators, and explicit IPv4 / IPv6 checks.
- Added on-demand AbuseIPDB and Spamhaus report links, without internal reputation scoring.
- Introduced the Sci-Fi HUD and page-shield installation diagnostics.
- Paused automatic protection when exit observations are failed, unknown, stale, or unsupported.
- Made Iranian-site exceptions optional and corrected page/header/navigation exception behavior.
- Made Google Flow behavior respect the main protection switch and site exceptions.
- Improved WebRTC policy release/error reporting and rule-failure handling.
- Added SHA-256 content verification for downloaded Iranian-domain lists.

## Base package: FoxyShield 1.0.0

The supplied FoxyNet-branded extension is the starting point for this fork, not a RaptorShield release. Its inherited code includes browser API patches, network-header rules, cached-page recovery, page diagnostics, country presets, and optional Google Flow modifications.
