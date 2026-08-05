import { runSystemHealthCheckAndGenerateReport } from '../../src/logic/it-1-br-2-1-1';

describe('システムヘルスチェック判定機能', () => {
  // SCEN-313
  test('営業データ品質が合格でAIエージェント推論精度が合格の組み合わせでレポート生成される', () => {
    const salesDataQualityCheckResult = {
      judgement: '合格',
      score: 96,
      timestamp: '2024-01-15T11:00:00Z'
    };

    const aiAgentInferenceAccuracyCheckResult = {
      judgement: '合格',
      score: 97,
      timestamp: '2024-01-15T11:00:00Z'
    };

    const reportGeneratedAt = new Date('2024-01-15T11:00:00Z');

    const result = runSystemHealthCheckAndGenerateReport(
      salesDataQualityCheckResult,
      aiAgentInferenceAccuracyCheckResult,
      reportGeneratedAt
    );

    expect(result.salesDataQualityJudgement).toBe('合格');
    expect(result.aiAgentInferenceAccuracyJudgement).toBe('合格');
    expect(result.overallHealthStatus).toBe('ヘルスステータス：良好');
    expect(result.reportTimestamp).toEqual(reportGeneratedAt);
    expect(result.salesDataQualityScore).toBe(96);
    expect(result.aiAgentInferenceAccuracyScore).toBe(97);
  });
});