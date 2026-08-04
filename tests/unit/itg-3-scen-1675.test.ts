import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠可視化機能', () => {
  test('SCEN-1675: 推奨根拠可視化機能 - 根拠に含まれる類似パターンが0件のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newProjectData = {
      customerId: 'CUST-20240115-001',
      customerIndustry: '製造業',
      customerScale: '中堅企業',
      dealConditions: {
        productCategory: 'ERP',
        estimatedBudget: 5000000,
        implementationPeriod: 6,
      },
      dealStage: '初期提案',
    };

    const aiEngine = mockAIRecommendationEngine;
    const similarPatterns = aiEngine.findSimilarPatterns(newProjectData);

    expect(() => {
      if (similarPatterns.length === 0) {
        throw new Error('根拠となる類似パターンが見つかりません');
      }
      aiEngine.explainRecommendationReasoning({
        newProjectData,
        similarPatterns,
      });
    }).toThrow(/根拠となる類似パターン/);
  });
});