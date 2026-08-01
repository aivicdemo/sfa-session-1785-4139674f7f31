import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-680: [edge] 改善優先度スコア算出機能 - 問題パターンの発生頻度が最大値ちょうどのとき優先度スコアが最高値で計算される
  test('発生頻度が最大値ちょうどのとき、優先度スコアが最高値である100ポイントになる', () => {
    const problem_pattern = {
      pattern_id: 'pattern_001',
      occurrence_frequency: 100,
      impact_range: 'team',
      severity_level: 'high',
      analysis_period_start: new Date('2024-01-01T00:00:00Z'),
      analysis_period_end: new Date('2024-01-31T23:59:59Z'),
    };

    const priority_score = calculatePriorityScore(problem_pattern);

    expect(priority_score).toBe(100);
  });
});