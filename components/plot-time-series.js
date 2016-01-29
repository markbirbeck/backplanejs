'use strict';

let ChartControl = require('./chart-control');
let TimeSeriesPlot = require('eh-charts').plotTimeSeries;

class PlotTimeSeries extends ChartControl {
  name() { return 'PlotTimeSeries'; }

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
    let timeSeries = new TimeSeriesPlot();

    timeSeries
      .setNormaliseXTimeFormat('%b %Y')
      .setNormaliseY(function(d) { return +d.price; });
    this.$chart = timeSeries;
  }
};

module.exports = PlotTimeSeries;
