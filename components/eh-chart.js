'use strict';

let d3 = require('d3');

class EHChart {
  constructor(margin) {

    /**
     * Set some default values:
     */

    margin = margin || {top: 20, right: 20, bottom: 20, left: 20};
    this.margin = margin;
    this.width = 760;
    this.height = 120;
    this.x = function(d) { return d[0]; };
    this.y = function(d) { return d[1]; };
    this.xScale = d3.time.scale();
    this.yScale = d3.scale.linear();
    this.xAxis = d3.svg.axis().scale(this.xScale).orient('bottom').tickSize(6, 0);
    this.area = d3.svg.area().x(this.X.bind(this)).y1(this.Y.bind(this));
    this.line = d3.svg.line().x(this.X.bind(this)).y(this.Y.bind(this));
  };

  chart(selection) {
    let self = this;

    selection.each(function (data) {
      if (!Array.isArray(data)) {
        return;
      }

      /**
       * If there is a data tidying function then call it:
       */

      let tidyData = (self.tidyData) ? self.tidyData(data) : data;

      /**
       * Select the SVG element, if it exists:
       */

      var svg = d3
      .select(this)
      .selectAll('svg')
      .data([tidyData]);

      /**
       * Call the chart-specific draw function with the SVG element and the data:
       */

      self.draw(svg, tidyData);
    });
  };

  setX(x) {
    this.x = x;
    return this;
  };

  setY(y) {
    this.y = y;
    return this;
  };

  get x() { return this._x; }
  set x(x) { this._x = x; }

  get y() { return this._y; }
  set y(y) { this._y = y; }

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

  get area() { return this._area; }
  set area(area) { this._area = area; }

  get line() { return this._line; }
  set line(line) { this._line = line; }
};

module.exports = EHChart;
