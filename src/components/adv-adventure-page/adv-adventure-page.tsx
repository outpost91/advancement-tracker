import { Component } from '@stencil/core';


@Component({
  tag: 'adv-adventure-page',
  styleUrl: 'adv-adventure-page.scss'
})
export class AdvAdventurePage {

  render() {
    return (
      <adv-group-page adventure />
    );
  }
}
