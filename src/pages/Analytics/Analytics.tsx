import * as React from 'react';
import * as Parse from 'parse';
import * as moment from 'moment';
import { CSVLink } from "react-csv";

import Header from '../../components/Header';
import Loading from '../../components/Loading';
import DateRangePicker from '../../components/DateRangePicker';
import BrandSelector from 'src/components/BrandSelector';
import ArrowIcon from '../../img/arrow-icon.png';

// import AnalyticBAVSocialVSTime from './AnalyticBAVSocialVSTime';
import AnalyticsSocialGrid from './AnalyticsSocialGrid';
import AnalyticsSocialEquityEvolution from './AnalyticsSocialEquityEvolution';

export default class Analytics extends React.Component {
  public state = {
    loading: false,
    data: [] as any,
    startDate: '',
    endDate: '',
    brand1: new Parse.Object(),
    brand2: new Parse.Object(),
    analytics: { 
      analyticsDaysBrand1: [new Parse.Object()],
      analytics30DaysBrand1: [new Parse.Object()], 
      analyticsDaysBrand2: [new Parse.Object()], 
      analytics30DaysBrand2: [new Parse.Object()],
    }
  }

  public getDataAnalytics = async () => {
    const { brand1, brand2, startDate, endDate } = this.state;

    let analyticsDaysBrand1: Parse.Object[] = [];
    let analytics30DaysBrand1: Parse.Object[] = [];
    let analyticsDaysBrand2: Parse.Object[] = [];
    let analytics30DaysBrand2: Parse.Object[] = [];

    if (startDate !== '' && endDate !== '') {
      this.setState({ loading: true });
      if (brand1.get('name')) {
        analyticsDaysBrand1 = await this.getDataAnalyticsQuery('day', brand1).find();        
        analytics30DaysBrand1 = await this.getDataAnalyticsQuery('30days', brand1).find();        
        
        await this.getCSVData(analytics30DaysBrand1);
      }
      
      if (brand2.get('name')) {
        this.setState({ loading: true });
        analyticsDaysBrand2 = await this.getDataAnalyticsQuery('day', brand2).find();
        analytics30DaysBrand2 = await this.getDataAnalyticsQuery('30days', brand2).find();
      }
      await this.setState({
        analytics: {
          analyticsDaysBrand1,
          analytics30DaysBrand1,
          analyticsDaysBrand2,
          analytics30DaysBrand2
        }
      });
      this.setState({ loading: false });
    }

  }

  public getDataAnalyticsQuery = (analyticType: string, brand: any) => {
    const { startDate, endDate } = this.state;

    const query = new Parse.Query('Analytic');
    query.equalTo('analyticType', analyticType);
    query.equalTo('country', Parse.User.current()!.get('country'));
    query.equalTo('brand', brand);
    query.greaterThanOrEqualTo('date', moment(startDate, 'DD-MM-YYYY').utc().startOf('d').toDate());
    query.lessThanOrEqualTo('date', moment(endDate, 'DD-MM-YYYY').utc().endOf('d').toDate());
    query.ascending('date');
    query.limit(1000);

    return query;
  }

  public onGetDates = async (startDate:any, endDate:any) => {
    if (startDate === null) {
      await this.setState({ startDate: '' });
    } else {
      await this.setState({ startDate });
    }

    if (endDate === null) {
      await this.setState({ endDate: '' });
    } else {
      await this.setState({ endDate });
    }

    this.getDataAnalytics();
  }

  public onChangeBrand = async (value: Parse.Object, type: number) => {    
    if (type === 1) {
      await this.setState({ brand1: value });
    } else {
      await this.setState({ brand2: value });
    }

    this.getDataAnalytics();
  }

  public getCSVData = (analytics30DaysBrand1: any) => {
    const { brand1 } = this.state;
    const data = [];
    for (const analytic of analytics30DaysBrand1) {
      
      const objectAnalytic: any = {};

      objectAnalytic.avg_followers = analytic.get('data').avg_followers;
      objectAnalytic.avg_following = analytic.get('data').avg_following;
      objectAnalytic.avg_updates = analytic.get('data').avg_updates;
      objectAnalytic.counts = analytic.get('data').counts;
      objectAnalytic.negative = analytic.get('data').negative;
      objectAnalytic.neutral = analytic.get('data').neutral;
      objectAnalytic.positive = analytic.get('data').positive;
      objectAnalytic.avg_followers_r = analytic.get('data').avg_followers_r;
      objectAnalytic.avg_following_r = analytic.get('data').avg_following_r;
      objectAnalytic.avg_updates_r = analytic.get('data').avg_updates_r;
      objectAnalytic.counts_r = analytic.get('data').counts_r;
      objectAnalytic.negative_r = analytic.get('data').negative_r;
      objectAnalytic.neutral_r = analytic.get('data').neutral_r;
      objectAnalytic.positive_r = analytic.get('data').positive_r;
      objectAnalytic.Vitality_C = analytic.get('data').Vitality_C;
      objectAnalytic.Involvement_C = analytic.get('data').Involvement_C;
      objectAnalytic.Mood_C = analytic.get('data').Mood_C;
      objectAnalytic.Prominence_C = analytic.get('data').Prominence_C;
      objectAnalytic.Vitality_R = analytic.get('data').Vitality_R;
      objectAnalytic.Involvement_R = analytic.get('data').Involvement_R;
      objectAnalytic.Mood_R = analytic.get('data').Mood_R;
      objectAnalytic.Prominence_R = analytic.get('data').Prominence_R;
      objectAnalytic.Social_Equity = analytic.get('data').Social_Equity;
      objectAnalytic.Energized_Differentiation_R = brand1.get('pillars')[0].Energized_Differentiation_R;
      objectAnalytic.Relevance_R = brand1.get('pillars')[0].Relevance_R;
      objectAnalytic.Esteem_R = brand1.get('pillars')[0].Esteem_R;
      objectAnalytic.Knowledge_R = brand1.get('pillars')[0].Knowledge_R;
      objectAnalytic.Brand_Asset_R = brand1.get('pillars')[0].Brand_Asset_R;
      objectAnalytic.brand = brand1.get('name');
      objectAnalytic.day = moment(analytic.get('date')).utc().format('DD');
      objectAnalytic.month = moment(analytic.get('date')).utc().format('MM');
      objectAnalytic.year = moment(analytic.get('date')).utc().format('YYYY');
      data.push(objectAnalytic);
    }

    this.state.data = data;
  }

  public render () {
    const { brand1, brand2, analytics, data, loading } = this.state;
    
    return(
      <div className="pb-3">
        {loading && <Loading />}
        <Header />
        <div className="analytics-container">
          <div className="bg-white shadow analytic-container">
            <div className="section-title pb-3">
              <img src={ArrowIcon} alt="rt-pointer" width="10px" className="mr-3"/>
              <span className="text-bavprimary">Marcas</span>
            </div>
            <div className="row">
              <div className="col-6 text-center">
                <span className="text-gray">Marca 1</span>
                <BrandSelector onChangeBrand={this.onChangeBrand} type={1} />
              </div>
              <div className="col-6 text-center">
                <span className="text-gray">Marca 2</span>
                <BrandSelector onChangeBrand={this.onChangeBrand} type={2} />
              </div>
            </div>
            <DateRangePicker onGetDates={this.onGetDates} />
          </div>
          {(data.length > 0) && <div>
            <div className="bg-white shadow analytic-container">
              <div className="section-title">
                <img src={ArrowIcon} alt="rt-pointer" width="10px" className="mr-3"/>
                <span className="text-bavprimary">Social Grid</span>
                <p className="info-title">Social Equity (S-EQ) vs Brand Asset (BAV)</p>
              </div>
            </div>
            <AnalyticsSocialGrid
              brand1={brand1}
              brand2={brand2}
              analytics={{
                analyticsBrand1: analytics.analytics30DaysBrand1,
                analyticsBrand2: analytics.analytics30DaysBrand2
              }} />
          </div>
          }
          {(data.length > 0) && <div>
            <div className="bg-white shadow analytic-container">
              <div className="section-title">
                <img src={ArrowIcon} alt="rt-pointer" width="10px" className="mr-3"/>
                <span className="text-bavprimary">Social Equity Evolution</span>
              </div>
            </div>
            <AnalyticsSocialEquityEvolution
              brand1={brand1}
              brand2={brand2}
              analytics={{
                analyticsBrand1: analytics.analytics30DaysBrand1,
                analyticsBrand2: analytics.analytics30DaysBrand2
              }} />
          </div>
          }
          {(data.length > 0) &&
          <div className="text-center mt-5">
            <CSVLink
              data={data}
              filename={`${brand1.get('name')}.csv`}
              className="btn-bavsocial bg-bavtertiary"
              target="_blank"
            >Descargar informe
            </CSVLink>
          </div>
          }
          <div className="text-center mt-5">
            <span>Powered by VMLY&R</span>
          </div>
        </div>
      </div>
    );
  }
}
