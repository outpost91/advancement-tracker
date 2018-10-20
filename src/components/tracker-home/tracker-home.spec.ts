import { flush, render } from '@stencil/core/testing';
import { TrackerHome } from './tracker-home';

describe('tracker-home', () => {
  it('should build', () => {
    expect(new TrackerHome()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [TrackerHome],
        html: '<tracker-home></tracker-home>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new tracker-home component');
    });
  });
});
