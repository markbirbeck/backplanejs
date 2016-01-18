'use strict';

let d3 = require('d3');

class Chart {
  constructor(/*title, subtitle, */margin) {
    // this.plot = new Plot();
    // this.legend = new Legend();

    // this.chartBackground = new Background();

    // this.title = title;
    // this.subtitle = subtitle;

    /**
     * Set some default values:
     */

    margin = margin || {top: 20, right: 20, bottom: 20, left: 20};
    this.margin = margin;
    this.width = 760;
    this.height = 120;
    this.normaliseX = function(d) { return d[0]; };
    this.normaliseY = function(d) { return d[1]; };
  };

  draw(svg, data) {
    this.gEnter = svg.enter().append('svg').append('g');

    // Update the outer dimensions.
    svg
    .attr('width', this.width)
    .attr('height', this.height);

    // Update the inner dimensions.
    svg.select('g')
    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  };

  convertData(data) {
    // Convert data to standard representation greedily;
    // this is needed for nondeterministic accessors.
    return data.map((d, i) => [this.normaliseX(d, i), this.normaliseY(d, i)]);
  };

  chart(selection) {
    let self = this;

    selection.each(function (data) {
      if (!Array.isArray(data)) {
        return;
      }

      /**
       * Provide an opportunity to convert the data, if necessary:
       */

      let convertedData = self.convertData(data);

      /**
       * Select the SVG element, if it exists:
       */

      var svg = d3
      .select(this)
      .selectAll('svg')
      .data([convertedData]);

      /**
       * Call the chart-specific draw function with the SVG element and the data:
       */

      self.draw(svg, convertedData);
    });
  };

  setNormaliseX(xFn) {
    this.normaliseX = xFn;
    return this;
  };

  setNormaliseY(yFn) {
    this.normaliseY = yFn;
    return this;
  };

  get normaliseX() { return this._normaliseX; }
  set normaliseX(xFn) { this._normaliseX = xFn; }

  get normaliseY() { return this._normaliseY; }
  set normaliseY(yFn) { this._normaliseY = yFn; }

  get margin() { return this._margin; }
  set margin(m) {
    this._margin = m;
    return this;
  }

  get height() { return this._height; }
  set height(m) {
    this._height = m;
    return this;
  }

  get width() { return this._width; }
  set width(m) {
    this._width = m;
    return this;
  }
};

class Background {

};

class Plot {
  constructor() {
    this.plotBackground = new Background();
  };
};

class LegendItem {
  constructor() {
    this.legendItem = [];
  };
};

class Legend {
  constructor() {
    this.legendItem = [];
  };
};

class NonAxisChart extends Chart {
  constructor() {
    this.sectionLabel = [];
    this.exploded = [];
  }
};

class MajorTick {
  constructor(label) {
    this.label = label;
  }
};

class MinorTick {

};

class Axis {
  constructor(/*title, */scale, orientation, tickSize) {
    // this.title = title;

    return d3.svg.axis()
    .scale(scale)
    .orient(orientation)
    .tickSize(tickSize[0], tickSize[1]);
  };
};

class RangeAxis extends Axis {

};

class DomainAxis extends Axis {

};

class AxisChart extends Chart {
  constructor() {
    super();

    /**
     * Default to linear axis for x and y:
     */

    this.xScale = d3.scale.linear();
    this.yScale = d3.scale.linear();

    // this.domainAxis = new DomainAxis();
    // this.rangeAxis = new RangeAxis();
    this.origin = [0, 0];
  }

  draw(svg, data) {
    super.draw(svg, data);
    let self = this;

    // Update the x-scale.
    this.xScale
        .domain(d3.extent(data, function(d) { return d[0]; }))
        .range([0, this.width - this.margin.left - this.margin.right]);

    // Update the y-scale.
    this.yScale
        .domain([0, d3.max(data, function(d) { return d[1]; })])
        .range([this.height - this.margin.top - this.margin.bottom, 0]);

    this.setDomainAxis(this.gEnter);

    // Update the inner dimensions.
    var g = svg.select('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.refreshDomainAxis(g);
  }

  setDomainAxis(node) {
    node.append('g')
    .attr('class', 'domain-axis');
  };

  refreshDomainAxis(node) {
    let xAxis = new Axis(this.xScale, 'bottom', [6, 0]);

    // Update the domain-axis.
    node.select('.domain-axis')
    .attr('transform', 'translate(0,' + this.yScale.range()[0] + ')')
    .call(xAxis.bind(this));
  };

  /**
   * Used by path generators:
   */

  X(d) { return this.xScale(d[0]); }
  Y(d) { return this.yScale(d[1]); }

  get xScale() { return this._xScale; }
  set xScale(xScale) { this._xScale = xScale; }

  get yScale() { return this._yScale; }
  set yScale(yScale) { this._yScale = yScale; }

  get xAxis() { return this._xAxis; }
  set xAxis(xAxis) { this._xAxis = xAxis; }
};

class LineChart extends AxisChart {
  constructor() {
    super();

    this.line = d3.svg.line().x(this.X.bind(this)).y(this.Y.bind(this));
  }

  draw(svg, data) {
    super.draw(svg, data);

    this.gEnter.append('path').attr('class', 'line');

    // Update the line path.
    svg
    .select('g')
    .select('.line')
      .attr('d', this.line);
  }
};

class AreaChart extends LineChart {
  constructor() {
    super();

    this.area = d3.svg.area().x(this.X.bind(this)).y1(this.Y.bind(this));
  }

  draw(svg, data) {
    super.draw(svg, data);

    // var gEnter = svg.enter().append('svg').append('g');
    this.gEnter.append('path').attr('class', 'area');

    // Update the area path.
    svg
    .select('g')
    .select('.area')
      .attr('d', this.area.y0(this.yScale.range()[0]));
  }
};

module.exports = {
  Chart,
  AxisChart,
  LineChart,
  AreaChart
};
