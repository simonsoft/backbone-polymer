
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
  this.on('add', modelSetup.bind(this));
};

if (typeof module !== 'undefined') {
  module.exports = BackbonePolymerAttach;
};
