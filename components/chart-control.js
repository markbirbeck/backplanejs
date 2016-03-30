'use strict';

let BackplaneControl = require('./backplane-control');

class ChartControl extends BackplaneControl {
  name() { return 'ChartControl'; }

  postInit() {
    this.initChart();
  };

  markup() {
    return `
      <style>
        :host {
          display: inline-block;
        }
        :host .container,
        :host .value {
          height: 100%;
          width: 100%;
        }
        svg {
          font: 10px sans-serif;
        }
      </style>
      <span class='container'>
        <span class='value'></span>
      </span>
    `;
  }

  refresh(value) {
    this.$chart.refresh(this.$value, value);
  };
}

module.exports = ChartControl;
