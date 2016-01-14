'use strict';

let BackplaneControl = require('./backplane-control');

/**
 * xforms-output
 */

class XformsOutput extends BackplaneControl {
  name() { return 'XformsOutput'; }

  markup() {
    return `
      <div class='container'>
        <backplane-output class='value'></backplane-output>
      </div>
    `;
  }

  refresh(value) {
    this.$value.refresh(value);
  };
}

module.exports = XformsOutput;
