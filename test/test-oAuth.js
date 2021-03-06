// Copyright IBM Corp. 2016,2019. All Rights Reserved.
// Node module: loopback-connector-swagger
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const should = require('should');
const oAuth = require('../lib/oAuth');

describe('oAuth - standalone', function() {
  describe('accessToken auth constructor', function() {
    it('creates AccessTokenAuthorization obj', function(done) {
      const atAuth = new oAuth.AccessTokenAuthorization(
        'sampleOAuth',
        'access_token_123',
        'header'
      );
      atAuth.should.have.property('name').equal('sampleOAuth');
      atAuth.should.have.property('token').equal('access_token_123');
      atAuth.should.have.property('type').equal('header');
      done();
    });
  });

  describe('access_token in query', function() {
    let atAuth, reqObj;
    beforeEach(function(done) {
      atAuth = new oAuth.AccessTokenAuthorization('sampleOAuth',
        'sampleAccessToken',
        'query');
      reqObj = {url: 'http://sampleApi/api/getPet'};
      done();
    });

    it('adds access token as querystring',
      function(done) {
        const newUrl = reqObj.url + '?access_token=sampleAccessToken';
        atAuth.apply(reqObj);
        reqObj.url.should.equal(newUrl);
        done();
      });

    it('appends access token at the end of existing querystring',
      function(done) {
        reqObj.url = reqObj.url + '?abc=123';
        const newUrl = reqObj.url + '&access_token=sampleAccessToken';
        atAuth.apply(reqObj);
        reqObj.url.should.equal(newUrl);
        done();
      });

    it('does not modify query if access_token is present', function(done) {
      reqObj.url = reqObj.url + '?access_token=sampleAccessToken';
      const newUrl = reqObj.url;
      atAuth.apply(reqObj);
      reqObj.url.should.equal(newUrl);
      done();
    });
  });

  describe('access_token in header', function() {
    let atAuth, reqObj;
    beforeEach(function(done) {
      atAuth = new oAuth.AccessTokenAuthorization('sampleOAuth',
        'sampleAccessToken');
      reqObj = {url: 'http://sampleApi/api/getPet'};
      done();
    });

    it('adds access token in headers when no headers.Authorization present',
      function(done) {
        reqObj.headers = {};
        atAuth.apply(reqObj);
        reqObj.headers.should.have.property('Authorization')
          .equal('Bearer sampleAccessToken');
        done();
      });

    it('adds access token in headers when authorization header is empty',
      function(done) {
        reqObj.headers = {Authorization: ''};
        atAuth.apply(reqObj);
        reqObj.headers.should.have.property('Authorization')
          .equal('Bearer sampleAccessToken');
        done();
      });
    it('treats "authorization" header case-insensitively',
      function(done) {
        reqObj.headers = {autHoriZation: ''};
        atAuth.apply(reqObj);
        reqObj.headers.should.have.property('autHoriZation')
          .equal('Bearer sampleAccessToken');
        done();
      });
    it('does not add to authorization header if one already present',
      function(done) {
        reqObj.headers = {Authorization: 'alreadyIamhere'};
        atAuth.apply(reqObj);
        reqObj.headers.should.have.property('Authorization')
          .equal('alreadyIamhere');
        done();
      });
  });
});
