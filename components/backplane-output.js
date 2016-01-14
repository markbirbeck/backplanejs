'use strict';

let BackplaneControl = require('./backplane-control');

/**
 * backplane-output
 *
 *  backplane output is a fundamental control that simply displays output
 *  that is passed in via the refresh() method:
 */

class BackplaneOutput extends BackplaneControl {
  name() { return 'BackplaneOutput'; }

  markup() {
    return `
      <div class='container'>
        <div class='value'></div>
      </div>
    `;
  }

  refresh(value) {
    this.$value.innerHTML = value;
  };
}

module.exports = BackplaneOutput;
