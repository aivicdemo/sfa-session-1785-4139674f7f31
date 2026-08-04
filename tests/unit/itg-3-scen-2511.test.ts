import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2511
  test('成功パターンテンプレート設計機能 - 各営業プロセスステップに失敗パターンが0件のとき、テンプレート生成がエラーになる', () => {
    const processSteps = [
      { stepId: 'INITIAL_CONTACT', stepName: '初期接触', sequence: 1 },
      { stepId: 'NEEDS_ANALYSIS', stepName: 'ニーズ分析', sequence: 2 },
      { stepId: 'PROPOSAL', stepName: '提案', sequence: 3 },
      { stepId: 'CLOSING', stepName: 'クロージング', sequence: 4 },
    ];

    const recommendedPatternMaster = [
      {
        patternId: 'PATTERN_001',
        stepId: 'INITIAL_CONTACT',
        patternType: 'SUCCESS',
        failurePatternCount: 0,
        successPatternCount: 5,
      },
      {
        patternId: 'PATTERN_002',
        stepId: 'NEEDS_ANALYSIS',
        patternType: 'SUCCESS',
        failurePatternCount: 0,
        successPatternCount: 3,
      },
      {
        patternId: 'PATTERN_003',
        stepId: 'PROPOSAL',
        patternType: 'SUCCESS',
        failurePatternCount: 0,
        successPatternCount: 4,
      },
      {
        patternId: 'PATTERN_004',
        stepId: 'CLOSING',
        patternType: 'SUCCESS',
        failurePatternCount: 0,
        successPatternCount: 2,
      },
    ];

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC_001',
        approach: 'Standard approach',
        successProbability: 0.85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      generateSuccessPatternTemplate(
        processSteps,
        recommendedPatternMaster,
        aiRecommendationEngineStub
      )
    ).toThrow(/失敗パターン/);
  });
});