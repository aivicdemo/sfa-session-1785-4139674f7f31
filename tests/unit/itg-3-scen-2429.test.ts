import { evaluateRecommendationConfidence } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能 - 顧客属性情報欠落時の信頼度低下', () => {
  test('SCEN-2429: 顧客属性情報が欠落しているとき信頼度スコアが低下する', () => {
    // AIRecommendationEngine スタブ化
    const aiEngineStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85),
    };

    // テスト用顧客データ: 属性が完全な場合
    const completeCustomerData = {
      industry: 'IT',
      companySize: 'large',
      budget: 5000000,
      decisionMaker: 'CTO',
      fiscalYear: 2024,
      purchaseHistory: [{ year: 2023, amount: 2000000 }],
    };

    // テスト用商談条件データ: 完全
    const completeDealCondition = {
      customerId: 'CUST-001',
      customerData: completeCustomerData,
      proposalAmount: 3000000,
      proposalDate: new Date('2024-06-15T10:00:00Z'),
    };

    // ケース1: 属性情報が完全な場合の基準値取得
    const baselineResult = evaluateRecommendationConfidence(
      completeDealCondition,
      aiEngineStub
    );
    expect(baselineResult).toHaveProperty('confidenceScore');
    expect(typeof baselineResult.confidenceScore).toBe('number');
    expect(baselineResult.confidenceScore).toBeCloseTo(0.85, 2);

    // ケース2: 属性1項目欠落（industry が null）
    const missingOneAttribute = {
      ...completeDealCondition,
      customerData: {
        ...completeCustomerData,
        industry: null,
      },
    };
    const resultMissingOne = evaluateRecommendationConfidence(
      missingOneAttribute,
      aiEngineStub
    );
    expect(resultMissingOne.confidenceScore).toBeGreaterThanOrEqual(0.75);
    expect(resultMissingOne.confidenceScore).toBeLessThanOrEqual(0.80);

    // ケース3: 属性2項目欠落（industry と companySize が null）
    const missingTwoAttributes = {
      ...completeDealCondition,
      customerData: {
        ...completeCustomerData,
        industry: null,
        companySize: null,
      },
    };
    const resultMissingTwo = evaluateRecommendationConfidence(
      missingTwoAttributes,
      aiEngineStub
    );
    expect(resultMissingTwo.confidenceScore).toBeGreaterThanOrEqual(0.65);
    expect(resultMissingTwo.confidenceScore).toBeLessThanOrEqual(0.75);

    // ケース4: 属性3項目以上欠落
    const missingThreeOrMoreAttributes = {
      ...completeDealCondition,
      customerData: {
        ...completeCustomerData,
        industry: null,
        companySize: null,
        budget: null,
        decisionMaker: null,
      },
    };
    const resultMissingThreeOrMore = evaluateRecommendationConfidence(
      missingThreeOrMoreAttributes,
      aiEngineStub
    );
    expect(resultMissingThreeOrMore.confidenceScore).toBeLessThanOrEqual(0.65);

    // 段階的な低下を確認
    expect(baselineResult.confidenceScore).toBeGreaterThan(
      resultMissingOne.confidenceScore
    );
    expect(resultMissingOne.confidenceScore).toBeGreaterThan(
      resultMissingTwo.confidenceScore
    );
    expect(resultMissingTwo.confidenceScore).toBeGreaterThan(
      resultMissingThreeOrMore.confidenceScore
    );

    // スコアが RecommendationScore オブジェクトの confidenceScore フィールドに
    // 小数第2位までで格納されていることを確認
    expect(baselineResult).toEqual(
      expect.objectContaining({
        confidenceScore: expect.any(Number),
      })
    );
    const decimalPlaces = (baselineResult.confidenceScore.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });
});