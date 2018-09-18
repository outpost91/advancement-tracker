import { Component } from '@stencil/core';

@Component({
  tag: 'tracker-home',
  styleUrl: 'tracker-home.scss'
})
export class TrackerHome {
  componentWillLoad() {
    console.log("Hello World");
  }

  render() {
    return (
      <ion-content>
        Your new tracker-home component
      </ion-content>
    );
  }
}
