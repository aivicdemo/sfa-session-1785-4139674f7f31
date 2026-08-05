import { determineReportingRequirement } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-816
  test('問題検出結果の重要度が低い場合は営業部長報告対象外として判定される', () => {
    const detection_result = {
      severity: 'low',
      rationale: '営業プロセス逸脱の軽微な事例',
      action_required: 'recommended',
    };

    const result = determineReportingRequirement(detection_result);

    expect(result.reporting_required).toBe(false);
  });
});