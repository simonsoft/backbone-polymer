
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

    // remove this timeout and the rendered element goes blank
    window.setTimeout(function() {
      // TODO would it be possible to notify .* here?
      for (var attribute in model.attributes) {
        // we could reuse code with modelSetup here
        var value = model.get(attribute);
        element.notifyPath(pathPrefix + '.models.' + ix + '.attributes.' + attribute, value);
      }
    }, 1);
  };

  this.each(modelSetup.bind(this));
  this.on('add', addNotify.bind(this));
  this.on('add', modelSetup.bind(this));
};

if (typeof module !== 'undefined') {
  module.exports = BackbonePolymerAttach;
};
