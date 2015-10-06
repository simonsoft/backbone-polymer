
var BackbonePolymerAttach = function(element, pathPrefix) {
  console.log('BackbonePolymerAttach', this, element, pathPrefix);

  var indexOf = this.indexOf.bind(this);

  var modelSetup = function(model) {
    this.listenTo(model, 'change', function(ev) {
      for (var attribute in ev.changed) {
        var ix = indexOf(model);
        var value = model.get(attribute);
        element.notifyPath(pathPrefix + '.models.' + ix + '.attributes.' + attribute, value);
      }
    });
  };

  this.each(modelSetup.bind(this));

  // override Backbone add
  var _add = this.add;
  var addOptions = {add: true, remove: false}; // from backbone source
  this.add = function(model, options) {
    if (_.isArray(model)) {
      throw new Error('backbone-polymer only accepts add of single model');
    }
    // we should probably operate on the Collection.set level to be more allowing
    if (!this._isModel(model)) {
      throw new Error('backbone-polymer requires model instances, not just attributes');
    }

    var options = _.extend({merge: false}, options, addOptions);
    var ix = options.at || 0;

    element.splice(pathPrefix + '.models', ix, 0, [model]);
    if (!options.silent) {
      this.trigger('add', model, this, options);
    }

    modelSetup.bind(model);
    return model;
  };
};

if (typeof module !== 'undefined') {
  module.exports = BackbonePolymerAttach;
};
