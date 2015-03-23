var expect = chai.expect;
var assert = chai.assert;
var nbs;

describe('onPageMessage', function(){

  describe('# Check Replay', function(){

    describe('# Check if ReplayBox is active', function(){

      before(function() {
        nbs = new NBS();
      });

      it('checkStatus function should return an obj', function(){
        expect(nbs).to.have.property('checkStatus');


      });

    });

  });

});