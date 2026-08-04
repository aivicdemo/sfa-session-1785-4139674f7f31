import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2881
  test('推奨内容検証判定機能 - explainRecommendationReasoning 失敗時に簡略版根拠説明を返す', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedPatternId: 'PATTERN-2024-087',
        successProbability: 87,
        applicableExamples: 24,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PATTERN-2024-087',
          successProbability: 87,
          applicableExamples: 24,
        },
        {
          patternId: 'PATTERN-2024-086',
          successProbability: 84,
          applicableExamples: 21,
        },
        {
          patternId: 'PATTERN-2024-085',
          successProbability: 81,
          applicableExamples: 19,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('API rate limit exceeded')
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.92),
    };

    const newCaseInput = {
      customerId: 'CUST-001',
      dealStage: '提案前',
      industry: 'IT',
      companySize: 'mid-market',
    };

    const result = generateRecommendation(
      newCaseInput,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      recommendedPatternId: 'PATTERN-2024-087',
      successProbability: 87,
      applicableExamples: 24,
      reasoningExplanation:
        'PATTERN-2024-087, 成功確度: 87%, 適用事例件数: 24件',
      fallbackMode: true,
      userMessage:
        '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      errorLog:
        'explainRecommendationReasoning failed, using fallback simple reasoning from master patterns',
    });

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});