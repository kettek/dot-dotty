/*
 * Copyright (c) 2020 Ketchetwahmeegwun T. Southall
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * A module that provides a simple Proxy wrapper for dot-syntax access.
 * @module DotDotty
 */ 

 /**
  * DotDotty return a Proxy against the given target object that can access properties via dot-syntax.
  * @kind function
  * @name DotDotty
  * @example
  * const DotDotty = require('dot-dotty')
  * 
  * let myData = {a: 1, b: 2}
  * 
  * let dot = DotDotty(myData)
  * 
  * dot["a"] // returns 1
  * 
  * dot["c.cA"] = true // returns true
  * 
  * // dot now contains {a: 1, b:2, c: {cA: true}}
  * 
  * dot["d.0.a"] = "test" // returns "test"
  * 
  * // dot now contains {a: 1, b:2, c: {cA: true}, d: [{a: test}]}
  * 
  * @param {Object} target The target object to proxy DotDotty against.
  * @param {Object} options
  * @param {Boolean} [options.isImmutable=false] Whether or not the target object should be changeable.
  * @param {Boolean} [options.isExpandable=true] Whether or not new values may be placed into the object. These include new array entries and new object entries.
  * @param {Boolean} [options.throwErrors=true] Whether or not to throw errors when invalid access or expansion occurs. If false, invalid access or expansion will return undefined.
  * @param {Boolean} [options.preventPrototypeKeywords=true] Whether or not prototype keywords should be allowed within keys. If true, "__proto__", "constructor", and "prototype" will be silently truncated. If throwErrors is true, an error will be thrown.
  * @param {Boolean} [options.removeLeadingDots=true] Whether or not to remove leading dots from the target. The effectively cleans ".prop.a" => "prop.a".
  * @param {String} [options.prefix=""] A prefix to add to the dot-notation string.
  * @param {String} [options.suffix=""] A suffix to add to the dot-notation string.
  * @returns {Proxy} A proxy to the target object that can use dot-notation to access or create properties.
  */
const DotDotty = function(target, {
  isImmutable=false,
  isExpandable=true,
  throwErrors=true,
  preventPrototypeKeywords=true,
  removeLeadingDots=true,
  prefix="",
  suffix=""
}={}) {
  return new Proxy(target, {
    get: (obj, prop) => {
      if (removeLeadingDots) {
        prop = prop.replace(/^[\.]*/g, '')
      }
      prop = prefix + prop + suffix
      let parts = prop.split('.')
      for (let i = 0; i < parts.length; i++) {
        let part = parts[i]
        obj = obj[part]
        if (obj === undefined) {
          if (throwErrors) {
            if (i === 0) {
              throw new Error(`invalid target "${part}"\n${prop}\n^`)
            } else {
              throw new Error(`invalid target "${part}" in "${parts.slice(0, i).join('.')}"\n${prop}\n${" ".repeat(parts.slice(0, i).join('.').length)}^`)
            }
          }
          return undefined
        }
      }
      return obj
    },
    set: (obj, prop, value) => {
      if (isImmutable) return
      if (removeLeadingDots) {
        prop = prop.replace(/^[\.]*/g, '')
      }
      prop = prefix + prop + suffix
      let parts = prop.split('.')
      let prevPart
      for (let i = 0; i < parts.length-1; i++) {
        let part = parts[i]
        if (preventPrototypeKeywords && isPrototypePolluted(part)) {
          if (throwErrors) {
            throw new Error(`prototype keyword "${part}" disallowed`)
          }
          continue
        }
        if (!isNaN(part)) {
          part = Number(part)
        }
        let nextPart = parts[i+1]
        if (nextPart !== undefined && isExpandable) {
          if (!isNaN(nextPart)) {
            if (obj[part] === undefined || typeof obj[part] !== 'object') {
              obj[part] = []
            }
          } else {
            if (obj[part] === undefined || typeof obj[part] !== 'object') {
              obj[part] = {}
            }
          }
        }
        if (obj[part] === undefined) {
          if (throwErrors) {
            if (i === 0) {
              throw new Error(`invalid target "${part}"\n${prop}\n^`)
            } else {
              throw new Error(`invalid target "${part}" in "${parts.slice(0, i).join('.')}"\n${prop}\n${" ".repeat(parts.slice(0, i).join('.').length)}^`)
            }
          }
          return undefined
        }
        obj = obj[part]
        prevPart = part
      }
      if (obj[parts[parts.length-1]] === undefined) {
        if (!isExpandable) {
          if (throwErrors) {
            if (parts.length-1 === 0) {
              throw new Error(`invalid target "${parts[parts.length-1]}"\n${prop}\n^`)
            } else {
              throw new Error(`invalid target "${parts[parts.length-1]}" in "${parts.slice(0, parts.length-1).join('.')}"\n${prop}\n${" ".repeat(parts.slice(0, parts.length-1).join('.').length)}^`)
            }
          }
          return undefined
        }
      }
      return obj[parts[parts.length-1]] = value
    },
  })
}

/**
 * Blacklist certain keys to prevent Prototype Pollution
 * @param {String} key The Object key to check
 * @returns {Boolean} true if key is blacklisted
 */
const isPrototypePolluted = function(key) {
  return ['__proto__', 'constructor', 'prototype'].includes(key)
}

/** DotDotty export */
export default DotDotty

