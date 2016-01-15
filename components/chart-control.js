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

  refresh(value) {
    d3.select(this.$value)
      .datum(value)
      .call(this.$chart.chart.bind(this.$chart));
  };
}

module.exports = ChartControl;
