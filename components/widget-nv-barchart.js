'use strict';
let d3 = require('d3');
let nv = require('nvd3');

let tidyData = (data /*, keyName, valueName */) => {
  console.log('In tidyData:', data);
  return [
    {
      key: 'blah blah',
      values: data
    }
  ];
}

let barChart = (node, data, keyName, valueName) => {
  console.log('About to draw a bar chart with:', data);
  nv.addGraph(function() {
    var chart = nv.models.discreteBarChart()
      .x(function(d) { return d[keyName] })    //Specify the data accessors.
      .y(function(d) { return d[valueName] })
      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
      // .tooltips(false)        //Don't show tooltips
      .showValues(true)       //...instead, show the bar value right on top of each bar.
      // .transitionDuration(350)
      ;

    d3.select(node)
      .datum(tidyData(data, keyName, valueName))
      .call(chart)
      ;

    nv.utils.windowResize(chart.update);

    return chart;
  });
}

let multiBarChart = (node, data, keyName, valueName) => {
  nv.addGraph(function() {
    var chart = nv.models.multiBarChart()
      // .transitionDuration(350)
      .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
      .rotateLabels(0)      //Angle to rotate x-axis labels.
      .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
      .groupSpacing(0.1)    //Distance between each group of bars.
    ;

    chart.xAxis
        .tickFormat(d3.format(',f'));

    chart.yAxis
        .tickFormat(d3.format(',.1f'));

    d3.select(node)
        .datum(tidyData(data, keyName, valueName))
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
}

(function() {
  let template = `
    <style>
      body {
          font: 14px sans-serif;
      }

      .arc path {
          stroke: #fff;
          stroke-width: 3px;
      }

      .node circle {
          fill: #fff;
          stroke: steelblue;
          stroke-width: 1.5px;
      }

      .node {
          font: 10px sans-serif;
      }

      .link {
          fill: none;
          stroke: #ccc;
          stroke-width: 1.5px;
      }

      #chart svg {
        height: 400px;
      }

      body {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        width: 960px;
        height: 500px;
        position: relative;
      }

      svg {
        width: 100%;
        height: 100%;
      }

      path.slice{
        stroke-width:2px;
      }

      polyline{
        opacity: .3;
        stroke: black;
        stroke-width: 2px;
        fill: none;
      }
    </style>

    <div class="container">
      <div id="chart">
        <svg></svg>
      </div>
    </div>
  `;
  class WidgetBarchart extends HTMLElement {
    name() { return 'WidgetBarchar'; }

        // Fires when an instance of the element is created.
        createdCallback() {
            this.createShadowRoot().innerHTML = template;

            //Grab the elements from the shadow root
            this.$container = this.shadowRoot.querySelector('.container');
            this.$chart = this.shadowRoot.querySelector('#chart svg');

            //Call the draw function initially
            this.refresh(0);
        };
        // Fires when an instance was inserted into the document.
        attachedCallback() {

        };
        // Fires when an attribute was added, removed, or updated.
        attributeChangedCallback(attrName, oldVal, newVal) {
        };
        refresh(value) {
          barChart(this.$chart, value, 'key', 'engagement');
        };
    }
    document.registerElement('widget-barchart', WidgetBarchart);
})();
