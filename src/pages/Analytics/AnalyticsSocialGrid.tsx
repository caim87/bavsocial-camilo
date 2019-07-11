import * as React from 'react';
import * as Parse from 'parse';
import * as $ from 'jquery';
import { Chart } from '@antv/f2';

export interface IAnalyticsSocialGrid {
  analytics: any;
  brand1: Parse.Object;
  brand2: Parse.Object;
}

export default class AnalyticsSocialGrid extends React.Component <IAnalyticsSocialGrid> {
  public state = {
    socialEquityAVG1: undefined,
    socialEquityAVG2: undefined
  }

  public componentWillReceiveProps () {
    this.getSocialEquityAVG();
    this.onChartGenerator();
  }

  public getSocialEquityAVG = async () => {
    const { analytics } = this.props;

    if (analytics.analyticsBrand1.length > 1) {
      let socialEquityAVG1: number = 0;

      analytics.analyticsBrand1.forEach((analytic: Parse.Object) => {
        socialEquityAVG1 += analytic.get('data').Social_Equity;
      });

      socialEquityAVG1 = parseFloat((socialEquityAVG1/analytics.analyticsBrand1.length).toFixed(2));

      await this.setState({ socialEquityAVG1 });
    } else {
      await this.setState({ socialEquityAVG1: undefined });
    }

    if (analytics.analyticsBrand2.length > 1) {
      let socialEquityAVG2: number = 0;

      analytics.analyticsBrand2.forEach((analytic: Parse.Object) => {
        socialEquityAVG2 += parseFloat(analytic.get('data').Social_Equity);
      });

      socialEquityAVG2 = parseFloat((socialEquityAVG2/analytics.analyticsBrand2.length).toFixed(2));

      await this.setState({ socialEquityAVG2 });
    } else {
      await this.setState({ socialEquityAVG2: undefined });
    }
  }

  public onChartGenerator = async () => {
    const { analytics, brand1, brand2 } = this.props;
    let data;

    if ($('#chart-realtime-longterm')) {
      $('#chart-realtime-longterm').remove();
    }

    $('<canvas id="chart-realtime-longterm" width="300px" height="300px"/>').insertBefore('#chart-realtime-longterm-tooltip-container');

    if (brand1.get('name') && !brand2.get('name') && analytics.analyticsBrand1.length > 1) {
      data = await this.getProcessedData(1);
    } else if (brand1.get('name') && brand2.get('name')
    && analytics.analyticsBrand1.length > 1 && analytics.analyticsBrand2.length > 1) {
      data = await this.getProcessedData(2);
    }

    const chart = new Chart({
      id: 'chart-realtime-longterm',
      pixelRatio: window.devicePixelRatio
    });

    const defs = {
      x: {
        ticks: [0, 25, 50, 75, 100],
        alias: 'BAV'
      },
      y: {
        ticks: [0, 25, 50, 75, 100],
        alias: 'S-EQ'
      }
    };

    chart.axis('x', {
      grid: {
        lineDash: null
      },
    });
    chart.axis('y', {
      grid: {
        lineDash: null
      }
    });

    chart.source(data, defs);
    chart.tooltip(false);
    chart.guide().line({ start: ['min', 0], end: ['max', 100],
      style: { lineDash: [1,5], stroke: '#2D2D2D', lineWidth: 1, lineCap: 'round' }
    });
    chart.guide().line({  start: ['min', 50], end: ['max', 50],
      style: { stroke: 'l(0) 0.5:#00CEFA 0.5:#5D5E5E', lineWidth: 1, lineCap: 'round' }
    });
    chart.guide().line({ start: [50, 0], end: [50, 100],
      style: { stroke: 'l(90) 0.5:#00CEFA 0.5:#5D5E5E', lineWidth: 1, lineCap: 'round' }
    });

    chart.guide().rect({ start: [0, 0], end: [100, 100],
      style: { fillOpacity: 0.1, fill: 'l(49.5) 0.5:#00CEFA 0.5:#5D5E5E',
        lineWidth: 1, stroke: '#ccc'
      }
    });
    chart.guide().rect({ start: [50, 50], end: [100, 100],
      style: { fillOpacity: 0.15, fill: 'l(49.5) 0.5:#FFFFFF 0.5:#5D5E5E',
        lineWidth: 1, stroke: '#ccc'
      }
    });
    chart.guide().rect({ start: [0, 50], end: [50, 100],
      style: { fillOpacity: 0.15, fill: '#00CEFA', lineWidth: 1, stroke: '#ccc' }
    });
    chart.guide().rect({ start: [50, 0], end: [100, 50],
      style: { fillOpacity: 0.15, fill: '#5D5E5E', lineWidth: 1, stroke: '#ccc' }
    });

    chart.point().position('x*y').color('type', ['#3E40EA','#FFAD10']).shape('smooth');
    chart.render();
  }

  public getProcessedData = (brandsNumber: number) => {
    const { analytics, brand1 } = this.props;

    const data = [] as any;

    for (const analytic of analytics.analyticsBrand1) {
      
      data.push({ 
        type: brand1.get('alias'),
        x: brand1.get('pillars')[0].Brand_Asset_R,
        y: analytic.get('data').Social_Equity
      });
    };
    
    if (brandsNumber === 2) {
      const { brand2 } = this.props;

      for (const analytic of analytics.analyticsBrand2) {
      
        data.push({ 
          type: brand2.get('alias'),
          x: brand2.get('pillars')[0].Brand_Asset_R,
          y: analytic.get('data').Social_Equity
        });
      };
    }
    return data;
  }

  public render () {
    const { brand1, brand2 } = this.props;
    const { socialEquityAVG1, socialEquityAVG2 } = this.state;

    return (
      <div className="text-center info-text">
         <div className="bg-white shadow analytic-container mt-3 mb-3">
          <div className="chart-realtime-longterm-wrapper">
            <div id="chart-realtime-longterm-tooltip-container">{}</div>
          </div>
          <div >
            {(socialEquityAVG1  && brand1.get('name')) &&
            <div className="d-inline-block pr-2">
              <div
                className="d-inline-block round-container-bavprimary p-2 mr-2">
                {socialEquityAVG1}</div>
              <div 
                className="d-inline-block round-container-bavtertiary p-2">
                {(brand1.get('pillars')[0].Brand_Asset_R).toFixed(2)}</div>
            </div>
            }
            {(socialEquityAVG2 && brand2.get('name')) &&
            <div className="d-inline-block pl-2">
              <div
                className="d-inline-block round-container-bavsecundary p-2 mr-2">
                {socialEquityAVG2}</div>
              <div
                className="d-inline-block round-container-bavquaternary p-2">
                {(brand2.get('pillars')[0].Brand_Asset_R).toFixed(2)}</div>
            </div>
            }
          </div>
         </div>
         <div className="bg-white shadow analytic-container mt-3 mb-3">
          {(socialEquityAVG1  && brand1.get('name')) &&
          <div className="d-inline-block pr-5">
            <div className="mb-2">{brand1.get('alias')}</div>
            <div className="mb-2">
              <div className="title-circle bg-bavquaternary d-inline-block mr-1">{}</div>
              S-EQ</div>
            <div>
            <div className="title-circle bg-bavquinary d-inline-block mr-1">{}</div>            
            BAV</div>
          </div>
          }
          {(socialEquityAVG2 && brand2.get('name')) &&
          <div className="d-inline-block pl-5" style={{ borderLeft: '1px solid #C6C6C6' }}>
            <div className="mb-2">{brand2.get('alias')}</div>
            <div className="mb-2">
              <div className="title-circle bg-bavtertiary d-inline-block mr-1">{}</div>
              S-EQ</div>
            <div>
            <div className="title-circle bg-bavseptenary d-inline-block mr-1">{}</div>            
            BAV</div>
          </div>
          }
         </div>
      </div>
    );
  }
}

// style={{ borderLeft: '1px solid #C6C6C6' }}