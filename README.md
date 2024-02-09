# Material Ripple Web

Material Ripple Web is a library for adding ripple effects to the web. Its implementation is based on the official [<md-ripple>] web component.

<div align="center">
	<img src="./assets/example.gif" width="300" height="auto">
</div>

- [Installation](#installation)
- [Usage](#usage)
- [Theming](#theming)
- [Examples](#examples)

## Installation

Install the package from npm using your preferred package manager.

```bash
npm install material-ripple-web
pnpm add material-ripple-web
bun add material-ripple-web
yarn add material-ripple-web
```

## Usage

Include the stylesheet in the HTML.

```html
<link
	rel="stylesheet"
	href="./node-modules/material-ripple-web/dist/ripple.css"
/>
```

Place the ripple element in a `position: relative` container and attach the event listeners using the `Ripple` class.

```html
<button style="position: relative">
	<div id="ripple"></div>
	<span>Click me</span>
</button>
<script type="module">
	import { Ripple } from "./node-modules/material-ripple-web/dist/index.js";

	const rippleEl = document.getElementById("ripple");
	const ripple = new Ripple(rippleEl);
</script>
```

You can remove the event listeners by calling the `destroy` method.

```js
ripple.destroy();
```

You can also disabled the ripple by setting the `disabled` property to `true`, which adds the `data-disabled` attribute to the ripple element.

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

## Examples

### React

```tsx
import "material-ripple-web/ripple.css";
import { Ripple as MaterialRipple } from "material-ripple-web";
import React from "react";

export function Ripple({ disabled }: { disabled?: boolean }) {
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (!ref.current) return;
		const ripple = new MaterialRipple(ref.current);
		return () => ripple.destroy();
	}, []);

	return <div ref={ref} data-disabled={disabled ? "" : undefined} />;
}
```

### Svelte

```svelte
<script lang="ts">
    import "material-ripple-web/ripple.css";
    import { Ripple } from "material-ripple-web";

    export let disabled: boolean = false;

    function ripple(node: HTMLElement) {
        const ripple = new Ripple(node);
        return {
            destroy: () => ripple.destroy(),
        };
    }
</script>

<div use:ripple data-disabled={disabled ? "" : undefined} />
```

[<md-ripple>]: https://github.com/material-components/material-web/tree/main/ripple
[documentation]: https://svelte-material-ripple.vercel.app
