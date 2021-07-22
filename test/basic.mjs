import test from 'ava'
import DotDotty from '../src/index.mjs'

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
