import { calculateIndustryFitScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-706
  test('提案資料の業種が空のとき、業種適合スコア計算が適切に処理される', () => {
    const customerNeeds = {
      industry: '製造業',
      budgetRange: '1000万円以上',
      purchaseFrequency: '年1回',
      productCategory: 'ERP'
    };

    const proposalDocument = {
      industry: '',
      content: 'システム導入提案',
      price: 1500,
      timeline: '3ヶ月'
    };

    const result = calculateIndustryFitScore(customerNeeds, proposalDocument);

    expect(result.score).toBe(0);
    expect(result.status).toBe('スキップ');
    expect(result.message).toBe('業種情報が不足しているため業種適合スコアの計算をスキップしました');
    expect(result.error).toBeUndefined();
  });
});