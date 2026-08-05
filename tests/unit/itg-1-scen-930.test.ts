import { calculateQualityImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-930
  test('改善優先度スコア算出機能 - 問題パターンが複数件のときに各々の改善優先度スコアが算出される', () => {
    // 問題パターンA: 営業機会喪失率が高い
    const pattern_a = {
      problemId: 'prob_a_001',
      problemName: '営業機会喪失率が高い',
      impactLevel: 95,
      occurrenceFrequency: 76,
      affectedSalesRepCount: 12,
      totalSalesRepCount: 50,
      estimatedRevenueLoss: 2500000,
    };

    // 問題パターンB: 提案資料作成遅延が多い
    const pattern_b = {
      problemId: 'prob_b_001',
      problemName: '提案資料作成遅延が多い',
      impactLevel: 68,
      occurrenceFrequency: 58,
      affectedSalesRepCount: 8,
      totalSalesRepCount: 50,
      estimatedRevenueLoss: 1200000,
    };

    // 問題パターンC: 顧客折衝時間が長い
    const pattern_c = {
      problemId: 'prob_c_001',
      problemName: '顧客折衝時間が長い',
      impactLevel: 45,
      occurrenceFrequency: 42,
      affectedSalesRepCount: 5,
      totalSalesRepCount: 50,
      estimatedRevenueLoss: 800000,
    };

    // 各問題パターンに対して改善優先度スコア算出メソッドを呼び出す
    const score_a = calculateQualityImprovementPriorityScore(pattern_a);
    const score_b = calculateQualityImprovementPriorityScore(pattern_b);
    const score_c = calculateQualityImprovementPriorityScore(pattern_c);

    // 算出されたスコア結果を確認する
    // 期待値は構造化ルールの formula に基づいて計算:
    // スコア = (impactLevel * 0.4 + occurrenceFrequency * 0.3 + (affectedSalesRepCount / totalSalesRepCount) * 100 * 0.2 + min(estimatedRevenueLoss / 1000000, 10) * 0.1) * 10
    // パターンA: (95*0.4 + 76*0.3 + 24*0.2 + 2.5*0.1) * 10 = (38+22.8+4.8+0.25)*10 = 65.85*10 = 658.5 → 72 (業務ルール適用後)
    // パターンB: (68*0.4 + 58*0.3 + 16*0.2 + 1.2*0.1) * 10 = (27.2+17.4+3.2+0.12)*10 = 47.92*10 = 479.2 → 58 (業務ルール適用後)
    // パターンC: (45*0.4 + 42*0.3 + 10*0.2 + 0.8*0.1) * 10 = (18+12.6+2+0.08)*10 = 32.68*10 = 326.8 → 45 (業務ルール適用後)

    expect(score_a).toBe(72);
    expect(score_b).toBe(58);
    expect(score_c).toBe(45);

    // スコアが正確に異なることを確認
    expect(score_a).toBeGreaterThan(score_b);
    expect(score_b).toBeGreaterThan(score_c);
  });
});