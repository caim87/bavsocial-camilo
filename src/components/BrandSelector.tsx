import * as React from 'react';
import * as Parse from 'parse';
import Select from 'react-select';

export interface IBrandSelector {
  type: number;
  onChangeBrand: (value: Parse.Object, type: number) => void;
}

export default class BrandSelector extends React.Component <IBrandSelector> {
  public state = {
    options: []
  }

  public async componentDidMount () {
    await this.getBrands();
  }

  public getBrands = async () => {
    const brands = await this.getBrandsQuery().find();

    let options: any = [];

    if (this.props.type !== 1) {
      options = [{ value: new Parse.Object('Brand'), label: 'No elegir' }];    
    }

    brands.forEach(brand => {
      options.push({ value: brand, label: brand.get('alias') });
    });

    await this.setState({ options });
  }

  public getBrandsQuery = () => {
    const query = new Parse.Query('Brand');
    query.equalTo('country', Parse.User.current()!.get('country'));
    query.containedIn('categories', Parse.User.current()!.get('categories'));
    query.equalTo('active', true);
    query.ascending('name');

    return query;
  }

  public onChangeBrand = (event: any) => {    
    this.props.onChangeBrand(event.value, this.props.type);
  }
  
  public render () {
    const { options } = this.state;

    return(
      <div className="pt-3">
        <Select
          classNamePrefix="react-select"
          options={options}
          onChange={this.onChangeBrand}
        />
      </div>
    )
  }
}
