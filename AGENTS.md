# Repository boundaries

The application and design system are sibling repositories in the shared
workspace. Application code lives in `application/`; reusable Web Components
live in `design/`, backed by `Endeavoury/Finance-DesignSystem`.

- Do not duplicate design-system source into Oikonomis.
- Commit and push design-system changes from the sibling `design/` repository.
- Commit application integration changes from the `application/` repository.
- Keep the application consuming the sibling Web Components; avoid
  application-specific business logic in the design system.
- Run `npm run check` inside `design/` for design-system changes and
  build `src/Web` for application integration changes.
