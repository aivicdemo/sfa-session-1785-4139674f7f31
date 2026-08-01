import { selectBehaviorPatternAnalysisMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析・自動指標選定機能', () => {
  test('SCEN-758: 営業データ品質チェック完了時に指標選定処理が実行される', () => {
    const qualityCheckStatus = 'completed';
    const salesActivityFrequency = 15;
    const dealProgressRate = 0.65;
    const averageDealDuration = 45;
    const customerContactPattern = 'regular';

    const result = selectBehaviorPatternAnalysisMetrics({
      qualityCheckStatus,
      salesActivityFrequency,
      dealProgressRate,
      averageDealDuration,
      customerContactPattern,
    });

    expect(result.metricsSelected).toBe(true);
    expect(result.selectedMetrics).toHaveLength(4);
    expect(result.selectedMetrics).toContain('営業活動頻度');
    expect(result.selectedMetrics).toContain('商談進捗率');
    expect(result.selectedMetrics).toContain('平均商談期間');
    expect(result.selectedMetrics).toContain('顧客接触パターン');
    expect(result.executionCount).toBe(1);
  });
});