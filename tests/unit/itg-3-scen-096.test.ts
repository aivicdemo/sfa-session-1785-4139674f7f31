import { executeRecommendationWithDataValidation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 学習データ最小要件検証', () => {
  test('SCEN-096: 学習データが最小要件を満たさない場合に推論実行が保留される', () => {
    const minimumTrainingDataRequirement = 100;
    const currentTrainingDataCount = 99;
    const newCaseInput = {
      customerId: 'CUST-20240115-001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      dealValue: 5000000,
      dealStage: 'discovery',
      dealConditions: {
        budgetApproved: true,
        decisionMakerEngaged: false,
        proposalTimeline: 30,
      },
    };

    const aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationStateTable = [];

    const result = executeRecommendationWithDataValidation(
      newCaseInput,
      currentTrainingDataCount,
      minimumTrainingDataRequirement,
      aiEngineStub,
      recommendationStateTable
    );

    expect(result.statusCode).toBe(202);
    expect(result.internalStatus).toBe('PENDING_DATA_REQUIREMENT');
    expect(aiEngineStub.generateRecommendation).not.toHaveBeenCalled();
    expect(recommendationStateTable.length).toBe(1);
    expect(recommendationStateTable[0].description).toBe(
      '学習データ不足により推論待機中'
    );
    expect(recommendationStateTable[0].holdReasonCode).toBe(
      'INSUFFICIENT_TRAINING_DATA'
    );
    expect(result.userMessage).toBe(
      '推奨を生成するために必要な学習データがまだ集積されていません。データ集積後に再度お試しください'
    );
  });
});