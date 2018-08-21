import { Component, Prop, State } from '@stencil/core';

import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/database';

@Component({
  tag: 'tracker-planner',
  styleUrl: 'tracker-planner.scss'
})
export class TrackerPlanner {
  @Prop() auth: AuthService;
  @Prop() db?: DatabaseService;

  @State() value: string;
  @State() selectValue: string;
  @State() secondSelectValue: string;
  @State() avOptions: any[];

  handleSubmit(event) {
    console.log(event.target.value);
    console.log(this.value);
  }

  handleChange(event) {
    this.value = event.target.value;

    if (event.target.validity.typeMismatch) {
      console.log('this element is not valid')
    }
  }

  handleSelect(event) {
    console.log(event.target.value);
    this.selectValue = event.target.value;
  }

  handleSecondSelect(event) {
    console.log(event.target.value);
    this.secondSelectValue = event.target.value;
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <label>
          Email:
          <input type="email" value={this.value} onInput={(e) => this.handleChange(e)} />
        </label>

        <select onInput={(event) => this.handleSelect(event)}>
          <option value="volvo" selected={this.selectValue === 'volvo'}>Volvo</option>
          <option value="saab" selected={this.selectValue === 'saab'}>Saab</option>
          <option value="mercedes" selected={this.selectValue === 'mercedes'}>Mercedes</option>
          <option value="audi" selected={this.selectValue === 'audi'}>Audi</option>
        </select>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}