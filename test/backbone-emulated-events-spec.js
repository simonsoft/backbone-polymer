
var expect = require('chai').expect;
var BackbonePolymerAttach = require('../backbone-polymer-mixin');
var Backbone = require('yobo').Backbone;

var PolymerElementMock = function() {

  this.splice = function(path, index, removeCount, items) {
    console.log('Polymer got splice', arguments);
  };

  this.notifyPath = function() {
    console.log('Polymer got notifyPath', arguments);
  };

};

describe("Array modification through Polymer splices, emulate backbone events", function() {

  describe("Backbone events before backbone-polymer", function() {

    it("add model", function() {
      var c = new Backbone.Collection();
      var m = new Backbone.Model({id: 'a1', type: 'testmodel'})
      c.on('add', function(model, collection, options) {
        console.log('add', m === model ? '(model)' : model, c === collection ? '(collection)' : collection, JSON.stringify(options));
      });
      c.add(m);
    });

    it("add model at index", function() {
      var c = new Backbone.Collection();
      c.add({id: 'a2', type: 'testmodel2'});
      c.add({id: 'a3', type: 'testmodel3'});
      var m = new Backbone.Model({id: 'a1', type: 'testmodel'})
      c.on('add', function(model, collection, options) {
        console.log('add', m === model ? '(model)' : model, c === collection ? '(collection)' : collection, JSON.stringify(options));
      });
      var added = c.add(m, {at: 1});
      console.log('add returned', m === added ? '(model)' : model);
    });

  });

  describe("#add", function() {

    it("Is transparent to backbone add event listener", function() {
      var e = new PolymerElementMock();
      var c = new Backbone.Collection();
      var adds = [];
      c.on('add', function() { adds.push(arguments); });
      BackbonePolymerAttach.call(c, e, 'edit.units');
      var m = c.add(new Backbone.Model({id: 'add1', type: 'test'}));
      expect(m.get('type')).to.equal('test');
      expect(adds).to.have.length(1);
    });

  });

});
