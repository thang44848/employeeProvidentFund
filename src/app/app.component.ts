import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { employeeMockData } from './mock-data/employee-mock-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() { }

  public employeeData: any;
  atTheMoment = moment();

  ngOnInit() {
    this.employeeData = employeeMockData;
    this.calculateEmployeeAge();
    this.calculateProvidentFund();
  }

  calculateEmployeeAge() {
    this.employeeData = this.employeeData.map((employee: any) => {
      var employeeDateOfBirth = moment(employee.birthdate , 'DDMMYYYY');
      var employeeAge = this.atTheMoment.diff(employeeDateOfBirth, 'years');
      return {
        ...employee,
        age: employeeAge
      };
    })
  }

  calculateProvidentFund() {
    this.employeeData = this.employeeData.map((employee: any) => {
      const PROBATION_PERIOD = 3;
      const RATE_OF_GOVERNMENT_BOND = 0.02;
      var startDateOfWork = moment(employee.startdate , 'DDMMYYYY');
      var monthsOfWork = this.atTheMoment.diff(startDateOfWork, 'months');
      if(employee.employeetype === 'Permanent' && monthsOfWork > PROBATION_PERIOD) {
        var employeeContribution = (employee.salary * ( employee.pvfrate/100)) * (monthsOfWork - PROBATION_PERIOD);
        var companyContribution = (employee.salary * (0.1)) * (monthsOfWork - PROBATION_PERIOD);
        var governmentBond = (employeeContribution + companyContribution) * RATE_OF_GOVERNMENT_BOND;
        var providentFundEarnInTotal = this.calculateProvidentFundEarnIfEmployeeLeaveCompanyToday(monthsOfWork, employeeContribution, companyContribution, governmentBond);

        return {
          ...employee, 
          employeeContribution: employeeContribution,
          companyContribution: companyContribution,
          governmentBond: governmentBond,
          providentFundEarnIfEmployeeLeaveToday: providentFundEarnInTotal
        }
      } else {
        return {
          ...employee, 
          employeeContribution: 0,
          companyContribution: 0,
          governmentBond: 0,
          providentFundEarnIfEmployeeLeaveToday: 0
        }     
      }
    })
    console.log(this.employeeData);
  }

  calculateProvidentFundEarnIfEmployeeLeaveCompanyToday(monthsOfWork: number, employeeContribution: number, companyContribution: number, governmentBond: number): number {
    const THREE_YEARS_IN_MONTHS = 36;
    const FIVE_YEARS_IN_MONTHS = 60;
    var totalAmountOfProvidentFund = employeeContribution + companyContribution + governmentBond;
    if(monthsOfWork < THREE_YEARS_IN_MONTHS) {
      return 0;
    } else if (monthsOfWork > THREE_YEARS_IN_MONTHS && monthsOfWork < FIVE_YEARS_IN_MONTHS) {
      return totalAmountOfProvidentFund*0.5;
    } else {
      return totalAmountOfProvidentFund;
    }
  }
}
