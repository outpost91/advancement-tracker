import { render } from '@stencil/core/testing';
import { TrackerPlannerSelectItem } from './tracker-planner-select-item';

describe('tracker-planner-select-item', () => {
  it('should build', () => {
    expect(new TrackerPlannerSelectItem()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [TrackerPlannerSelectItem],
        html: '<tracker-planner-select-item></tracker-planner-select-item>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new tracker-planner-select-item component');
    });
  });
});