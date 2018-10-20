import { flush, render } from '@stencil/core/testing';
import { TrackerApp } from './tracker-app';

describe('tracker-app', () => {
  it('should build', () => {
    expect(new TrackerApp()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [TrackerApp],
        html: '<tracker-app></tracker-app>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new tracker-app component');
    });
  });
});
