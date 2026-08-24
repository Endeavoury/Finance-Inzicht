# Versioning and publishing

Each public package starts at `0.1.0` and uses semantic versioning. During the pre-1.0 phase, breaking API changes increment the minor version. After 1.0, breaking changes increment major, additive changes minor, and fixes patch.

## Release checklist

1. Update the changelog and package versions together.
2. Run `npm ci` and `npm run check` from this directory.
3. Inspect `npm pack --dry-run` for each publishable package.
4. Review the generated bundle report and Storybook product screens.
5. Publish tokens, styles, components, then optional adapters with provenance enabled.
6. Tag the repository with `design-system-v<version>`.

Workspace dependencies currently use exact matching versions so a release is reproducible. Public package exports expose only intentional entry points. Build output, source declarations, and CSS assets are included; tests, Storybook, examples, and current-application code are not.

Before the first public registry release, the owner must confirm package scope ownership, repository metadata, license policy, supported-browser policy, and npm provenance/2FA settings. Until then, publishing should target a private registry or use `npm pack` artifacts for integration testing.
