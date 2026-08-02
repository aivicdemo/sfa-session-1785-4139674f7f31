import { calculateIndustryFitScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-703
  test('提案資料と顧客ニーズの適合度スコア化機能 - 顧客業種が完全に異なるとき、業種適合スコアが最低値になる', () => {
    const proposal_industry = 'IT・ソフトウェア開発';
    const customer_industry = '農業・畜産';

    const fit_score = calculateIndustryFitScore(proposal_industry, customer_industry);

    expect(fit_score).toBe(0);
  });
});