# ASCIIBOI

A small creature who used to be a file and now has a URL.

## Live habitat

**https://asciiboi.tiiny.site/**

That is the real site (creature, buttons, terminal).

`https://srandee.github.io/asciiboi/` is GitHub’s decorative “404 / Site not found” page until Pages is turned on. It is not the habitat.

To make the GitHub URL work (phone: switch to desktop site):

1. [Settings → Pages](https://github.com/Srandee/asciiboi/settings/pages)
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` / `/ (root)` → Save

Then https://srandee.github.io/asciiboi/ becomes the same habitat.

## Local

```bash
python3 -m http.server 4173 --directory docs
```
