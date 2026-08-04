import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1091
  test('顧客の購入制約条件が新規案件の提案内容と矛盾するとき、推奨適用判定がエラーになる', () => {
    const customerConstraint = {
      customerId: 'CUST-001',
      budgetLimit: 5000000,
      allowedProductCategories: ['CloudSaaS'],
      minContractMonths: 12,
    };

    const proposalContent = {
      proposedProductType: 'OnPremises',
      proposedPrice: 8000000,
      recommendedContractMonths: 36,
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        throw new Error(
          '顧客の購入制約条件と提案内容に矛盾があります。矛盾箇所：予算超過（上限5000000円 > 提案8000000円）、製品形態不適合（推奨OnPremises ≠ 要件CloudSaaS）、契約期間不適合（推奨36ヶ月 > 要件12ヶ月以上の最小値逸脱）',
        );
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-001',
          description: 'キャッシュされた過去推奨パターン',
          recommendedApproach: 'クラウドSaaS型導入アプローチ',
          successRate: 0.85,
        },
      ]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0,
        isApplicable: false,
        conflictDetails: [
          '予算超過（上限5000000円 > 提案8000000円）',
          '製品形態不適合（推奨OnPremises ≠ 要件CloudSaaS）',
          '契約期間不適合（推奨36ヶ月 > 要件12ヶ月以上の最小値逸脱）',
        ],
      }),
    };

    expect(() =>
      generateRecommendation(customerConstraint, proposalContent, aiRecommendationEngineStub),
    ).toThrow(/顧客の購入制約条件と提案内容に矛盾/);
  });
});