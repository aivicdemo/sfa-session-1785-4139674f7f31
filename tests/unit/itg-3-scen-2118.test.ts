import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import * as analyzeDeviationModule from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

describe('AIエージェントの推奨根拠の可視化機能 - 提案内容と標準プロセスの乖離度算出', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-2118
  test('分析実行日時が null のとき、エラーが発生する', () => {
    const stubAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: 'test approach',
        confidence: 85,
        rationale: 'test rationale'
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('test explanation'),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.9)
    };

    const proposalContent = {
      customerIndustry: 'manufacturing',
      proposalType: 'product_sale',
      proposedAmount: 1000000,
      proposedSchedule: '2024-03-15'
    };

    const standardProcessDefinition = {
      processStep: 'initial_proposal',
      expectedApproach: 'consultative_selling',
      riskThreshold: 0.5
    };

    const analysisExecutedAt = null;
    const managerId = 'mgr_001';

    const { analyzeDeviationFromStandardProcess } = analyzeDeviationModule;

    expect(() => {
      analyzeDeviationFromStandardProcess(
        proposalContent,
        standardProcessDefinition,
        analysisExecutedAt,
        managerId,
        stubAIRecommendationEngine
      );
    }).toThrow(/analysisExecutedAt/);

    expect(stubAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});