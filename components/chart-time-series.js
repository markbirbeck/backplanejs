'use strict';

let ChartControl = require('./chart-control');
let EHChart = require('./eh-chart');

let d3 = require('d3');

class TimeSeriesChart extends EHChart {
  constructor () {
    super();
    let self = this;

    function chart(selection) {
      console.log('In the function that gets selection');
      selection.each(function (data) {
        self.draw(this, data);
      });
    };

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };

    chart.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return chart;
    };

    return chart;
  }

  draw(node, data) {
    // Convert data to standard representation greedily;
    // this is needed for nondeterministic accessors.
    data = data.map(function(d, i) {
      return [xValue.call(data, d, i), yValue.call(data, d, i)];
    });

    // Update the x-scale.
    xScale
        .domain(d3.extent(data, function(d) { return d[0]; }))
        .range([0, width - margin.left - margin.right]);

    // Update the y-scale.
    yScale
        .domain([0, d3.max(data, function(d) { return d[1]; })])
        .range([height - margin.top - margin.bottom, 0]);

    // Select the svg element, if it exists.
    var svg = d3.select(node).selectAll('svg').data([data]);

    // Otherwise, create the skeletal chart.
    var gEnter = svg.enter().append('svg').append('g');
    gEnter.append('path').attr('class', 'area');
    gEnter.append('path').attr('class', 'line');
    gEnter.append('g').attr('class', 'x axis');

    // Update the outer dimensions.
    svg .attr('width', width)
        .attr('height', height);

    // Update the inner dimensions.
    var g = svg.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Update the area path.
    g.select('.area')
        .attr('d', area.y0(yScale.range()[0]));

    // Update the line path.
    g.select('.line')
        .attr('d', line);

    // Update the x-axis.
    g.select('.x.axis')
        .attr('transform', 'translate(0,' + yScale.range()[0] + ')')
        .call(xAxis);
  }

  // The x-accessor for the path generator; xScale ∘ xValue.
  static X(d) {
    return xScale(d[0]);
  }

  // The x-accessor for the path generator; yScale ∘ yValue.
  static Y(d) {
    return yScale(d[1]);
  }
}




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
    let chart = new TimeSeriesChart();

    console.log(chart);
    this.$chart = chart
      .x(function(d) { return formatDate.parse(d.date); })
      .y(function(d) { return +d.price; });

    console.log(this.$chart);
    var formatDate = d3.time.format('%b %Y');
  }

  refresh(value) {
    d3.select(this.$value)
      .datum(value)
      .call(this.$chart);
  };
};

var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 760,
    height = 120,
    xValue = function(d) { return d[0]; },
    yValue = function(d) { return d[1]; },
    xScale = d3.time.scale(),
    yScale = d3.scale.linear(),
    xAxis = d3.svg.axis().scale(xScale).orient('bottom').tickSize(6, 0),
    area = d3.svg.area().x(TimeSeriesChart.X).y1(TimeSeriesChart.Y),
    line = d3.svg.line().x(TimeSeriesChart.X).y(TimeSeriesChart.Y);

module.exports = ChartTimeSeries;
