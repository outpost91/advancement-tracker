import { flush, render } from '@stencil/core/testing';
import { TrackerLoginItem } from './tracker-login-item';

describe('tracker-login-item', () => {
  it('should build', () => {
    expect(new TrackerLoginItem()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [TrackerLoginItem],
        html: '<tracker-login-item></tracker-login-item>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new tracker-login-item component');
    });
  });
});
