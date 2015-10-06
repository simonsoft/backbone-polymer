
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

  var _add = this.add;
  this.add = function(models, options) {
    if (typeof models.length !== 'undefined') {
      throw new Error('backbone-polymer only accepts add of single model');
    }
    // we should probably operate on the Collection.set level to be more allowing
    if (!this._isModel(models)) {
      throw new Error('backbone-polymer requires model instances, not just attributes');
    }

    modelSetup.bind(models);
  };
};

if (typeof module !== 'undefined') {
  module.exports = BackbonePolymerAttach;
};
