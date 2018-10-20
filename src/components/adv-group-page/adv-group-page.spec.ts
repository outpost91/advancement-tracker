import { render } from '@stencil/core/testing';
import { AdvGroupPage } from './adv-group-page';

describe('adv-group-page', () => {
  it('should build', () => {
    expect(new AdvGroupPage()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [AdvGroupPage],
        html: '<adv-group-page></adv-group-page>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new adv-group-page component');
    });
  });
});
