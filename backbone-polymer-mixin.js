
// TODO both polymerNotify and the global name are misleading for a setup/initialize type of function


var BackbonePolymerNotify = function(element, pathPrefix) {
  console.log('BackbonePolymerNotify called', this, element, pathPrefix);

  var indexOf = this.indexOf.bind(this);

  var modelSetup = function(model) {
    this.listenTo(model, 'change', function(ev) {
      for (var attribute in ev.changed) {
        console.log('model', model.cid, 'changed', attribute);
        var ix = indexOf(model);
        var value = model.get(attribute);
        console.log('modify:', pathPrefix + '.models.' + ix + '.attributes.' + attribute, value);
        element.notifyPath(pathPrefix + '.models.' + ix + '.attributes.' + attribute, value);
      }
    });
  };

  var splicesObject = this.models;

  var addNotify = function(model) {
    var ix = indexOf(model);

    // https://www.polymer-project.org/1.0/docs/devguide/properties.html#array-observation
    var change = {keySplices:[], indexSplices:[]};
    change.keySplices.push({
      index: ix,
      removed: [],
      removedItems: [],
      added: [ix]
    });
    change.indexSplices.push({
      index: ix,
      addedCount: 1,
      removed: [],
      object: splicesObject,
      type: 'splice'
    });

    element.notifyPath(pathPrefix + '.models.splices', change);

    for (var attribute in model.attributes) {
      var value = model.get(attribute);
      console.log('add, initial value:', pathPrefix + '.models.' + ix + '.attributes.' + attribute, value);
      element.notifyPath(pathPrefix + '.models.' + ix + '.attributes.' + attribute, value);
    }
  };

  this.each(modelSetup.bind(this));
  this.on('add', addNotify.bind(this));
  this.on('add', modelSetup.bind(this));
};

if (typeof module !== 'undefined') {
  module.exports = {
    polymerNotify: BackbonePolymerNotify
  };
};
