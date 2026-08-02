import { calculateProposalNeedsCompatibilityScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-734
  test('提案資料と顧客ニーズの適合度スコア化機能 - 顧客IDが不正な形式のとき、エラーが発生する', () => {
    const invalidCustomerIds = [
      null,
      undefined,
      '',
      'invalid-string',
      -1,
      3.14,
      NaN,
      Infinity,
      {},
      [],
    ];

    invalidCustomerIds.forEach((customerId) => {
      expect(() =>
        calculateProposalNeedsCompatibilityScore({
          customerId: customerId as any,
          proposalContent: {
            productCategory: 'software',
            budgetAmount: 100000,
            implementationTimeline: 90,
          },
          customerNeeds: {
            industryType: 'IT',
            companySize: 'medium',
            businessChallenge: 'digital transformation',
            budgetConstraint: 150000,
          },
        })
      ).toThrow(/顧客ID/);
    });
  });
});