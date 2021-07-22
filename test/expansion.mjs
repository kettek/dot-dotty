import test from 'ava'
import DotDotty from '../src/index.mjs'

test('Expansion', t => {
  let obj = {
    a: 1,
  }
  let dd = DotDotty({...obj})

  dd['b.2.2.alpha.4'] = 3

  t.is(3, dd['b.2.2.alpha.4'])

  dd['b.properties.yeetums.2.2'] = true

  t.is(true, dd['b.properties.yeetums.2.2'])
})

test('Expand over null', t => {
  let obj = {
    a: [
      null,
      null,
      3
    ]
  }
  let dd = DotDotty({...obj}, {expandOverNull: true})

  dd['a.1.1'] = 3

  t.is(3, dd['a.1.1'])
})

