import { describe, test, expect, beforeEach } from '@jest/globals';
import { displayRecommendationRationale } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1578
  test('根拠情報の信頼度スコアが100を超える値のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(101),
    };

    const dealCondition = {
      customer_id: 'CUST-001',
      customer_name: '株式会社サンプル',
      industry: 'IT',
      company_scale: 'large',
      business_issue: 'デジタル変革',
      deal_amount: 5000000,
      deal_stage: 'proposal',
      proposal_type: 'new_product',
    };

    expect(() => {
      displayRecommendationRationale(dealCondition, mockAIRecommendationEngine);
    }).toThrow(/信頼度スコア/);
  });
});