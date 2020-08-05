# DotDotty

    (of a person, action, or idea) somewhat mad or eccentric.

DotDotty provides a very simple wrapper around a provided object that allows for lazy dot-syntax access via the `[]` accessor.

## Usage

    const DotDotty = require('dot-dotty')

    let myData = {a: true, b: false}
    let dot = DotDotty(myData)

    dot['a'] // true
    dot['c'] = 'maybe' // 'maybe'
    dot['d.0.first'] = 'expansion!' // 'expansion
    // dot now is {a: true: b: false, c: 'maybe', d: [{first: 'expansion!'}]}

A given object can be made immutable or denied expansion by providing an additional options object.

If isExpandable is true(default), new arrays, objects, and keys are created when set access is attempted. Arrays will be created if the value at a given key is not an object or array already and the target key can evaluate to a number. If the target key cannot evaluate as a number, the value at the given key is created as an object. Arrays will attempt to remain as arrays unless a non-number is used as the key, in which case the array will be non-destructively converted to an object.

## API

### Table of contents

- [function DotDotty](#function-dotdotty)

### function DotDotty

DotDotty return a Proxy against the given target object that can access properties via dot-syntax.

| Parameter              | Type               | Description                                                                                                                          |
| :--------------------- | :----------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `target`               | Object             | The target object to proxy DotDotty against.                                                                                         |
| `options`              | Object             |                                                                                                                                      |
| `options.isImmutable`  | Boolean? = `false` | Whether or not the target object should be changeable.                                                                               |
| `options.isExpandable` | Boolean? = `true`  | Whether or not new values may be placed into the object. These include new array entries and new object entries.                     |
| `options.throwErrors`  | Boolean? = `true`  | Whether or not to throw errors when invalid access or expansion occurs. If false, invalid access or expansion will return undefined. |

**Returns:** Proxy — A proxy to the target object that can use dot-notation to access or create properties.

#### Examples

> const DotDotty = require('dot-dotty')
>
> let myData = {a: 1, b: 2}
>
> let dot = DotDotty(myData)
>
> dot["a"] // returns 1
>
> dot["c.cA"] = true // returns true
>
> // dot now contains {a: 1, b:2, c: {cA: true}}
>
> dot["d.0.a"] = "test" // returns "test"
>
> // dot now contains {a: 1, b:2, c: {cA: true}, d: [{a: test}]}
