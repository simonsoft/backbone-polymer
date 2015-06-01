
describe("backbone-polymer", function() {

  describe("sample collection, no webpack", function() {

    it("Can be used on an element with a property that is a backbone collection", function() {

      var collection1 = document.querySelector('#collection1');
      expect(collection1).to.not.exist;

    });

  });

});
