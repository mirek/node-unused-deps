
assert = require 'assert'
fs = require 'fs'
{ requires, scanRequires, isNodeish } = require '../src'

describe 'requires', ->

  it 'should pick import ... from ...', ->
    assert.deepEqual [ 'foo' ], requires('import foo from "foo"')

describe 'scanRequires', ->

  it 'should pick stuff from fixtures', ->
    assert.deepEqual [ 'bluebird', 'cacheman', 'fs' ], scanRequires "#{__dirname}/fixtures"

describe 'isNodeish', ->
  it 'should pick fixtures/foo as nodeish script', ->
    assert.ok isNodeish "#{__dirname}/fixtures/foo"
