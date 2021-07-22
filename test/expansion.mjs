import test from 'ava'
import DotDotty from '../src/index.mjs'

test('Expansion', t => {
  let obj = {
    a: 1,
  }
  let dd = DotDotty({...obj})

  dd['b.2.2.alpha.4'] = 3

  t.is(3, dd['b.2.2.alpha.4'])
})
