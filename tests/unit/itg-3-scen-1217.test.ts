import { describe, test, expect } from '@jest/globals';
import { validateAndGenerateProposalFeasibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案妥当性確認判定', () => {
  // SCEN-1217
  test('営業プロセス条件が空文字列のとき、ValidationError例外を発生させる', () => {
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: '製造業',
      companyScale: '中堅企業',
      dealAmount: 5000000,
      dealCurrency: 'JPY',
      dealStage: '提案段階',
      salesProcessCondition: '',
      managementObjectives: ['コスト削減', '生産性向上'],
      budgetConstraint: 10000000,
      scheduleConstraint: '2024-12-31',
      aiRecommendationEngine: aiRecommendationEngineStub,
    };

    expect(() =>
      validateAndGenerateProposalFeasibility(input)
    ).toThrow(/営業プロセス条件/);
  });
});