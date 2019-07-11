import * as React from 'react';
import * as Parse from 'parse';
import * as moment from 'moment';
import * as $ from 'jquery';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import ComponentSlider from "@kapost/react-component-slider";
import { Chart } from '@antv/f2';

export interface IAnalyticBAVSocialVSTime {
  analytics: any;
  brand1: Parse.Object;
  brand2: Parse.Object;
}

export default class AnalyticBAVSocialVSTime extends React.Component <IAnalyticBAVSocialVSTime> {
  public state = {
    type: 'Social_Equity'
  }

  public componentWillReceiveProps () {
    this.onChartGenerator();
  }

  public onChartGenerator = async () => {
    const { type } = this.state;
    const { analytics, brand1, brand2 } = this.props;
    let data;
    
    if ($('#chart-bavsocial-time')) {
      $('#chart-bavsocial-time').remove();
    }
    if ($('#chart-bavsocial-time-tooltip1')) {
      $('#chart-bavsocial-time-tooltip1').remove()
    }
    if ($('#chart-bavsocial-time-tooltip2')) {
      $('#chart-bavsocial-time-tooltip2').remove()
    }
    if ($('#chart-bavsocial-time-tooltip3')) {
      $('#chart-bavsocial-time-tooltip3').remove()
    }

    $('<canvas id="chart-bavsocial-time" className="w-100" height="200px"/>').insertBefore('#chart-bavsocial-time-tooltip-container');
    $('#chart-bavsocial-time-tooltip-container').append('<div id="chart-bavsocial-time-tooltip1" class="d-inline-block mr-2"></div>');
    $('#chart-bavsocial-time-tooltip-container').append('<div id="chart-bavsocial-time-tooltip2" class="d-inline-block"></div>');
    $('<div id="chart-bavsocial-time-tooltip3"></div>').insertBefore('#chart-bavsocial-time');

    if (brand1.get('name') && !brand2.get('name') && analytics.analyticsBrand1.length > 1) {
      data = await this.getProcessedData(1, type);
    } else if (brand1.get('name') && brand2.get('name')
    && analytics.analyticsBrand1.length > 1 && analytics.analyticsBrand2.length > 1) {
      data = await this.getProcessedData(2, type);
    }

    const chart = new Chart({
      id: 'chart-bavsocial-time',
      pixelRatio: window.devicePixelRatio
    });

    const defs = {
      date: {
        tickCount: 3
      },
      value: {
        tickCount: 2,
        min: 0
      }
    };

    chart.axis('date', {
      grid: {
        lineDash: null,
        stroke: 'rgb(244, 244, 244, 0.1)',
        lineWidth: 1
      }
    });
    chart.axis('value', {
      grid: {
        lineDash: null,
        stroke: 'rgb(244, 244, 244, 0.1)',
        lineWidth: 1
      }
    });

    chart.source(data, defs);
    chart.tooltip({
      custom: true,
      onChange: this.onChangeTooltip(),
      showCrosshairs: true,
      crosshairsStyle: {
        stroke: '#C6C6C6'
      },
      tooltipMarkerStyle: {
        lineWidth: 2,
        lineCap: 'round'
      }
    });

    chart.point().position('date*value').color('type', ['#00ccfa','#ffab10']).shape('smooth');
    chart.line().position('date*value').color('type', ['#00ccfa','#ffab10']).shape('smooth');
    chart.render();
  }

  public onChangeTooltip = () => (event: any) => {
    if (event.items[0]) {
      const tooltipElement = $('#chart-bavsocial-time-tooltip1');
      tooltipElement.html(`<p class="p-2 bg-white text-bavprimary round-container-bavprimary">
        ${parseFloat(event.items[0].value).toFixed(2)}</p>`);
      
      const tooltipDate = $('#chart-bavsocial-time-tooltip3');
      tooltipDate.html(`<p>${event.items[0].title}</p>`);
    }

    if (event.items[1]) {
      const tooltipElement = $('#chart-bavsocial-time-tooltip2');
      tooltipElement.html(`<p class="p-2 bg-white text-bavsecundary round-container-bavsecundary">
        ${parseFloat(event.items[1].value).toFixed(2)}</p>`);
    }
  }

  public getProcessedData = (brandsNumber: number, type: string) => {
    const { analytics, brand1 } = this.props;

    const data = [] as any;
    for (const analytic of analytics.analyticsBrand1) {
      
      data.push({ 
        type: brand1.get('alias'),
        date: moment(analytic.get('date')).utc().format('DD-MM-YYYY'),
        value: analytic.get('data')[type]
      });
    };
    
    if (brandsNumber === 2) {
      const { brand2 } = this.props;

      for (const analytic of analytics.analyticsBrand2) {
      
        data.push({ 
          type: brand2.get('alias'),
          date: moment(analytic.get('date')).utc().format('DD-MM-YYYY'),
          value: analytic.get('data')[type]
        });
      };
    }
    return data;
  }

  public render () {
    return (
      <div>
        <div className="text-center">
          <ComponentSlider
            renderLeftArrow={() => <div className="bg-arrow-left"><MdChevronLeft /></div>}
            renderRightArrow={() => <div className="bg-arrow-right"><MdChevronRight /></div>}>
            {/* <button className="btn-bavsocial bg-vitality">Vitalidad</button>
            <button className="btn-bavsocial">Involucramiento</button>
            <button className="btn-bavsocial">Ánimo</button>
            <button className="btn-bavsocial">Prominencia</button> */}
            <button className="btn-bavsocial bg-bavsecundary">Social Equity</button>
          </ComponentSlider>
        </div>
        <div className="mt-3 mb-3 text-center">
          <div className="chart-bavsocial-time-wrapper">
            <div id="chart-bavsocial-time-tooltip-container">{}</div>
          </div>
        </div>
      </div>
    );
  }
}