import { Component } from '@stencil/core';


@Component({
  tag: 'adv-kids-page',
  styleUrl: 'adv-kids-page.scss'
})
export class AdvKidsPage {

  render() {
    return (
      <adv-group-page kids />
    );
  }
}
