import { render } from '@stencil/core/testing';
import { AdvExpeditionPage } from './adv-expedition-page';

describe('adv-expedition-page', () => {
  it('should build', () => {
    expect(new AdvExpeditionPage()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [AdvExpeditionPage],
        html: '<adv-expedition-page></adv-expedition-page>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new adv-expedition-page component');
    });
  });
});
