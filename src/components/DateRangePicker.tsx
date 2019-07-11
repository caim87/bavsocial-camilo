import * as React from 'react';
import * as moment from 'moment';
import Swal from 'sweetalert2';

import { DateRangePicker, isInclusivelyAfterDay } from 'react-dates';

interface IDateRangePiker {
  onGetDates: (startDate: any, endDate: any) => void;
}

export default class DateRangePiker extends React.Component<IDateRangePiker> {
  public state = {
    startDate: null,
    endDate: null,
    focusedInput: null,
  }

  public onDatesSelection = (range: { startDate: any, endDate: any }) =>  {    
    let startDate = range.startDate;
    let endDate = range.endDate;

    if (range.startDate !== null) {
      startDate = moment(range.startDate, 'DD-MM-YYYY').utc().startOf('d');
      this.setState({ startDate });

    } else {
      Swal('Fecha de inicio', 'Por favor elegír primero la fecha de inicio', 'warning');
    }

    if (range.endDate !== null && endDate.diff(startDate, 'd') >= 29 ) {
      endDate = moment(range.endDate, 'YYYY-MM-DD').utc().endOf('d');
      this.setState({ endDate });
      
    } else if (range.endDate !== null && endDate.diff(startDate, 'd') < 29) {
      Swal('Fecha invalida', 'La fecha debe ser superior a 30 días', 'warning');
    }

    if (range.endDate !== null && range.startDate !== null && endDate.diff(startDate, 'd') >= 29) {
      this.setDates(startDate.format('DD-MM-YYYY'), endDate.format('DD-MM-YYYY'));
    }
  }

  public onShowDateSelector = (focusedInput: any) => {
    this.setState({ focusedInput });
  }

  public setDates = (startDate: any, endDate: any) => {
    this.props.onGetDates(startDate, endDate);
  }

  public render () {
    const { startDate, endDate, focusedInput } = this.state;
    
    return (
      <div className="container pt-3 text-center">
        <DateRangePicker
          startDate={startDate}
          startDateId="Start_Date"
          startDatePlaceholderText="Fecha inicial"
          endDate={endDate}
          endDateId="End_Date"
          endDatePlaceholderText="Fecha final"
          onDatesChange={this.onDatesSelection}
          focusedInput={focusedInput}
          onFocusChange={this.onShowDateSelector}
          initialVisibleMonth={() => moment().add(-29, 'd')}
          isOutsideRange={day => {
              if (focusedInput === "startDate") {
                return isInclusivelyAfterDay(day, moment().add(-29, 'd'));
              } else {
                return isInclusivelyAfterDay(day, moment());
              }
            }
          }
          numberOfMonths={1}
          readOnly
        />
      </div>
    );
  }
}
