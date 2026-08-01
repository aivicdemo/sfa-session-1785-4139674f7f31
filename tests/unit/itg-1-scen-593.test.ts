import { filterReportableDetectionResults } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-593
  test('問題検出結果の重要度・対応必要性判定機能 - 営業部長への報告対象リストが報告対象と判定された結果のみで構成される', () => {
    const test_detection_results = [
      {
        detection_id: 'det-001',
        issue_type: 'proposal_deviation',
        severity: 'high',
        is_reportable: true,
      },
      {
        detection_id: 'det-002',
        issue_type: 'process_deviation',
        severity: 'critical',
        is_reportable: true,
      },
      {
        detection_id: 'det-003',
        issue_type: 'followup_delay',
        severity: 'high',
        is_reportable: true,
      },
      {
        detection_id: 'det-004',
        issue_type: 'minor_data_quality',
        severity: 'low',
        is_reportable: false,
      },
      {
        detection_id: 'det-005',
        issue_type: 'temporary_anomaly',
        severity: 'medium',
        is_reportable: false,
      },
    ];

    const result = filterReportableDetectionResults(test_detection_results);

    expect(result.reportable_list.length).toBe(3);

    result.reportable_list.forEach((item) => {
      expect(item.is_reportable).toBe(true);
    });

    const reportable_ids = result.reportable_list.map((item) => item.detection_id);
    expect(reportable_ids).toContain('det-001');
    expect(reportable_ids).toContain('det-002');
    expect(reportable_ids).toContain('det-003');

    expect(reportable_ids).not.toContain('det-004');
    expect(reportable_ids).not.toContain('det-005');
  });
});