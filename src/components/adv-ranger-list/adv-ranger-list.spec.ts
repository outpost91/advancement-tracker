import { flush, render } from '@stencil/core/testing';
import { AdvRangerList } from './adv-ranger-list';

describe('adv-ranger-list', () => {
  it('should build', () => {
    expect(new AdvRangerList()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [AdvRangerList],
        html: '<adv-ranger-list></adv-ranger-list>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new adv-ranger-list component');
    });
  });
});