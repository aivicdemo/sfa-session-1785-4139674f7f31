import { generateTemplate } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2513
  test('失敗パターンがnullのときテンプレート生成がエラーになる', () => {
    const successPatterns = {
      strategies: [
        {
          id: 'strategy_001',
          name: '初回提案タイミング最適化',
          description: '顧客接触後3日以内の初回提案が成功率80%以上',
          conditions: {
            industry: ['製造業', 'IT'],
            companySize: ['中規模', '大規模'],
            purchasePhase: ['初期検討'],
          },
          actions: ['資料送付', '担当者紹介', 'デモンストレーション'],
          successRate: 0.82,
          sampleSize: 145,
        },
      ],
      metrics: [
        {
          id: 'metric_proposal_timing',
          name: '提案タイミング',
          description: '初回接触から提案実施までの日数',
          unit: 'days',
          targetRange: { min: 1, max: 3 },
        },
      ],
    };

    const failurePatterns = null;

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      generateTemplate(successPatterns, failurePatterns, mockAIEngine);
    }).toThrow(/失敗パターン/);
  });
});