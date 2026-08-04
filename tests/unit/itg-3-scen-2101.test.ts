import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateProposalDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案内容と標準プロセスの乖離度算出', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2101
  test('提案内容が空文字列のとき、ValidationErrorが発生すること', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const emptyProposalContent = '';
    const standardProcessTemplate = {
      processSteps: ['初期接触', '提案', '交渉', '成約'],
      decisionCriteria: ['顧客ニーズ合致', '予算承認', 'スケジュール合致'],
      dataItems: ['顧客属性', '商談条件', '提案内容'],
    };

    expect(() => {
      calculateProposalDeviation(
        emptyProposalContent,
        standardProcessTemplate,
        mockAIEngine
      );
    }).toThrow(/提案内容/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});