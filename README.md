# ASCIIBOI

A small creature who used to be a file and now has a URL.

## Live habitat (this one stays up)

**https://rawcdn.githack.com/Srandee/asciiboi/c7f8a5a/docs/index.html**

That is the real site: creature, tap buttons, optional typing.

Free hosts like tiiny.site expire. When they do, they show **“Sorry, this content doesn’t exist.”** That is their takedown page, not ASCIIBOI. `github.io` shows GitHub’s own 404 until Pages is enabled.

To make **https://srandee.github.io/asciiboi/** work:

1. [Settings → Pages](https://github.com/Srandee/asciiboi/settings/pages) (phone: desktop site)
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **/ (root)** → Save

## Local

```bash
python3 -m http.server 4173 --directory docs
```
