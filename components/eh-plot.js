'use strict';

/**
 * A Plot draws itself within whatever area it is given.
 */

let d3 = require('d3');

class Background {

};

// class Plot {
//   constructor() {
//     this.plotBackground = new Background();
//   };
// };

class Plot {
  constructor(/*title, subtitle, */margin) {
    // this.chartBackground = new Background();

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
      if (data === '' || data === {}) {
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

class AxisPlot extends Plot {
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
  }

  /**
   * Used by path generators:
   */

  X(d) { return this.xScale(d[0]); }
  Y(d) { return this.yScale(d[1]); }

  get xScale() { return this._xScale; }
  set xScale(xScale) { this._xScale = xScale; }

  get yScale() { return this._yScale; }
  set yScale(yScale) { this._yScale = yScale; }
};

class LinePlot extends AxisPlot {
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

class AreaPlot extends LinePlot {
  constructor() {
    super();

    this.area = d3.svg.area().x(this.X.bind(this)).y1(this.Y.bind(this));
  }

  draw(svg, data) {
    super.draw(svg, data);

    this.gEnter.append('path').attr('class', 'area');

    svg
    .select('g')
    .select('.area')
      .attr('d', this.area.y0(this.yScale.range()[0]));
  }
};

module.exports = {
  Plot,
  AxisPlot,
  LinePlot,
  AreaPlot
};
