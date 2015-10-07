
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
    // our code still does this for attribute changes
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
      var m = new Backbone.Model({id: 'a1', type: 'testmodel'});
      c.on('add', function(model, collection, options) {
        console.log('add', m === model ? '(model)' : model, c === collection ? '(collection)' : collection, JSON.stringify(options));
      });
      m.on('add', function(model, collection, options) {
        console.log('model add', m === model ? '(model)' : model, c === collection ? '(collection)' : collection, JSON.stringify(options));
      });
      var added = c.add(m, {at: 1});
      console.log('add returned', m === added ? '(model)' : model);
      // common Backbone operations
      expect(c.get('a1')).to.exist.and.have.property('cid');
      expect(c.at(0)).to.exist.and.have.property('cid');
    });

  });

  describe("#add, reduced Backbone functionality", function() {

    it("Accepts only a single item", function() {
      expect(function() {
        var c = new Backbone.Collection();
        BackbonePolymerAttach.call(c, new PolymerElementMock(), 'edit.units');
        c.add([]);
      }).to.throw(/single/);
    });

    it("Requires item to be a real model", function() {
      expect(function() {
        var c = new Backbone.Collection();
        BackbonePolymerAttach.call(c, new PolymerElementMock(), 'edit.units');
        c.add({id: 'add1', type: 'test'});
      }).to.throw(/requires model instance/);
    });

    it("Bails out if the model already exists", function() {
      expect(function() {
        var c = new Backbone.Collection();
        BackbonePolymerAttach.call(c, new PolymerElementMock(), 'edit.units');
        var m = new Backbone.Model({id: 'add1', type: 'test'});
        c.add(m);
        c.add(m);
      }).to.throw(/backbone-polymer model already exists as cid \w+/);
    });

    it("Is transparent to backbone add event listener", function() {
      var e = new PolymerElementMock();
      var c = new Backbone.Collection();

      var adds = [];
      c.on('add', function(m, c, o) {
        adds.push({model:m, collection:c, options:o});
      });

      BackbonePolymerAttach.call(c, e, 'edit.units');
      var m = c.add(new Backbone.Model({id: 'add1', type: 'test'}));

      expect(m.get('type')).to.equal('test');
      expect(adds).to.have.length(1);
      expect(e.spliced).to.have.length(1);

      //Expects on the options obj.
      expect(adds[0].options).to.be.an('object');
      expect(adds[0].options).to.have.property('add').that.equals(true);
      expect(adds[0].options).to.have.property('merge').that.equals(false);
      expect(adds[0].options).to.have.property('remove').that.equals(false);
      expect(adds[0].options).to.not.have.property('at');
      expect(adds[0].collection).to.have.property('length').and.equal(1);

      var m1 = new Backbone.Model({id: 'add2', type: 'test'});
      modeladd = [];
      m1.on('add', function(m, c, o) {
        modeladd.push({model:m, collection:c, options:o});
      });
      c.add(m1, {at: 1});

      //Adding at an index, expects Options to have 'at'
      expect(adds[1].options).to.have.property('add').that.equals(true);
      expect(adds[1].options).to.have.property('at').that.equals(1);
      expect(adds[1].collection).to.have.length(2);
      expect(e.spliced).to.have.length(2);
      expect(modeladd).to.have.length(1);
      expect(modeladd[0]).to.deep.equal(adds[1]);

      //Adding again at index 1, i.e. insert
      var m2 = new Backbone.Model({id: 'add3', type: 'test'});
      c.add(m2, {at: 1});

      expect(e.spliced[2]).to.have.property('index').and.equal(1);
      expect(adds[0].collection).to.have.property('length').and.equal(3);

      // common Backbone operations
      expect(c.get('add1')).to.exist.and.have.property('cid');
      expect(c.at(1)).to.exist.and.have.property('cid');
    });
  });
});
