import { Component } from '@stencil/core';


@Component({
  tag: 'adv-expedition-page',
  styleUrl: 'adv-expedition-page.scss'
})
export class AdvExpeditionPage {

  render() {
    return (
      <adv-group-page expedition />
    );
  }
}
