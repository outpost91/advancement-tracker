import { flush, render } from '@stencil/core/testing';
import { TrackerLogin } from './tracker-login';

describe('tracker-login', () => {
  it('should build', () => {
    expect(new TrackerLogin()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [TrackerLogin],
        html: '<tracker-login></tracker-login>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new tracker-login component');
    });
  });
});
