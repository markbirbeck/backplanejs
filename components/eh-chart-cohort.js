'use strict';

let EHChart = require('./eh-chart');

let d3 = require('d3');

class CohortChart extends EHChart {
  constructor(key1Name, key2Name, valueName) {
    super({ top: 50, right: 0, bottom: 100, left: 30 });
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 430 - this.margin.top - this.margin.bottom;

    this.key1Name = key1Name;
    this.key2Name = key2Name;
    this.valueName = valueName;

    this.gridSize = Math.floor(this.width / 18);
    this.legendElementWidth = this.gridSize * 2;

    this.buckets = 9;
    this.colors = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58']; // alternatively colorbrewer.YlGnBu[9]
    this.cohorts = ['1', '2', '3', '4', '5'];
    this.measures = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'];
  };

  draw(node, data) {
    if (!Array.isArray(data)) {
      return;
    }

    let self = this;
    // Select the svg element, if it exists.
    var svg = d3.select(node).selectAll('svg').data([data]);

    // Otherwise, create the skeletal chart.
    var gEnter = svg.enter().append('svg').append('g');

    // Update the outer dimensions.
    svg
    .attr('width', self.width + self.margin.left + self.margin.right)
    .attr('height', self.height + self.margin.top + self.margin.bottom);

    // Update the inner dimensions.
    var g = svg.select('g')
        .attr('transform', 'translate(' + self.margin.left + ',' + self.margin.top + ')');

    g.selectAll('.measureLabel')
        .data(self.measures)
        .enter().append('text')
          .text(function(d) { return d; })
          .attr('x', function(d, i) { return i * self.gridSize; })
          .attr('y', 0)
          .style('text-anchor', 'middle')
          .attr('transform', 'translate(' + self.gridSize / 2 + ', -6)')
          .attr('class', 'measureLabel mono axis');

    g.selectAll('.cohortLabel')
        .data(self.cohorts)
        .enter().append('text')
          .text(function (d) { return d; })
          .attr('x', 0)
          .attr('y', function (d, i) { return i * self.gridSize; })
          .style('text-anchor', 'end')
          .attr('transform', 'translate(-6,' + self.gridSize / 1.5 + ')')
          .attr('class', 'cohortLabel mono axis');

    var colorScale = d3.scale.quantile()
        .domain([0, self.buckets - 1, d3.max(data, function (d) { return d[self.valueName]; })])
        .range(self.colors);

    var cards = g.selectAll('.hour')
        .data(data, function(d) {return d[self.key1Name]+':'+d[self.key2Name];});

    cards.append('title');

    cards.enter().append('rect')
        .attr('x', function(d) { return (d[self.key2Name] - 1) * self.gridSize; })
        .attr('y', function(d) { return (d[self.key1Name] - 1) * self.gridSize; })
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('class', 'hour bordered')
        .attr('width', self.gridSize)
        .attr('height', self.gridSize)
        .style('fill', self.colors[0]);

    cards.transition().duration(1000)
        .style('fill', function(d) { return colorScale(d[self.valueName]); });

    cards.select('title').text(function(d) { return d[self.valueName]; });

    cards.exit().remove();

    var legend = g.selectAll('.legend')
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

    legend.enter().append('g')
        .attr('class', 'legend');

    legend.append('rect')
      .attr('x', function(d, i) { return self.legendElementWidth * i; })
      .attr('y', self.height)
      .attr('width', self.legendElementWidth)
      .attr('height', self.gridSize / 2)
      .style('fill', function(d, i) { return self.colors[i]; });

    legend.append('text')
      .attr('class', 'mono')
      .text(function(d) { return '≥ ' + Math.round(d); })
      .attr('x', function(d, i) { return self.legendElementWidth * i; })
      .attr('y', self.height + self.gridSize);

    legend.exit().remove();
  }
}

module.exports = CohortChart;
