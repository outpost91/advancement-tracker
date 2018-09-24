import { render } from '@stencil/core/testing';
import { AdvGroupTab } from './adv-group-tab';

describe('adv-group-tab', () => {
  it('should build', () => {
    expect(new AdvGroupTab()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [AdvGroupTab],
        html: '<adv-group-tab></adv-group-tab>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new adv-group-tab component');
    });
  });
});