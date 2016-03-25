'use strict';

let ChartControl = require('./chart-control');
let CohortChart = require('fotochrom').cohort;

class ChartCohort extends ChartControl {
  name() { return 'ChartCohort'; }

  style() {
    return `
      <style>
       rect.bordered {
          stroke: #E6E6E6;
          stroke-width:2px;
        }

        text.mono {
          font-size: 9pt;
          font-family: Consolas, courier;
          fill: black;
        }
      </style>
    `;
  };

  initChart() {
    let cohortChart = new CohortChart('cohort', 'month', 'value');

    this.$chart = cohortChart;
  }
};

module.exports = ChartCohort;

