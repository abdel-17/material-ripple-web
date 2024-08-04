# Material Ripple Web

Material Ripple Web is a framework agnostic library for adding ripple effects to the web.

<div align="center">
    <img src="../assets/example.gif" width="300" height="auto">
</div>

## Getting Started

### CDN

Include the stylesheet in your HTML.

```html
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/material-ripple-web@latest/dist/ripple.min.css"
    crossorigin="anonymous"
>
```

Import the `Ripple` class.

```js
import { Ripple } from "https://cdn.jsdelivr.net/npm/material-ripple-web@latest/dist/index.min.js";
```

### npm

Install the `material-ripple-web` package.

```sh
npm install material-ripple-web
```

Import the stylesheet.

```js
import "material-ripple-web/ripple.css";
```

Import the `Ripple` class.

```js
import { Ripple } from "material-ripple-web";
```

## Usage

Place and ripple element in a parent with a `relative` position

```html
<button style="position: relative">
    <div id="ripple"></div>
    Click
</button>
```

Create an instance of the `Ripple` class and call `attach()`.

```js
const ripple = new Ripple(document.getElementById("ripple"));
ripple.attach();
```

If the element is later removed, you need to call `detach()`
to cleanup any event listeners added.

```js
ripple.detach();
```

## Theming

Ripples can be customized using CSS variables.

| Token                      | Default        |
| -------------------------- | -------------- |
| `--ripple-hover-color`     | `currentColor` |
| `--ripple-hover-opacity`   | `0.08`         |
| `--ripple-pressed-color`   | `currentColor` |
| `--ripple-pressed-opacity` | `0.12`         |

Here is an example of how to customize the ripple globally.

```css
:root {
    --ripple-hover-color: red;
    --ripple-hover-opacity: 0.1;
    --ripple-pressed-color: red;
    --ripple-pressed-opacity: 0.2;
}
```

## Examples

To preview the examples, first build the project.

```sh
pnpm build
```

Then, run the `preview` command to start the server.

```sh
pnpm preview
```

Finally, go to http://localhost:8080/examples.

# Documentation

Read the [API documentation](../docs/README.md).
