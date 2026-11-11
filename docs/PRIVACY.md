# RaptorShield privacy and data behavior

This document describes the current extension implementation. It does not describe the independent policies of VPN providers, websites, or lookup/report services.

## Data stored by the extension

| Data                                                                                           | Location                         | Purpose                                                    |
| ---------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------- |
| Protection switches, profile overrides, country choices, and domain exceptions                 | Chrome local extension storage   | Remember configuration.                                    |
| Random installation seed                                                                       | Chrome local extension storage   | Derive consistent site-specific fingerprint changes.       |
| Optional Iranian-domain list, hash, and refresh/application metadata                           | Chrome local extension storage   | Apply automatic exceptions when enabled.                   |
| Latest exit IP, address-family observations, location/network metadata, source, and timestamps | Chrome local extension storage   | Display exit status and freshness.                         |
| Immediately previous primary IP and change time                                                | Chrome local extension storage   | Highlight an exit change; not a full IP history.           |
| Recent per-tab navigation URL/form-submission flag, reload URL/timestamps, and recovery state  | Chrome session extension storage | Avoid reload loops and unsafe automatic form resubmission. |
| Rule-installation and WebRTC-policy error state                                                | Chrome session extension storage | Explain protection failures.                               |

Local storage is not application-level encrypted. Chrome controls extension storage access and lifetime. No settings sync through `chrome.storage.sync` is implemented. The extension includes no project-operated backend, telemetry endpoint, or browsing-history upload.

Page scripts change selected APIs that websites read; they do not provide a separate secure browsing environment. A diagnostic marker used to report patch installation is visible within the page's JavaScript environment. Stealth mode is not a guarantee of undetectability.

## External requests

| Destination                                                   | Information involved                                                                              | Trigger                                                                                                                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `https://ipwho.is/`                                           | The service observes the request's exit IP and returns country/network/location metadata.         | Extension startup, two-minute country alarm, selected network changes, popup refresh, and explicit IP checks. Ordinary lookups have a one-minute cache. |
| `https://www.cloudflare.com/cdn-cgi/trace`                    | The service observes the exit IP and returns an IP/country trace.                                 | Fallback after the primary metadata lookup fails.                                                                                                       |
| `https://api.ipify.org?format=json`                           | The service observes the IPv4 exit.                                                               | User selects the explicit IPv4 / IPv6 check.                                                                                                            |
| `https://api6.ipify.org?format=json`                          | The service observes the IPv6 exit if reachable.                                                  | User selects the explicit IPv4 / IPv6 check.                                                                                                            |
| GitHub release downloads for `bootmortis/iran-hosted-domains` | Request exit IP and requested domain-list/hash files.                                             | Manual list refresh; startup/daily refresh when Iranian-site auto-exemptions are enabled.                                                               |
| `https://www.abuseipdb.com/check/{IP}`                        | The selected IP is part of the report URL; the report website also receives the browsing request. | User opens the AbuseIPDB report.                                                                                                                        |
| `https://check.spamhaus.org/listed/?searchterm={IP}`          | The selected IP is part of the report URL; the report website also receives the browsing request. | User opens the Spamhaus report.                                                                                                                         |

Background lookup fetches omit credentials and use timeouts. Exit-IP fetches also explicitly omit the referrer. Reputation links use `noopener noreferrer`; opening an external website still invokes that website's own cookies, scripts, and privacy practices.

The extension does not fetch, scrape, cache, or combine reputation report results. The in-extension reputation status remains unverified. No shared API secrets are bundled. FoxyNet subscription URLs are no longer requested or required; legacy subscription settings are removed by the current settings migration.

## Permissions

| Permission              | Use                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| HTTP/HTTPS host access  | Run page shields and apply network-header rules across normal websites.                                |
| `storage`               | Save settings, lookup observations, lists, and temporary recovery state.                               |
| `alarms`                | Schedule country and optional domain-list refreshes.                                                   |
| `tabs`                  | Identify the active website, change toolbar status, and perform requested reloads/navigation recovery. |
| `scripting`             | Inspect selected active-page browser signals and patch status.                                         |
| `declarativeNetRequest` | Modify selected headers and apply optional Flow rules.                                                 |
| `privacy`               | Apply/release the browser-wide WebRTC IP-handling policy.                                              |
| `webNavigation`         | Track navigation needed for reload safety and optional Flow recovery.                                  |

With protection active, the extension can set `DNT: 1` and `Sec-GPC: 1`, remove `If-None-Match`, and—when the locale shield is enabled—rewrite `Accept-Language`. It also delivers a browser profile to eligible pages through an added `Server-Timing` entry. Existing server timing entries are preserved.

## Controls and limits

- Switch protection off to remove this extension's active network rules and release its WebRTC setting. Reload open websites to remove existing page patches.
- A site exception pauses applicable page/header changes for that domain and its subdomains; it does not override browser-wide WebRTC policy or change VPN routing.
- Disable optional compatibility/fingerprint features independently in Settings.
- Iranian-site auto-exemptions are off by default. Downloading the list manually is still an explicit external request.
- The exit display describes lookup-service routes. It cannot establish that every website, native app, or IPv6 connection uses a VPN.
- IP reputation reports and browser patches do not guarantee anonymity, account safety, or absence of leaks.

To remove stored local data, remove the extension through Chrome's extension manager. Disabling it alone does not erase local settings or cached observations. Any data already received by third-party services is governed by those services' policies.
