import { validateReportingFlag } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-833: [error] 問題検出結果のレビュー・判定機能 - 営業部長への報告対象フラグが欠落している場合にエラーになること
  test('reportingToSalesManagerFlag が undefined の場合、ValidationError が発生し、エラーコード MISSING_REPORTING_FLAG を返すこと', () => {
    const detectionResultData = {
      problemId: 'PRB-001',
      detectionTimestamp: new Date('2024-01-15T11:00:00Z'),
      problemType: 'process_deviation',
      severity: 'high',
      salesPersonId: 'SP-001',
      reportingToSalesManagerFlag: undefined,
    };

    expect(() => validateReportingFlag(detectionResultData)).toThrow(/報告対象フラグ/);
  });
});