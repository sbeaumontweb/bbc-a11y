/* eslint-env mocha */
var sections = require('../lib/standards/sections')
var assert = require('assert')
var http = require('httpism')

describe('Standards.sections', function () {
  it('has a unique documentationUrl for each section', function () {
    var urls = {}
    for (var name in sections) {
      var section = sections[name]
      assert.equal(typeof section.documentationUrl, 'string')
      if (urls[section.documentationUrl]) assert.fail('duplicate: ' + section.documentationUrl)
      urls[section.documentationUrl] = true
    }
  })

  it('has a valid documentationUrl for each section (set TEST_DOCUMENTATION_URLS=true to run this test)', function () {
    if (process.env.TEST_DOCUMENTATION_URLS !== 'true') {
      return
    }
    this.timeout(60000)
    return Promise.all(Object.values(sections).map(section => {
      return http.get(section.documentationUrl)
        .then(body => {
          if (body.indexOf('Not found') > -1) { throw new Error(`Invalid documentationUrl: ${section.documentationUrl}`) }
        })
    }))
  })
})
