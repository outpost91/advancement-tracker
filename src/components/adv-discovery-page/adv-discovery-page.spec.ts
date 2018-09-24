import { render } from '@stencil/core/testing';
import { AdvDiscoveryPage } from './adv-discovery-page';

describe('adv-discovery-page', () => {
  it('should build', () => {
    expect(new AdvDiscoveryPage()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [AdvDiscoveryPage],
        html: '<adv-discovery-page></adv-discovery-page>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new adv-discovery-page component');
    });
  });
});