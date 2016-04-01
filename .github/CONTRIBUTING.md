# Contributing to magic-mirror-demo

Contributions are always welcome. Before contributing please
[search the issue tracker](https://github.com/MicrosoftEdge/magic-mirror-demo/issues);
your issue may have already been discussed or fixed in `master`. To contribute,
[fork](https://help.github.com/articles/fork-a-repo/) magic-mirror-demo, commit your changes,
& [send a pull request](https://help.github.com/articles/using-pull-requests/).

## Coding Guidelines

In addition to the following guidelines, please follow the conventions already
established in the code.

### General Guidelines

- **Spacing**:<br>
  Use two spaces for indentation. No tabs.

- **Naming**:<br>
  Keep variable & method names concise & descriptive.<br>
  Variable names `index`, `collection`, & `callback` are preferable to
  `i`, `arr`, & `fn`.

### JavaScript Guidelines

- **Quotes**:<br>
  Single-quoted strings are preferred to double-quoted strings; however,
  please use a double-quoted string if the value contains a single-quote
  character to avoid unnecessary escaping.

- **Comments**:<br>
  Please use single-line comments to annotate significant additions, &
  [JSDoc-style](http://www.2ality.com/2011/08/jsdoc-intro.html) comments for
  functions.

JS guidelines are enforced using [JSCS](https://www.npmjs.com/package/jscs):

```bash
$ npm run style
```

### CSS Guidelines

CSS is maintained with light use of the [Sass preprocessor](http://sass-lang.com/); learn how to install Sass locally [here](http://sass-lang.com/install).

Do not edit `public\style\style.css` directly, or your changes will be wiped out the next time that the Sass files are compiled. To make changes to the CSS, navigate to `\public\style\sass\` in your command line of choice, and run `sass --watch style.scss:../style.css --style compressed`.

- **Selectors and nesting**: <br />
  Keep selector specificity as low as possible, within reason (for example, if a specific element already has an ID for scripting purposes, don't worry about adding a class to the markup just to avoid using IDs in the CSS). Do not nest selectors in Sass for the sake of code aesthetics, when this would add unnecessary specificity or bytes to the files.

#### Other syntax and ordering

We've added the [CSScomb](http://csscomb.com/) linter to help you follow syntax guidelines and declaration ordering without having to manually adjust the more tedious stylistic bits.

For an example of style the linter enforces:

```
.parent > .direct-child,
.another-selector {
  background: url("sample.png") no-repeat;
  color: #fff;

  .nested-selector {
    opacity: .5;
  }
}
```

The declarations are ordered by type. See the `sort-order` array in `\.csscomb.json` to see how we've organized these types.

How to install CSScomb and run:

1. Install CSScomb from the command line using `npm install csscomb -g`.
2. Make sure you have Sass watching for changes before running CSScomb on the Sass files. See instructions above.
3. Navigate to `public\style` on the command line and run `csscomb sass`. This will run the linting on all files in the `sass` directory. One downside is that no feedback is given on the command line when it successfully runs, but you'll see updates when checking `git status`.

Please run this each time you add Sass to the project, before committing your work.