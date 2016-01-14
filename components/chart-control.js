'use strict';

let BackplaneControl = require('./backplane-control');

class ChartControl extends BackplaneControl {
  name() { return 'ChartControl'; }

  postInit() {
    this.initChart();
  };

  markup() {
    return `
      <div class='container'>
        <div class='value'></div>
      </div>
    `;
  }
}

module.exports = ChartControl;