import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-668: [error] 改善優先度スコア算出機能 - 発生頻度が入力されていないとき処理がエラーになる
  test('should throw error when occurrence frequency is missing', () => {
    const input_impact_degree = 8;
    const input_importance_level = 7;
    const input_occurrence_frequency = null;

    expect(() =>
      calculateImprovementPriorityScore({
        impact_degree: input_impact_degree,
        importance_level: input_importance_level,
        occurrence_frequency: input_occurrence_frequency,
      })
    ).toThrow(/発生頻度/);
  });
});