

var BackbonePolymerNotify = function(element, pathPrefix) {
  console.log('BackbonePolymerNotify called', this, element, pathPrefix);
};

if (typeof module !== 'undefined') {
  module.exports = {
    polymerNotify: BackbonePolymerNotify
  };
};
