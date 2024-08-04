[material-ripple-web](../README.md) / Ripple

# Class: Ripple

## Constructors

### new Ripple()

> **new Ripple**(`element`, `props`): [`Ripple`](Ripple.md)

#### Parameters

• **element**: `HTMLElement`

• **props**: [`RippleProps`](../type-aliases/RippleProps.md) = `{}`

#### Returns

[`Ripple`](Ripple.md)

#### Defined in

[index.ts:150](https://github.com/abdel-17/material-ripple-web/blob/18e61e5924a99574df77416988bc42be642c8248/src/index.ts#L150)

## Properties

### defaultEasing

> `readonly` `static` **defaultEasing**: `"cubic-bezier(0.2, 0, 0, 1)"` = `"cubic-bezier(0.2, 0, 0, 1)"`

#### Defined in

[index.ts:96](https://github.com/abdel-17/material-ripple-web/blob/18e61e5924a99574df77416988bc42be642c8248/src/index.ts#L96)

## Accessors

### disabled

> `get` **disabled**(): `boolean`

Whether or not the ripple is disabled.

> `set` **disabled**(`disabled`): `void`

#### Parameters

• **disabled**: `boolean`

#### Returns

`boolean`

#### Defined in

[index.ts:134](https://github.com/abdel-17/material-ripple-web/blob/18e61e5924a99574df77416988bc42be642c8248/src/index.ts#L134)

***

### easing

> `get` **easing**(): `string`

The easing function used for the ripple animation.

> `set` **easing**(`easing`): `void`

#### Parameters

• **easing**: `string`

#### Returns

`string`

#### Defined in

[index.ts:123](https://github.com/abdel-17/material-ripple-web/blob/18e61e5924a99574df77416988bc42be642c8248/src/index.ts#L123)

***

### element

> `get` **element**(): `HTMLElement`

The ripple element.

#### Returns

`HTMLElement`

#### Defined in

[index.ts:109](https://github.com/abdel-17/material-ripple-web/blob/18e61e5924a99574df77416988bc42be642c8248/src/index.ts#L109)

***

### target

> `get` **target**(): `null` \| `EventTarget`

The element the ripple is currently attached to.

#### Returns

`null` \| `EventTarget`

#### Defined in

[index.ts:116](https://github.com/abdel-17/material-ripple-web/blob/18e61e5924a99574df77416988bc42be642c8248/src/index.ts#L116)

## Methods

### attach()

> **attach**(`target`?): `void`

Attaches this ripple to the given target.

#### Parameters

• **target?**: `null` \| `EventTarget`

The element to attach the ripple to.

If `target` is not provided, the ripple is attached to the
element with the same id as the "data-target" attribute.

If the "data-target" attribute is not present,
the ripple is attached to its parent.

#### Returns

`void`

#### Defined in

[index.ts:178](https://github.com/abdel-17/material-ripple-web/blob/18e61e5924a99574df77416988bc42be642c8248/src/index.ts#L178)

***

### detach()

> **detach**(): `void`

Removes the event listeners added by this ripple.

#### Returns

`void`

#### Defined in

[index.ts:204](https://github.com/abdel-17/material-ripple-web/blob/18e61e5924a99574df77416988bc42be642c8248/src/index.ts#L204)

***

### handleEvent()

> **handleEvent**(`event`): `void`

**`Internal`**

#### Parameters

• **event**: `Event`

#### Returns

`void`

#### Defined in

[index.ts:217](https://github.com/abdel-17/material-ripple-web/blob/18e61e5924a99574df77416988bc42be642c8248/src/index.ts#L217)
