// Init reqs
/* jslint node: true */
/* global describe: false */
/* global it: false */
'use strict';

var mwsProd = require('../'),
    utilex  = require('utilex'),
    expect  = require('chai').expect
;

// Tests

// Test for amazon seller module
describe('mwsProd', function() {

  // Init vars
  var auth        = {sellerId: 'SELLERID', accessKeyId: 'ACCESSKEYID', secretKey: 'SECRETKEY'},
      mplace      = 'US',
      appMWSProd  // mwsProd instance
  ;

  if(utilex.tidyArgs().testDEV !== undefined && utilex.tidyArgs().authJSON) {
    auth = require(utilex.tidyArgs().authJSON);
  }

  appMWSProd = mwsProd({auth: auth, marketplace: mplace});

  it('should get service status ', function(done) {
    appMWSProd.serviceStatus(function(err, data) {
      if(err) {
        done(err.message);
        return;
      }

      expect(data).to.have.property('GetServiceStatusResponse');
      var gssr = data.GetServiceStatusResponse;
      expect(gssr).to.be.a('object');
      expect(gssr).to.have.property('GetServiceStatusResult');
      expect(gssr.GetServiceStatusResult).to.be.a('object');
      expect(gssr.GetServiceStatusResult).to.have.property('Status');
      expect(gssr.GetServiceStatusResult.Status).to.be.a('string');
      done();
    });
  });

  if(auth.sellerId && auth.sellerId != 'SELLERID') {

    // Init var
    var prodID = 'B00863WC40';

    it('should get matching products for ' + prodID, function(done) {
      appMWSProd.matchingProductForId({idType: 'ASIN', idList: [prodID]}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetMatchingProductForIdResponse');
        var gmpfiresp = data.GetMatchingProductForIdResponse;
        expect(gmpfiresp).to.be.a('object');
        expect(gmpfiresp).to.have.property('GetMatchingProductForIdResult');
        var gmpfires = gmpfiresp.GetMatchingProductForIdResult;
        expect(gmpfires).to.be.a('array');
        expect(gmpfires[0]).to.have.property('A$');
        expect(gmpfires[0]['A$']).to.be.a('object');
        expect(gmpfires[0]['A$']).to.have.property('Id', prodID);
        done();
      });
    });
  }
});