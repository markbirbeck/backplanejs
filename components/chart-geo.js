'use strict';

let ChartControl = require('./chart-control');
let GeoChart = require('eh-charts').geo;

class ChartGeo extends ChartControl {
  name() { return 'ChartGeo'; }

  style() {
    return `
      <style>
        .country.CAF { fill: #dcd; }
        .country.GBR { fill: orange; }
        .place { fill: red; }
      </style>
    `;
  };

  initChart() {
    this.$chart = new GeoChart();
  }
};

module.exports = ChartGeo;

