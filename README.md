# Replit Docs

These are the [docs](https://docs.repl.it) for [Repl.it](https://repl.it) stored in markdown.

This project also holds a simple webserver to render and serve the docs. You can run it locally with 

```
npm i
node index.js
```

and then visiting http://localhost:3000 in your browser.

# Contributing

If you'd like to contribute please [fork this repl](https://docs.repl.it/__repl), then share your fork in an issue on the [github repo](https://github.com/replit/replit.github.io/). Alternatively, you can submit a pull request to the same github repo.

When adding new pages, the markdown file should be placed in the appropriate folder (`repls`/`classrooms`/`misc`), and an additional entry should be added to the `sidebar.json` file.

The markdown files support the following HTML tags:
* `img`
* `iframe`
* `pre`
* `code`
* `div`
* `video`
* `source`

Though markdown is preferred whenever possible.  Most of these tags are used when specific styles (such as inline images) are needed.

# Contact

If you need anything, feel free to reach out to us at [contact@repl.it](mailto:contact@repl.it) or open an issue on this repo.
