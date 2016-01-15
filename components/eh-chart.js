'use strict';

class EHChart {
  constructor(margin) {

    /**
     * Set some default values:
     */

    margin = margin || {top: 20, right: 20, bottom: 20, left: 20};
    this._margin = margin;
    this._width = 760;
    this._height = 120;
  };

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

module.exports = EHChart;
