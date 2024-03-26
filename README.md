# Material Ripple Web

Material Ripple Web is a framework agnostic library for adding ripple effects to the web.

<div align="center">
    <img src="./assets/example.gif" width="300" height="auto">
</div>

- [Installation](#installation)
- [Usage](#usage)
- [Theming](#theming)

## Installation

### npm

```bash
npm install material-ripple-web
```

If you are using a bundler like Webpack or Rollup, you can import the stylesheet directly.

```js
import "material-ripple-web/ripple.css";
```

### CDN

Include the following in the `<head>` of your HTML.

```html
<script
	type="module"
	src="https://cdn.jsdelivr.net/npm/material-ripple-web@latest/dist/index.min.js"
></script>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/material-ripple-web@latest/dist/ripple.min.css"
/>
```

## Usage

Place the ripple element in a `position: relative` container.

```html
<button style="position: relative">
	<div id="ripple"></div>
	<span>Click me</span>
</button>
```

Import `Ripple` and attach it to the ripple element.

```js
import { Ripple } from "material-ripple-web";

const ripple = new Ripple(document.getElementById("ripple"));
ripple.attach();
```

You can remove the attached event listeners by calling the `detach` method.

```js
ripple.detach();
```

## Options

By default, the ripple listens for events on the parent element. You can
override this behavior by passing an element to the `attach` method.

```js
ripple.attach(target);
```

You can customize the easing function used for the ripple animation
by setting the `easing` property on the ripple.

```js
ripple.easing = "ease-in-out";
```

You can disable the ripple by setting the `disabled` property to `true`.

```js
ripple.disabled = true;
```

## Theming

Ripples support theming using CSS variables.

| Token                      | Default        |
| -------------------------- | -------------- |
| `--ripple-hover-color`     | `currentColor` |
| `--ripple-hover-opacity`   | `0.08`         |
| `--ripple-pressed-color`   | `currentColor` |
| `--ripple-pressed-opacity` | `0.12`         |
