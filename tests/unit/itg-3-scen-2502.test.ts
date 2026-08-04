import { describe, test, expect, beforeEach } from '@jest/globals';

describe('成功パターンテンプレート設計機能', () => {
  // SCEN-2502
  test('失敗要因が空配列のとき、テンプレート生成がエラーになる', () => {
    // Arrange: テスト対象の成功パターンテンプレート設計機能を初期化
    const { designSuccessPatternTemplate } = require('../../src/logic/it-1-br-3-1-1-1');

    // AIRecommendationEngineをモック化
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 顧客情報の正常な値
    const customerInfo = {
      customerId: 'cust_001',
      industry: 'IT',
      companySize: 'large',
      budget: 5000000,
    };

    // 商談条件の正常な値
    const dealCondition = {
      dealId: 'deal_001',
      stage: 'proposal',
      expectedCloseDate: new Date('2024-12-31'),
      productCategory: 'cloud_service',
    };

    // 成功要因の正常な値
    const successFactors = [
      {
        factor: 'decision_maker_alignment',
        weight: 0.3,
        description: '経営層への説得成功',
      },
      {
        factor: 'budget_match',
        weight: 0.4,
        description: '予算内の提案',
      },
    ];

    // 失敗要因を空配列に設定
    const failureFactors = [];

    // Act & Assert: テンプレート生成メソッドを実行してエラーを期待
    expect(() =>
      designSuccessPatternTemplate(
        mockAIRecommendationEngine,
        customerInfo,
        dealCondition,
        successFactors,
        failureFactors
      )
    ).toThrow(/失敗要因|failureFactors|空配列/);
  });
});