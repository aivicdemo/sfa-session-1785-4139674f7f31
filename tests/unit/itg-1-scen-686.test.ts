import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  // SCEN-686
  test('問題パターンの分類が異なる場合でも統一的に優先度スコアが計算される', () => {
    // 問題パターンA：営業段階での情報不足
    const improvementCaseA = {
      problemPattern: 'insufficient_information_at_sales_stage',
      riskDegree: 35,
      occurrenceFrequency: 45,
      improvementEffect: 28,
    };

    // 問題パターンB：顧客ニーズの把握不足
    const improvementCaseB = {
      problemPattern: 'insufficient_customer_needs_understanding',
      riskDegree: 28,
      occurrenceFrequency: 52,
      improvementEffect: 32,
    };

    // 問題パターンC：提案資料の質不足
    const improvementCaseC = {
      problemPattern: 'proposal_material_quality_deficiency',
      riskDegree: 42,
      occurrenceFrequency: 38,
      improvementEffect: 25,
    };

    // 各改善案に対して優先度スコア算出機能を実行
    const scoreA = calculatePriorityScore(improvementCaseA);
    const scoreB = calculatePriorityScore(improvementCaseB);
    const scoreC = calculatePriorityScore(improvementCaseC);

    // スコアが0～100の範囲内にあることを検証
    expect(scoreA).toBeGreaterThanOrEqual(0);
    expect(scoreA).toBeLessThanOrEqual(100);
    expect(scoreB).toBeGreaterThanOrEqual(0);
    expect(scoreB).toBeLessThanOrEqual(100);
    expect(scoreC).toBeGreaterThanOrEqual(0);
    expect(scoreC).toBeLessThanOrEqual(100);

    // 加重平均計算式：(リスク度30% + 発生頻度40% + 改善効果30%)
    // パターンAの期待スコア：35*0.3 + 45*0.4 + 28*0.3 = 10.5 + 18 + 8.4 = 36.9
    expect(scoreA).toBe(36.9);

    // パターンBの期待スコア：28*0.3 + 52*0.4 + 32*0.3 = 8.4 + 20.8 + 9.6 = 38.8
    expect(scoreB).toBe(38.8);

    // パターンCの期待スコア：42*0.3 + 38*0.4 + 25*0.3 = 12.6 + 15.2 + 7.5 = 35.3
    expect(scoreC).toBe(35.3);

    // 計算ロジックと評価基準が統一されていることを確認
    // スコア値は異なるが、同じ重み係数で計算されている
    const weightedSumA = improvementCaseA.riskDegree * 0.3 + improvementCaseA.occurrenceFrequency * 0.4 + improvementCaseA.improvementEffect * 0.3;
    const weightedSumB = improvementCaseB.riskDegree * 0.3 + improvementCaseB.occurrenceFrequency * 0.4 + improvementCaseB.improvementEffect * 0.3;
    const weightedSumC = improvementCaseC.riskDegree * 0.3 + improvementCaseC.occurrenceFrequency * 0.4 + improvementCaseC.improvementEffect * 0.3;

    expect(weightedSumA).toBe(36.9);
    expect(weightedSumB).toBe(38.8);
    expect(weightedSumC).toBe(35.3);
  });
});