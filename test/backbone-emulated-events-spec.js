
var expect = require('chai').expect;

// still undecided on how the mixin gets dependencies
_ = require('yobo')._;

var Backbone = require('yobo').Backbone;

var BackbonePolymerAttach = require('../backbone-polymer-mixin');

var PolymerElementMock = function() {

  var spliced = this.spliced = [];

  this.splice = function(path, index, removeCount, items) {
    spliced.push({path: path, index: index, removeCount: removeCount, items: items});
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

    it("ATM accepts only a single item", function() {
      expect(function() {
        var c = new Backbone.Collection();
        BackbonePolymerAttach.call(c, new PolymerElementMock(), 'edit.units');
        c.add([]);
      }).to.throw(/single/);
    });

    it("ATM requires that item to be a real model", function() {
      expect(function() {
        var c = new Backbone.Collection();
        BackbonePolymerAttach.call(c, new PolymerElementMock(), 'edit.units');
        c.add({id: 'add1', type: 'test'});
      }).to.throw(/requires model instance/);
    });

    it("Is transparent to backbone add event listener", function() {
      var e = new PolymerElementMock();
      var c = new Backbone.Collection();
      var adds = [];

      c.on('add', function() { adds.push(arguments); });
      BackbonePolymerAttach.call(c, e, 'edit.units');
      var m = c.add(new Backbone.Model({id: 'add1', type: 'test'}));

      expect(m.get('type')).to.equal('test');
      expect(adds).to.have.length(1);
      expect(e.spliced).to.have.length(1);

      //Expects on the options obj.
      expect(adds[0][2]).to.be.an('object');
      expect(adds[0][2]).to.have.property('add').and.equal(true);
      expect(adds[0][2]).to.have.property('merge').and.equal(false);
      expect(adds[0][2]).to.have.property('remove').and.equal(false);

      var m1 = new Backbone.Model({id: 'add2', type: 'test'});
      c.add(m1, {at: 1});

      //Adding at an index, expects Options to have 'at'
      expect(adds[1][2]).to.have.property('add').and.equal(true);
      expect(adds[1][2]).to.have.property('at').and.equal(1);
      expect(e.spliced).to.have.length(2);

      //Adding again at index 2
      var m2 = new Backbone.Model({id: 'add3', type: 'test'});
      c.add(m2, {at: 2});
      
      expect(e.spliced[2]).to.have.property('index').and.equal(2);

    });

  });

});
