import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-460
  test('同一の営業担当者・期間で2回実行しても、行動パターンスコアが同じ結果として計算される', () => {
    const salesPersonId = 'SA001';
    const periodStart = '2024-01-01';
    const periodEnd = '2024-01-31';
    const analysisMetrics = ['visit_count', 'proposal_document_sent_count', 'customer_response_time'];

    const firstExecutionInput = {
      sales_person_id: salesPersonId,
      period_start: periodStart,
      period_end: periodEnd,
      analysis_metrics: analysisMetrics,
    };

    const secondExecutionInput = {
      sales_person_id: salesPersonId,
      period_start: periodStart,
      period_end: periodEnd,
      analysis_metrics: analysisMetrics,
    };

    const firstResult = generateBehaviorPatternAnalysisReport(firstExecutionInput);
    const secondResult = generateBehaviorPatternAnalysisReport(secondExecutionInput);

    expect(firstResult.visit_efficiency_score).toBe(secondResult.visit_efficiency_score);
    expect(firstResult.proposal_speed_score).toBe(secondResult.proposal_speed_score);
    expect(firstResult.response_promptness_score).toBe(secondResult.response_promptness_score);

    expect(firstResult.visit_efficiency_score).toBe(78.5);
    expect(firstResult.proposal_speed_score).toBe(82.3);
    expect(firstResult.response_promptness_score).toBe(75.0);

    expect(secondResult.visit_efficiency_score).toBe(78.5);
    expect(secondResult.proposal_speed_score).toBe(82.3);
    expect(secondResult.response_promptness_score).toBe(75.0);
  });
});