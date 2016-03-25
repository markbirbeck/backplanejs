'use strict';

let ChartControl = require('./chart-control');
let TimeSeriesChart = require('fotochrom').timeSeries;

class ChartTimeSeries extends ChartControl {
  name() { return 'ChartTimeSeries'; }

  style() {
    return `
      <style>
        svg {
          font: 10px sans-serif;
        }

        .axis path, .axis line {
          fill: none;
          stroke: #000;
          shape-rendering: crispEdges;
        }

        .line {
          fill: none;
          stroke: #000;
          stroke-width: 1.5px;
        }

        .area {
          fill: #969696;
        }

        .attention {
          background: yellow;
          margin: -4px;
          padding: 4px;
        }
      </style>
    `;
  };

  initChart() {
    let timeSeries = new TimeSeriesChart();
    // var formatDate = d3.time.format('%b %Y');

    timeSeries
      .setNormaliseXTimeFormat('%b %Y')
      .setNormaliseY(function(d) { return +d.price; });
    this.$chart = timeSeries;
  }
};

module.exports = ChartTimeSeries;
