'use strict';

/**
 * backplane-output
 *
 *  backplane output is a fundamental control that simply displays output
 *  that is passed in via the refresh() method:
 */

let template = `
  <div class='container'>
    <div class='value'></div>
  </div>
`;

class BackplaneOutput extends HTMLElement {
  createdCallback() {
    this.createShadowRoot().innerHTML = template;

    this.$container = this.shadowRoot.querySelector('.container');
    this.$value = this.shadowRoot.querySelector('.value');

    this.refresh('');
  };

  refresh(value) {
    this.$value.innerHTML = value;
  };
}

module.exports = BackplaneOutput;
