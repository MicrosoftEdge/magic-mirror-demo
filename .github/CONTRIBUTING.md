# Contributing to magic-mirror-demo

Contributions are always welcome. Before contributing please
[search the issue tracker](https://github.com/MicrosoftEdge/magic-mirror-demo/issues);
your issue may have already been discussed or fixed in `master`. To contribute,
[fork](https://help.github.com/articles/fork-a-repo/) magic-mirror-demo, commit your changes,
& [send a pull request](https://help.github.com/articles/using-pull-requests/).

## Coding Guidelines

In addition to the following guidelines, please follow the conventions already
established in the code.

- **Spacing**:<br>
  Use two spaces for indentation. No tabs.

- **Naming**:<br>
  Keep variable & method names concise & descriptive.<br>
  Variable names `index`, `collection`, & `callback` are preferable to
  `i`, `arr`, & `fn`.

- **Quotes**:<br>
  Single-quoted strings are preferred to double-quoted strings; however,
  please use a double-quoted string if the value contains a single-quote
  character to avoid unnecessary escaping.

- **Comments**:<br>
  Please use single-line comments to annotate significant additions, &
  [JSDoc-style](http://www.2ality.com/2011/08/jsdoc-intro.html) comments for
  functions.

Guidelines are enforced using [JSCS](https://www.npmjs.com/package/jscs):

```bash
$ npm run style
```
