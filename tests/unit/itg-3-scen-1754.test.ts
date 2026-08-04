import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1754: [edge] 推奨根拠の可視化機能 - 根拠説明文が空文字のとき根拠を含める
  test('根拠説明文が空文字の場合、成功パターン情報を含めた推奨根拠を可視化する', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(''),
    };

    const recommendationInput = {
      recommendationId: 'rec-20240115-001',
      recommendationContent: '新規営業アプローチ：アカウントベースドマーケティング戦略の提案',
      successPatternData: {
        patternName: '大規模IT企業向け新規営業',
        patternApplicabilityScore: 87,
        similarityPercentage: 92,
        sourceHistoricalDeals: [
          {
            dealId: 'deal-2023-1001',
            customerIndustry: 'IT・ソフトウェア',
            enterpriseScale: '大企業（従業員数1000人以上）',
            purchaseAmount: 5000000,
            dealOutcome: 'won',
          },
          {
            dealId: 'deal-2023-1002',
            customerIndustry: 'IT・ソフトウェア',
            enterpriseScale: '大企業（従業員数1000人以上）',
            purchaseAmount: 4500000,
            dealOutcome: 'won',
          },
        ],
      },
    };

    const result = explainRecommendationReasoning(
      recommendationInput,
      mockAIEngine
    );

    expect(result).toEqual({
      recommendationId: 'rec-20240115-001',
      recommendationContent:
        '新規営業アプローチ：アカウントベースドマーケティング戦略の提案',
      explanation: '',
      successPatternName: '大規模IT企業向け新規営業',
      patternApplicabilityScore: 87,
      similarityPercentage: 92,
      sourceHistoricalDeals: [
        {
          dealId: 'deal-2023-1001',
          customerIndustry: 'IT・ソフトウェア',
          enterpriseScale: '大企業（従業員数1000人以上）',
          purchaseAmount: 5000000,
          dealOutcome: 'won',
        },
        {
          dealId: 'deal-2023-1002',
          customerIndustry: 'IT・ソフトウェア',
          enterpriseScale: '大企業（従業員数1000人以上）',
          purchaseAmount: 4500000,
          dealOutcome: 'won',
        },
      ],
      explanationPlaceholder:
        '詳細な根拠説明は利用できません',
      visibilityStatus: 'success',
    });

    expect(result.successPatternName).toBe('大規模IT企業向け新規営業');
    expect(result.patternApplicabilityScore).toBe(87);
    expect(result.similarityPercentage).toBe(92);
    expect(result.sourceHistoricalDeals).toHaveLength(2);
    expect(result.sourceHistoricalDeals[0].customerIndustry).toBe(
      'IT・ソフトウェア'
    );
    expect(result.sourceHistoricalDeals[0].enterpriseScale).toBe(
      '大企業（従業員数1000人以上）'
    );
    expect(result.sourceHistoricalDeals[0].purchaseAmount).toBe(5000000);
    expect(result.explanationPlaceholder).toBe(
      '詳細な根拠説明は利用できません'
    );
    expect(result.visibilityStatus).toBe('success');
  });
});