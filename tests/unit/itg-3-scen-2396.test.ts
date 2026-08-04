import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨根拠の可視化機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-2396
  test('[error] 推論精度スコア算出機能 - AIエージェント推論の出力形式が不正のとき、エラーが発生する', () => {
    const aiRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendation: 'invalid_structure',
        // 必須フィールド 'reasoning' が欠落
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        // evaluatePatternRelevance の出力が不正な形式（JSON スキーマ違反）
        score: 'not_a_number',
        isRelevant: 'yes',
        // 必須フィールド 'evidence' が欠落
      }),
    };

    const dealCondition = {
      customerId: 'CUST-001',
      industryType: 'manufacturing',
      companyScale: 'large',
      dealStage: 'negotiation',
    };

    expect(() => {
      evaluatePatternRelevance(dealCondition, aiRecommendationEngine);
    }).toThrow(/推論結果の出力形式が不正/);
  });
});