import { flush, render } from '@stencil/core/testing';
import { TrackerPlanner } from './tracker-planner';

describe('tracker-planner', () => {
  it('should build', () => {
    expect(new TrackerPlanner()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [TrackerPlanner],
        html: '<tracker-planner></tracker-planner>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new tracker-planner component');
    });
  });
});
