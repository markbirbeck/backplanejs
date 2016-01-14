'use strict';

let BackplaneControl = require('./backplane-control');

let d3 = require('d3');

var chartCohort = function(key1Name, key2Name, valueName) {
  var margin = { top: 50, right: 0, bottom: 100, left: 30 },
      width = 960 - margin.left - margin.right,
      height = 430 - margin.top - margin.bottom,
      gridSize = Math.floor(width / 18),
      legendElementWidth = gridSize*2,
      buckets = 9,
      colors = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58'], // alternatively colorbrewer.YlGnBu[9]
      cohorts = ['1', '2', '3', '4', '5'],
      measures = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'];

  var svg;

  var _chartCohort = function(node, data/* , i*/) {
    svg = svg || d3.select(node)
        .select('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.selectAll('.measureLabel')
        .data(measures)
        .enter().append('text')
          .text(function(d) { return d; })
          .attr('x', function(d, i) { return i * gridSize; })
          .attr('y', 0)
          .style('text-anchor', 'middle')
          .attr('transform', 'translate(' + gridSize / 2 + ', -6)')
          .attr('class', 'measureLabel mono axis');

    svg.selectAll('.cohortLabel')
        .data(cohorts)
        .enter().append('text')
          .text(function (d) { return d; })
          .attr('x', 0)
          .attr('y', function (d, i) { return i * gridSize; })
          .style('text-anchor', 'end')
          .attr('transform', 'translate(-6,' + gridSize / 1.5 + ')')
          .attr('class', 'cohortLabel mono axis');

    var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return d[valueName]; })])
        .range(colors);

    var cards = svg.selectAll('.hour')
        .data(data, function(d) {return d[key1Name]+':'+d[key2Name];});

    cards.append('title');

    cards.enter().append('rect')
        .attr('x', function(d) { return (d[key2Name] - 1) * gridSize; })
        .attr('y', function(d) { return (d[key1Name] - 1) * gridSize; })
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('class', 'hour bordered')
        .attr('width', gridSize)
        .attr('height', gridSize)
        .style('fill', colors[0]);

    cards.transition().duration(1000)
        .style('fill', function(d) { return colorScale(d[valueName]); });

    cards.select('title').text(function(d) { return d[valueName]; });

    cards.exit().remove();

    var legend = svg.selectAll('.legend')
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

    legend.enter().append('g')
        .attr('class', 'legend');

    legend.append('rect')
      .attr('x', function(d, i) { return legendElementWidth * i; })
      .attr('y', height)
      .attr('width', legendElementWidth)
      .attr('height', gridSize / 2)
      .style('fill', function(d, i) { return colors[i]; });

    legend.append('text')
      .attr('class', 'mono')
      .text(function(d) { return '≥ ' + Math.round(d); })
      .attr('x', function(d, i) { return legendElementWidth * i; })
      .attr('y', height + gridSize);

    legend.exit().remove();
  };

  return selection => {
    selection.each(function(data, i) {
      _chartCohort(this, data, i);
    });
  }
};

var chart;

class ChartCohort extends BackplaneControl {
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
          fill: #aaa;
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
    chart = chart || chartCohort('cohort', 'month', 'value');

    d3.select(this.$value)
    .datum(value)
    .call(chart);
  };
};

module.exports = ChartCohort;
