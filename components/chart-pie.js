'use strict';

let ChartControl = require('./chart-control');
let PieChart = require('fotochrom').pie;

class ChartPie extends ChartControl {
  name() { return 'ChartPie'; }

  style() {
    return `
      <style>
      </style>
    `;
  };

  initChart() {
    let pieChart = new PieChart();

    this.$chart = pieChart;
  }
};

module.exports = ChartPie;

