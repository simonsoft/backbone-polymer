
var BackbonePolymerAttach = function(element, pathPrefix) {

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
      return _.map(model, this.add.bind(this));
    }
    if (!this._isModel(model)) {
      throw new Error('backbone-polymer requires model instances, not just attributes');
    }
    if (this.get(model)) {
      throw new Error('backbone-polymer model already exists as cid ' + this.get(model).cid);
    }

    var options = _.extend({merge: false}, options, addOptions);
    var ix = options.at || 0;

    element.splice(pathPrefix + '.models', ix, 0, model);
    this._addReference(model, options);
    this.length++;
    if (!options.silent) {
      model.trigger('add', model, this, options);
      this.trigger('update', this, options);
    }

    modelSetup.call(this, model);
    return model;
  };
};

if (typeof module !== 'undefined') {
  module.exports = BackbonePolymerAttach;
};
