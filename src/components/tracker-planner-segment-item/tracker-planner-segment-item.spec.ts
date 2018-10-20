import { render } from '@stencil/core/testing';
import { TrackerPlannerSegmentItem } from './tracker-planner-segment-item';

describe('tracker-planner-segment-item', () => {
  it('should build', () => {
    expect(new TrackerPlannerSegmentItem()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [TrackerPlannerSegmentItem],
        html: '<tracker-planner-segment-item></tracker-planner-segment-item>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new tracker-planner-segment-item component');
    });
  });
});
