import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-943
  test('改善優先度スコア算出機能 - 発生頻度が負の数のときエラーが返される', () => {
    const input = {
      impact_degree: 8,
      frequency: -1,
    };

    const result = calculateImprovementPriorityScore(input);

    expect(result).toEqual({
      success: false,
      error_code: 'INVALID_FREQUENCY',
      error_message: '発生頻度は0以上の数値である必要があります',
    });
  });
});