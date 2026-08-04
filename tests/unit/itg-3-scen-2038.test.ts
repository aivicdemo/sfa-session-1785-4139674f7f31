import { generatePersuasionDocument } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2038
  test('経営層向け説得資料の自動生成機能 - AIエージェント推奨根拠の説明文生成が正常に応答した場合、根拠文がそのまま資料に組み込まれる', () => {
    const recommendationReasoningResponse = {
      reasoning:
        '過去5年間の類似商談データから、製造業のデジタル化推進案件において、段階的なクラウドERP導入アプローチの成功率は87%で、一括導入の68%を大きく上回っています。特に予算5000万円規模では、段階的導入によるROI達成期間が12ヶ月短縮されています。',
    };

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(recommendationReasoningResponse),
    };

    const customerInfo = {
      industry: '製造業',
      challenge: 'デジタル化推進',
      budgetAmount: 50000000,
      companyName: 'テスト製造会社',
    };

    const proposalContent = {
      solution: 'クラウドERP導入',
      approach: '段階的導入',
      expectedRoi: 0.25,
      implementationPeriod: 24,
    };

    const result = generatePersuasionDocument(
      customerInfo,
      proposalContent,
      mockAIRecommendationEngine
    );

    expect(result).toEqual(
      expect.objectContaining({
        document: expect.objectContaining({
          recommendationBasis: expect.objectContaining({
            reasoning:
              '過去5年間の類似商談データから、製造業のデジタル化推進案件において、段階的なクラウドERP導入アプローチの成功率は87%で、一括導入の68%を大きく上回っています。特に予算5000万円規模では、段階的導入によるROI達成期間が12ヶ月短縮されています。',
          }),
        }),
      })
    );

    expect(result.document.recommendationBasis.reasoning).toBe(
      recommendationReasoningResponse.reasoning
    );

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: '製造業',
        challenge: 'デジタル化推進',
      }),
      expect.objectContaining({
        solution: 'クラウドERP導入',
        approach: '段階的導入',
      })
    );
  });
});