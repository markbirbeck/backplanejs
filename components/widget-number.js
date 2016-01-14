'use strict';

let BackplaneControl = require('./backplane-control');


class WidgetNumber extends BackplaneControl {
  name() { return 'WidgetNumber'; }

  style() {
    return `
      <style>
        .container {
          width: auto;
          display: inline-block;
        }

        .widget {
          background-color: #2a2a2a;
          width: auto;
          font: 14px/1 "aktiv-grotesk-std", Arial, sans-serif, FontAwesome;
        }

        .widget-inner {
          background-color: #2a2a2a;
        }

        .widget-size-1-x-1 {
          width: 230px;
          height: 230px;
        }

        header {
          background-color: #4d4f50;
          padding: 11px 22px 11px 13px;
          font-weight: 400;
          font-size: 12px;
          margin-bottom: 0;
        }

        header h1 {
          color: #c2c9cb;
          font-size: 13px;
          font-weight: 400;
          margin-bottom: 0;
          line-height: 17px;
        }

        .single-number {
          display: flex;
          flex: 1.5;
        }

        .number-widget {
          top: 56px;
          color: #eee;
          display: flex;
          flex-direction: column;
        }

        .spark-line-stat {
          padding: 0 16px;
          height: 30%;
        }

        .number-widget-secondary-stat {
          flex: 1;
        }

        .spark-line {
          min-height: 50px;
        }

        footer {
          opacity: 0;
          overflow: hidden;
          background-color: #1f1f1f;
          color: #c2c9cb;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 36px;
          z-index: 2;
          transition: opacity .11s ease-in;
        }
      </style>
    `;
  };

  markup() {
    return `
      <div class="container">
        <article class="widget">
          <div class="widget-inner widget-size-1-x-1">
            <header>
              <h1>
                <content select="header"></content>
              </h1>
            </header>
            <div class="number-widget" style="font-size: 60px;">
              <div class="single-number">
                <xforms-output class="value"></xforms-output>
              </div>
              <div class="number-widget-secondary-stat spark-line-stat">
                <div class="spark-line" style="width: 100%; height: 100%;">
                </div>
              </div>
            </div>
            <div class="widget-footer">
              <footer>I'm a footer</footer>
            </div>
          </div>
        </article>
      </div>
    `;
  };

  refresh(data) {
    this.$value.refresh(data.value);
    if (data.text && this.$text) {
      this.$text.refresh(data.text);
    }
  };
}

module.exports = WidgetNumber;
