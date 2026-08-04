import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-199
  test('[normal] 推奨内容に対して根拠情報が1件存在するとき、その根拠が正常に可視化される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        recommendationContent: {
          approach: '段階的な導入提案を実施',
          proposedActions: ['初期段階での小規模パイロット実施', 'ROI測定と拡大判断'],
          confidenceScore: 0.92,
        },
        reasoningBases: [
          {
            id: 'basis-001',
            type: 'pastSuccessPattern',
            title: '同業種での段階的導入成功事例',
            description: '製造業A社での3段階導入により、初期投資を30%削減しつつ6ヶ月で価値実現',
            relevanceScore: 0.88,
            matchedConditions: [
              '業種: 製造業',
              '企業規模: 1000-5000人',
              '予算制約: 中程度',
              '導入期間: 6-12ヶ月',
            ],
          },
        ],
      }),
    };

    const testInput = {
      customerId: 'cust-123',
      customerIndustry: '製造業',
      customerSize: '2500人',
      dealStatus: 'initial_contact',
      customerNeeds: ['コスト削減', 'ROI最大化'],
      budgetConstraint: '中程度',
      implementationTimeline: '6-12ヶ月',
    };

    const result = generateRecommendation(
      testInput,
      mockAIRecommendationEngine,
    );

    expect(result).toHaveProperty('recommendationId', 'rec-001');
    expect(result).toHaveProperty('recommendationContent');
    expect(result.recommendationContent).toEqual({
      approach: '段階的な導入提案を実施',
      proposedActions: ['初期段階での小規模パイロット実施', 'ROI測定と拡大判断'],
      confidenceScore: 0.92,
    });

    expect(result).toHaveProperty('reasoningBases');
    expect(result.reasoningBases).toHaveLength(1);

    const basis = result.reasoningBases[0];
    expect(basis).toEqual({
      id: 'basis-001',
      type: 'pastSuccessPattern',
      title: '同業種での段階的導入成功事例',
      description: '製造業A社での3段階導入により、初期投資を30%削減しつつ6ヶ月で価値実現',
      relevanceScore: 0.88,
      matchedConditions: [
        '業種: 製造業',
        '企業規模: 1000-5000人',
        '予算制約: 中程度',
        '導入期間: 6-12ヶ月',
      ],
    });

    expect(basis.id).toBe('basis-001');
    expect(basis.type).toBe('pastSuccessPattern');
    expect(basis.title).toBe('同業種での段階的導入成功事例');
    expect(basis.description).toContain('製造業A社');
    expect(basis.relevanceScore).toBe(0.88);
    expect(basis.matchedConditions).toContain('業種: 製造業');
    expect(basis.matchedConditions).toContain('企業規模: 1000-5000人');
    expect(basis.matchedConditions).toContain('予算制約: 中程度');
    expect(basis.matchedConditions).toContain('導入期間: 6-12ヶ月');

    const visualizationData = {
      recommendationTitle: result.recommendationContent.approach,
      reasoningBases: result.reasoningBases.map((base: any) => ({
        title: base.title,
        description: base.description,
        relevanceScore: base.relevanceScore,
        conditions: base.matchedConditions,
      })),
    };

    expect(visualizationData.recommendationTitle).toBe('段階的な導入提案を実施');
    expect(visualizationData.reasoningBases[0].title).toBe('同業種での段階的導入成功事例');
    expect(visualizationData.reasoningBases[0].description).toBeTruthy();
    expect(visualizationData.reasoningBases[0].relevanceScore).toBe(0.88);
    expect(visualizationData.reasoningBases[0].conditions).toHaveLength(4);
  });
});