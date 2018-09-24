import { Component } from '@stencil/core';


@Component({
  tag: 'adv-discovery-page',
  styleUrl: 'adv-discovery-page.scss'
})
export class AdvDiscoveryPage {

  render() {
    return (
      <adv-group-page discovery />
    );
  }
}
