import * as React from 'react';
import * as Parse from 'parse';
import * as moment from 'moment';
import * as $ from 'jquery';
import { Chart } from '@antv/f2';

export interface IAnalyticsSocialEquityEvolution {
  analytics: any;
  brand1: Parse.Object;
  brand2: Parse.Object;
}

export default class AnalyticsSocialEquityEvolution extends React.Component <IAnalyticsSocialEquityEvolution> {
  public state = {
    socialEquity1: undefined,
    socialEquity2: undefined
  }

  public componentWillReceiveProps () {
    this.onChartGenerator({ preventDefault: () => {/**/} });
  }

  public onChartGenerator = async (event: any) => {
    event.preventDefault();
    const { brand1, brand2 } = this.props;
    let data;
    let brandAssetY1;
    let brandAssetY2;
    
    if ($('#chart-bavsocial-bav-time')) {
      $('#chart-bavsocial-bav-time').remove();
    }
    if ($('#chart-bavsocial-bav-time-tooltip')) {
      $('#chart-bavsocial-bav-time-tooltip').remove()
    }

    $('<canvas id="chart-bavsocial-bav-time" className="w-100" height="200px"/>').insertBefore('#chart-bavsocial-bav-time-tooltip-container');
    $('<div id="chart-bavsocial-bav-time-tooltip"></div>').insertBefore('#chart-bavsocial-bav-time');

    data = await this.getProcessedData();
    
    if (brand1.get('name')) {
      brandAssetY1 = parseFloat(brand1.get('pillars')[0].Brand_Asset_R.toFixed(2));
    }
    if (brand2.get('name')) {
      brandAssetY2 = parseFloat(brand2.get('pillars')[0].Brand_Asset_R.toFixed(2));
    }

    const chart = new Chart({
      id: 'chart-bavsocial-bav-time',
      pixelRatio: window.devicePixelRatio
    });

    const defs = {
      value: {
        tickCount: 5,
        min: 0
      }
    };
    chart.axis('date', false);

    chart.source(data, defs);
    chart.tooltip({
      custom: true,
      onChange: this.onChangeTooltip
    });

    chart.guide().line({ start: ['min', brandAssetY1], end: ['max', brandAssetY1],
      style: { stroke: 'l(0) 0:#00CCFA 1:#3E41EA', lineWidth: 1, lineCap: 'round' }
    });
    chart.guide().line({ start: ['min', brandAssetY2], end: ['max', brandAssetY2],
      style: { stroke: 'l(0) 0:#FFAB10 1:#FF543D', lineWidth: 1, lineCap: 'round' }
    });

    chart.legend(false);

    chart.line().position('date*value').color('type', ['l(0) 0:#00CCFA 1:#0090AD','l(0) 0:#FFDD9F 1:#FFAB10']).shape('smooth');
    chart.render();
  }

  public onChangeTooltip = (event: any) => {
    let socialEquity1 = '0.0';
    let socialEquity2 = '0.0';

    if (event.items[0]) {
      socialEquity1 = parseFloat(event.items[0].value).toFixed(2);
    }
    if (event.items[1]) {
      socialEquity2 = parseFloat(event.items[1].value).toFixed(2);
    }

    this.setState({ socialEquity1, socialEquity2 });

    const tooltipDate = $('#chart-bavsocial-bav-time-tooltip');
    tooltipDate.html(`<p>${event.items[0].title}</p>`);
  }

  public getProcessedData = () => {
    const { analytics, brand1, brand2 } = this.props ;
    
    const data = [] as any;

    if (brand1.get('name') && analytics.analyticsBrand1.length > 1) {
      for (const analytic of analytics.analyticsBrand1) {
        data.push({ 
          type: brand1.get('alias'),
          date: moment(analytic.get('date')).utc().format('DD MMM YYYY'),
          value: analytic.get('data').Social_Equity
        });
      };
    }
    if (brand2.get('name') && analytics.analyticsBrand2.length > 1) {
      for (const analytic of analytics.analyticsBrand2) {
        data.push({ 
          type: brand2.get('alias'),
          date: moment(analytic.get('date')).utc().format('DD MMM YYYY'),
          value: analytic.get('data').Social_Equity
        });
      };
    }
    return data;
  }

  public render () {
    const { brand1, brand2 } = this.props;
    const { socialEquity1, socialEquity2 } = this.state;

    return (
      <div className="text-center info-text">
        <div className="bg-white shadow analytic-container mt-3 mb-3">
          <div className="chart-bavsocial-bav-time-wrapper">
            <div id="chart-bavsocial-bav-time-tooltip-container">{}</div>
          </div>
          <div >
            {(socialEquity1  && brand1.get('name')) &&
            <div className="d-inline-block pr-2">
              <div
                className="d-inline-block round-container-bavprimary p-2 mr-2">
                {socialEquity1}</div>
              <div 
                className="d-inline-block round-container-bavtertiary p-2">
                {(brand1.get('pillars')[0].Brand_Asset_R).toFixed(2)}</div>
            </div>
            }
            {(socialEquity2 && brand2.get('name')) &&
            <div className="d-inline-block pl-2">
              <div
                className="d-inline-block round-container-bavsecundary p-2 mr-2">
                {socialEquity2}</div>
              <div
                className="d-inline-block round-container-bavquaternary p-2">
                {(brand2.get('pillars')[0].Brand_Asset_R).toFixed(2)}</div>
            </div>
            }
          </div>
        </div>
        <div className="bg-white shadow analytic-container mt-3 mb-3">
          {(brand1.get('name')) &&
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
          {(brand2.get('name')) &&
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