import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨ロジック', () => {
  // SCEN-2728
  test('新規案件の商談条件が欠落しているとき処理が失敗する', () => {
    const incompleteNegotiationCondition = {
      customerName: 'ABC Corporation',
      // 必須フィールド businessStage が欠落
      budgetAmount: 5000000,
      industry: 'Technology',
    };

    expect(() =>
      generateRecommendation({
        customerId: 'CUST-001',
        negotiationConditions: incompleteNegotiationCondition,
        historicalSuccessPatterns: [
          {
            patternId: 'PATTERN-001',
            matchScore: 0.85,
            proposalApproach: 'Enterprise Solution',
            successFactors: ['Key stakeholder engagement', 'ROI focus'],
          },
        ],
      })
    ).toThrow(/businessStage/);
  });
});