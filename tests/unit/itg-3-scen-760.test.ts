import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-760
  test('顧客データ完全性・妥当性判定機能 - 入力されたすべての必須項目が存在し、かつ商談条件マスタに照合可能なとき、推奨生成可能と判定される', () => {
    // Arrange: 商談条件マスタのモック
    const dealConditionMasters = [
      {
        masterId: 1,
        industry: '製造業',
        budgetScaleMinAmount: 10000000,
        decisionMakersMinCount: 2,
      },
      {
        masterId: 2,
        industry: '流通小売',
        budgetScaleMinAmount: 5000000,
        decisionMakersMinCount: 1,
      },
      {
        masterId: 3,
        industry: '金融',
        budgetScaleMinAmount: 50000000,
        decisionMakersMinCount: 3,
      },
    ];

    // AIRecommendationEngineのスタブ
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC001',
        status: 'READY',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    // 入力データの準備
    const inputData = {
      customerName: 'ABC株式会社',
      industry: '製造業',
      budgetScale: '2000万円',
      budgetScaleAmount: 20000000,
      decisionMakersCount: 3,
      projectPeriod: '2026年4月〜8月',
      currentChallenge: '生産効率化',
      assignedSalesPersonId: 'EMP001',
    };

    // Act
    const result = validateCustomerDataCompleteness(
      inputData,
      dealConditionMasters,
      aiEngineStub
    );

    // Assert
    expect(result.isRecommendationGenerationPossible).toBe(true);
    expect(result.matchedMasterId).toBe(1);
    expect(result.matchScore).toBe(100);
    expect(result.validationStatus).toBe('PASSED');
    expect(result.masterMatchingDetails).toEqual({
      industryMatched: true,
      budgetConditionMet: true,
      decisionMakersConditionMet: true,
    });
    expect(aiEngineStub.generateRecommendation).not.toHaveBeenCalled();
  });
});