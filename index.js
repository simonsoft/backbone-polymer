
var yobo = require('yobo');

var backbonePolymerMixin = require('backbone-polymer-mixin');

module.exports = {
  mixin: backbonePolymerMixin,
  Backbone: yobo.Backbone,
  Collection: yobo.Collection.extend({}).mixin(backbonePolymerMixin)
};
