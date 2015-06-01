
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
        element.notifyPath(pathPrefix + '.models.' + ix + '.attributes.' + attribute, value);
      }
    });
  };

  var addNotify = function(model) {
    var ix = indexOf(model);
    console.log('add', model, ix);
    // Neither of the below makes any difference, and the model element seems to be rendered with an empty content attribute even without this notify
    element.notifyPath(pathPrefix + '.models.' + ix, model);
    for (var attribute in model.attributes) {
      var value = model.get(attribute);
      console.log('add attribute', attribute, value);
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
