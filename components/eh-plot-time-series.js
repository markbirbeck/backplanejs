'use strict';

let EHPlot = require('./eh-plot');

class TimeSeriesPlot extends EHPlot.AreaPlot {
  constructor(margin) {
    super(margin);
  };
}

module.exports = TimeSeriesPlot;
