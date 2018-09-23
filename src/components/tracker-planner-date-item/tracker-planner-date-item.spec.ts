import { render } from '@stencil/core/testing';
import { TrackerPlannerDateItem } from './tracker-planner-date-item';

describe('tracker-planner-date-item', () => {
  it('should build', () => {
    expect(new TrackerPlannerDateItem()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [TrackerPlannerDateItem],
        html: '<tracker-planner-date-item></tracker-planner-date-item>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new tracker-planner-date-item component');
    });
  });
});