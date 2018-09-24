import { flush, render } from '@stencil/core/testing';
import { AdvRangerGroups } from './adv-ranger-groups';

describe('adv-ranger-groups', () => {
  it('should build', () => {
    expect(new AdvRangerGroups()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [AdvRangerGroups],
        html: '<adv-ranger-groups></adv-ranger-groups>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new adv-ranger-groups component');
    });
  });
});