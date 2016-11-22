'use strict';

/**
 * backplane-control
 *
 *  backplane control is a fundamental control that wires up a control:
 */

class BackplaneControl extends HTMLElement {
  createdCallback() {
    this.init(this.style() + this.markup());
    this.refresh('');
  };

  name() { return 'BackplaneControl'; }

  style() { return ''; }

  markup() { return ''; }

  postInit() { return; }

  init(template) {
    this.createShadowRoot().innerHTML = template;

    ['container', 'value']
    .forEach(name => {
      let node = this.shadowRoot.querySelector('.' + name);

      if (!node) {
        console.error(`An element with a class of '${name}' has not been defined in custom control '${this.name()}'`);
      } else {
        this['$' + name] = node;
      }
    });

    this.postInit();
  };
}

module.exports = BackplaneControl;
