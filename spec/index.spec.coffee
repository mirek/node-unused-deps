
assert = require 'assert'
{ requires, isNodeish } = require '../src'

describe 'requires', ->
  it 'should pick import ... from ...', ->
    assert.deepEqual [ 'foo' ], requires('import foo from "foo"')

describe 'isNodeish', ->
  it 'should pick fixtures/foo as nodeish script', ->
    assert.ok isNodeish "#{__dirname}/fixtures/foo"
