'use strict';

let BackplaneControl = require('./backplane-control');

let tidyData = (data /*, keyName, valueName */) => {
  console.log('In tidyData:', data);
  return [
    {
      key: 'blah blah',
      values: data
    }
  ];
}

let chartBar = (node, data, keyName, valueName) => {
  if (!Array.isArray(data)) {
    return;
  }

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(10, '%');

var svg = d3.select(node).select('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  x.domain(data.map(function(d) { return d[keyName]; }));
  y.domain([0, d3.max(data, function(d) { return d[valueName]; })]);

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(valueName);

  svg.selectAll('.bar')
      .data(data)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) { return x(d[keyName]); })
      .attr('width', x.rangeBand())
      .attr('y', function(d) { return y(d[valueName]); })
      .attr('height', function(d) { return height - y(d[valueName]); });
}

class ChartBar extends BackplaneControl {
  name() { return 'ChartBar'; }

  style() {
    return `
      <style>
        .bar {
          fill: steelblue;
        }

        .bar:hover {
          fill: brown;
        }

        .axis {
          font: 10px sans-serif;
        }

        .axis path,
        .axis line {
          fill: none;
          stroke: #000;
          shape-rendering: crispEdges;
        }

        .x.axis path {
          display: none;
        }
      </style>
    `;
  }

  markup() {
    return `
      <div class='container'>
        <div class='value'>
          <svg></svg>
        </div>
      </div>
    `;
  }

  refresh(value) {
    chartBar(this.$value, value, 'key', 'engagement');
  };
};

module.exports = ChartBar;
