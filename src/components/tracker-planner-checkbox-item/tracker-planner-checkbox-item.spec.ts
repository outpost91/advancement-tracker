import { render } from '@stencil/core/testing';
import { TrackerPlannerCheckboxItem } from './tracker-planner-checkbox-item';

describe('tracker-planner-checkbox-item', () => {
  it('should build', () => {
    expect(new TrackerPlannerCheckboxItem()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [TrackerPlannerCheckboxItem],
        html: '<tracker-planner-checkbox-item></tracker-planner-checkbox-item>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new tracker-planner-checkbox-item component');
    });
  });
});
