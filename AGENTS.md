# Repository boundaries

`design-system/` is a Git submodule backed by the separate
`Endeavoury/Finance-DesignSystem` repository. Treat it as an independent
package and Git history while keeping it available when application and design
work must be reviewed together.

- Do not duplicate design-system source into Finance Inzicht.
- Commit and push design-system changes from inside `design-system/` first.
- Commit the resulting submodule revision in Finance Inzicht second.
- Keep the application consuming the Web Components from the submodule; avoid
  application-specific business logic in the design system.
- Run `npm run check` inside `design-system/` for design-system changes and
  build `src/Web` for application integration changes.
