'use strict';

let EHChart = require('./eh-chart');

let d3 = require('d3');

class TimeSeriesChart extends EHChart {
  constructor(margin) {
    super(margin);
  };

  draw(node, data) {
    if (!Array.isArray(data)) {
      return;
    }

    let self = this;
    // Convert data to standard representation greedily;
    // this is needed for nondeterministic accessors.
    data = data.map(function(d, i) {
      return [self.x.call(data, d, i), self.y.call(data, d, i)];
    });

    // Update the x-scale.
    this.xScale
        .domain(d3.extent(data, function(d) { return d[0]; }))
        .range([0, this.width - this.margin.left - this.margin.right]);

    // Update the y-scale.
    this.yScale
        .domain([0, d3.max(data, function(d) { return d[1]; })])
        .range([this.height - this.margin.top - this.margin.bottom, 0]);

    // Select the svg element, if it exists.
    var svg = d3.select(node).selectAll('svg').data([data]);

    // Otherwise, create the skeletal chart.
    var gEnter = svg.enter().append('svg').append('g');
    gEnter.append('path').attr('class', 'area');
    gEnter.append('path').attr('class', 'line');
    gEnter.append('g').attr('class', 'x axis');

    // Update the outer dimensions.
    svg .attr('width', this.width)
        .attr('height', this.height);

    // Update the inner dimensions.
    var g = svg.select('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // Update the area path.
    g.select('.area')
        .attr('d', this.area.y0(this.yScale.range()[0]));

    // Update the line path.
    g.select('.line')
        .attr('d', this.line);

    // Update the x-axis.
    g.select('.x.axis')
        .attr('transform', 'translate(0,' + this.yScale.range()[0] + ')')
        .call(this.xAxis.bind(this));
  }
}

module.exports = TimeSeriesChart;
