import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-107: AIエージェント推奨支援システム - 推奨根拠の生成に失敗した場合に簡略版の説明が返却される', async () => {
    fetchMock.resetMocks();

    const recommendationPatternMaster = {
      patternId: 'TOP_001',
      description: '標準提案アプローチ',
      successRate: 85,
    };

    const newDealData = {
      customerIndustry: '製造業',
      budget: '500万円',
      decisionDeadline: '3ヶ月以内',
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error('API_TIMEOUT')),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockRejectedValue(new Error('API_ERROR')),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const result = await generateRecommendation(
      newDealData,
      mockAIEngine,
      mockFileStorage,
      [recommendationPatternMaster]
    );

    expect(result).toEqual({
      patternId: 'TOP_001',
      reasoningExplanation: '標準提案アプローチ',
      status: 'fallback_mode',
      errorMessage: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      retryAttempts: 3,
      recommendedApproach: {
        description: '標準提案アプローチ',
        successRate: 85,
      },
    });

    expect(result.status).toBe('fallback_mode');
    expect(result.reasoningExplanation).toBe('標準提案アプローチ');
    expect(result.patternId).toBe('TOP_001');
    expect(result.errorMessage).toContain('推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します');
    expect(result.retryAttempts).toBe(3);
  });
});