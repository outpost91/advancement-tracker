import { render } from '@stencil/core/testing';
import { AdvAdventurePage } from './adv-adventure-page';

describe('adv-adventure-page', () => {
  it('should build', () => {
    expect(new AdvAdventurePage()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [AdvAdventurePage],
        html: '<adv-adventure-page></adv-adventure-page>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new adv-adventure-page component');
    });
  });
});
