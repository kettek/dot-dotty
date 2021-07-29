import test from 'ava'
import DotDotty from '../src/index.mjs'

test('Root', t => {
  let obj = {
    a: 1,
    b: [2],
  }
  let dd = DotDotty(obj)

  t.deepEqual(dd[''], obj)
})

test('Basic', t => {
  let obj = {
    a: 1,
    b: [2],
    c: {
      d: 3,
      e: [],
    }
  }
  let dd = DotDotty({...obj})

  t.deepEqual(dd['a'], obj.a)

  dd['a'] = 2

  t.notDeepEqual(dd['a'], obj.a)

  dd['b'] = 2

  t.notDeepEqual(dd['b'], obj.b)
})

test('Delete', t => {
  let obj = {
    a: 1,
    b: [2],
    c: {
      d: 3,
      e: [],
    }
  }
  let dd = DotDotty({...obj}, {throwErrors: false})

  delete dd['a']

  t.notDeepEqual(dd['a'], obj.a)

  delete dd['b']

  t.deepEqual(dd['b'], undefined)
})

test('Leading Dot Removal', t => {
  let obj = {
    a: 1,
  }

  let dd = DotDotty({...obj})

  t.deepEqual(dd['.a'], obj.a)
  t.deepEqual(dd['..a'], obj.a)
  t.deepEqual(dd['...a'], obj.a)
})
