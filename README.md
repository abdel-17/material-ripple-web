# Material Ripple Web

Material Ripple Web is a framework agnostic library for adding ripple effects to the web.

<div align="center">
    <img src="./assets/example.gif" width="300" height="auto">
</div>

-   [Installation](#installation)
-   [Usage](#usage)
-   [Props](#props)
-   [Theming](#theming)

## Installation

```bash
npm install material-ripple-web
```

## Usage

Import the ripple stylesheet.

```ts
import "material-ripple-web/ripple.css";
```

Place the ripple element in a `position: relative` container.

```html
<button style="position: relative">
    <div id="ripple"></div>
    Click
</button>
```

Import `Ripple` and attach it to the ripple element.

```js
import { Ripple } from "material-ripple-web";

const ripple = new Ripple(document.getElementById("ripple"));
```

You can remove the attached event listeners by calling the `detach` method.

```js
ripple.detach();
```

## Props

### target?: EventTarget | null

By default, the ripple listens for events on the parent element.
You can override this behavior by passing an element to the `target` prop.

```html
<div style="position: relative">
    <div id="ripple"></div>
    <input id="ripple-target" type="checkbox" />
</div>
```

```js
const ripple = new Ripple(document.getElementById("ripple"), {
    target: document.getElementById("ripple-target"),
});
```

You can also manually set the target by calling the `attach` method.

```js
ripple.attach(document.getElementById("ripple-target"));
```

### easing?: string

The easing function used for the ripple animation.
By default, this is set to `cubic-bezier(0.2, 0, 0, 1)`.

```js
const ripple = new Ripple(document.getElementById("ripple"), {
    easing: "ease-in-out",
});
```

You can also manually set the `easing` property.

```js
ripple.easing = "ease-in-out";
```

### disabled?: boolean

Whether or not the ripple is initially disabled.
By default, this is set to `false`.

```js
const ripple = new Ripple(document.getElementById("ripple"), {
    disabled: true,
});
```

You can also manually set the `disabled` property.

```js
ripple.disabled = true;
```

Disabled ripples have a `data-disabled` property on the ripple element.

## Theming

Ripples support theming using CSS variables.

| Token                      | Default        |
| -------------------------- | -------------- |
| `--ripple-hover-color`     | `currentColor` |
| `--ripple-hover-opacity`   | `0.08`         |
| `--ripple-pressed-color`   | `currentColor` |
| `--ripple-pressed-opacity` | `0.12`         |

```css
.ripple {
    --ripple-hover-color: red;
    --ripple-hover-opacity: 0.1;
    --ripple-pressed-color: red;
    --ripple-pressed-opacity: 0.2;
}
```
