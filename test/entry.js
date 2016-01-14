'use strict';
var backplanejs = require('..'/*backplanejs*/);

require('webcomponents.js');
document.registerElement('backplane-output', backplanejs.backplaneOutput);

var refresh = (selectors, value) => {
  var nodeList = document.querySelectorAll(selectors);

  /**
   * Note that the following neater and more concise approach does not work,
   * even though documentation says it should:
   *
   *  for (var el of nodeList) {
   *    el.refresh(value);
   *  }
   *
   * And the following doesn't work, but it's not expected to:
   *
   *  nodeList.forEach(node => node.refresh(result));
   */

  for (var i = 0; i < nodeList.length; i++) {
    nodeList[i].refresh(value);
  }
}

let value = 0;

setInterval(() => {
  refresh('backplane-output', value++);
}, 10 * 1000);
