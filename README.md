# backbone-polymer

Polymer elements have .set and array manipulation methods, but using those you can't really separate your logic from presentation. Backbone is pretty good for framework-agnostic logic, and its event mechanism provides the same type of notifications that Polymer needs to render dynamically.

So backbone-polymer aims to let Polymer templates, data binding and dom-repeat, use Collections of Models as properties.

## What it does

Registers event listeners on backbone and calls [notifyPath](https://www.polymer-project.org/1.0/docs/devguide/data-binding.html#set-path) on an element.

## How to use

We [require](https://nodejs.org/api/modules.html#modules_modules) the lib with [Webpack](http://webpack.github.io/) and do [yobo](https://github.com/Yolean/yobo) mixins, but any call with the Collection as `this` is fine.

```javascript
var c = new Backbone.Collection();
BackbonePolymerAttach.call(c, myPolymerElement, 'theCollectionPropertyName');
```

See the test folder for real examples.

## Limitations

 * Only collection's `.add` does notify, so for `.remove` you need to re-render your dom-repeat.
 * Can't `.add` immediately after attaching the collection to Polymer (your added items will render as empty), so add right before or asynchronously after.
 * Tests pass only in Chrome so other browsers [may](https://github.com/simonsoft/backbone-polymer/issues/2) be supported
