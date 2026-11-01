# This fork

A restyled build of [Umami](https://github.com/umami-software/umami) for my own VPS. The analytics
engine is untouched; only the UI layer changes.

- **UI kit:** Umami's `@umami/react-zen` is aliased to `src/lib/zen`, which re-exports the real
  package and swaps in [Animate UI](https://animate-ui.com) dialogs, dropdown menus and toasts.
  Upstream code keeps importing `@umami/react-zen` unchanged.
- **Tailwind:** `src/app/animate.css` builds only our own components, with a `tw:` prefix so it never
  collides with the Tailwind build that ships inside react-zen.
- **Icons:** Hugeicons in the files we restyled (login, sidebar, account menu, toasts, dialogs).
- **Image:** `.github/workflows/image.yml` pushes `ghcr.io/csingogo/umami:latest` on every push to `master`.

## Updating from upstream

```sh
git fetch upstream && git merge upstream/master
```

Conflicts, if any, will be in `package.json`, the lockfile, `SideNav.tsx`, `UserButton.tsx` and the
login files, which are the ones we rewrote.
