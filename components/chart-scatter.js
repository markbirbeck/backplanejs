'use strict';

let ChartControl = require('./chart-control');
let ScatterChart = require('fotochrom').scatter;

class ChartScatter extends ChartControl {
  name() { return 'ChartScatter'; }

  style() {
    return `
      <style>
        .axis path, .axis line {
          fill: none;
          stroke: #000;
          shape-rendering: crispEdges;
        }

        .dot {
          stroke: #000;
        }
      </style>
    `;
  };

  initChart() {
    let headers = this.getAttribute('headers')
    .split(',')
    .map(s => s.trim())
    ;

    let factoryFunction = ScatterChart.bind.apply(ScatterChart, [null].concat(headers));
    let scatterChart = new factoryFunction();

    this.$chart = scatterChart;
  }
};

module.exports = ChartScatter;

