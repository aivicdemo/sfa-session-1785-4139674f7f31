import { calculateIndustryCompatibilityScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-735
  test('提案資料と顧客ニーズの適合度スコア化機能 - 業種適合度の計算式が端数を生じるとき、適切に丸められたスコアが返される', () => {
    const proposal_industry_category = 'IT・ソフトウェア';
    const customer_needs_industry = 'IT・ソフトウェア';
    const matching_count = 4;
    const total_features = 5;

    const result = calculateIndustryCompatibilityScore(
      proposal_industry_category,
      customer_needs_industry,
      matching_count,
      total_features
    );

    expect(result).toBe(80.0);
  });
});