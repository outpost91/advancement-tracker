import { render } from '@stencil/core/testing';
import { AdvKidsPage } from './adv-kids-page';

describe('adv-kids-page', () => {
  it('should build', () => {
    expect(new AdvKidsPage()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [AdvKidsPage],
        html: '<adv-kids-page></adv-kids-page>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new adv-kids-page component');
    });
  });
});
