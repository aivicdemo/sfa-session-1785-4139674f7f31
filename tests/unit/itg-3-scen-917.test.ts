import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-917
  test('[edge] 推奨根拠説明生成機能 - 根拠説明がAIエージェント正常応答時に自然言語で生成される', () => {
    const mockExplainRecommendationReasoning = jest.fn().mockResolvedValue(
      '顧客の業界は製造業で、過去3年間の成功事例から同業界での提案成功率は78%です。特に予算規模500万円以上かつ導入期間3ヶ月以内の案件では成約率が85%に達しています。本案件は両条件を満たすため、即座の提案開始を推奨します。'
    );

    const customerIndustry = '製造業';
    const budgetAmount = '600万円';
    const implementationPeriod = '2ヶ月';
    const recommendationId = 'REC-20260801-0042';

    explainRecommendationReasoning(
      customerIndustry,
      budgetAmount,
      implementationPeriod,
      recommendationId,
      mockExplainRecommendationReasoning
    ).then((result) => {
      expect(mockExplainRecommendationReasoning).toHaveBeenCalledTimes(1);
      expect(mockExplainRecommendationReasoning).toHaveBeenCalledWith(
        customerIndustry,
        budgetAmount,
        implementationPeriod,
        recommendationId
      );

      const expectedReasoningText =
        '顧客の業界は製造業で、過去3年間の成功事例から同業界での提案成功率は78%です。特に予算規模500万円以上かつ導入期間3ヶ月以内の案件では成約率が85%に達しています。本案件は両条件を満たすため、即座の提案開始を推奨します。';

      expect(result).toBe(expectedReasoningText);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('製造業');
      expect(result).toContain('78%');
      expect(result).toContain('85%');
      expect(result).toContain('500万円以上');
      expect(result).toContain('3ヶ月以内');
      expect(result).toContain('即座の提案開始を推奨');
    });
  });
});