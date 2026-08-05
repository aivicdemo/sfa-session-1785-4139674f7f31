import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1055
  test('理解度確認テストと実務適用報告が逆順で提出された場合に時系列で正しく処理される', () => {
    const sales_staff_id = 'SA001';
    const assessment_submission_timestamp = '2024-01-15T09:00:00Z';
    const report_submission_timestamp = '2024-01-10T14:30:00Z';

    const input_events = [
      {
        sales_staff_id: sales_staff_id,
        event_type: 'assessment',
        event_timestamp: assessment_submission_timestamp,
        event_content: {
          understanding_score: 85,
          test_items_passed: 17,
          test_items_total: 20,
        },
      },
      {
        sales_staff_id: sales_staff_id,
        event_type: 'report',
        event_timestamp: report_submission_timestamp,
        event_content: {
          practical_application_count: 3,
          implementation_success_count: 2,
          feedback_summary: 'Applied success pattern in customer B negotiation',
        },
      },
    ];

    const report = generateBehaviorPatternAnalysisReport({
      sales_staff_id: sales_staff_id,
      events: input_events,
    });

    expect(report).toBeDefined();
    expect(report.sales_staff_id).toBe(sales_staff_id);
    expect(report.event_timeline).toBeDefined();
    expect(report.event_timeline.length).toBe(2);

    const first_event = report.event_timeline[0];
    const second_event = report.event_timeline[1];

    expect(first_event.event_timestamp).toBe(report_submission_timestamp);
    expect(first_event.event_type).toBe('report');
    expect(first_event.event_content.practical_application_count).toBe(3);
    expect(first_event.event_content.implementation_success_count).toBe(2);

    expect(second_event.event_timestamp).toBe(assessment_submission_timestamp);
    expect(second_event.event_type).toBe('assessment');
    expect(second_event.event_content.understanding_score).toBe(85);
    expect(second_event.event_content.test_items_passed).toBe(17);

    expect(
      new Date(first_event.event_timestamp) <
        new Date(second_event.event_timestamp)
    ).toBe(true);
  });
});