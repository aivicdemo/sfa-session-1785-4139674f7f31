import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2276
  test('推奨根拠テーブルが空のとき、根拠内容の表示がエラーになる', () => {
    const recommendationId = 'REC-20240115-001';
    
    const mockReasoningData: Array<{
      id: string;
      recommendationId: string;
      reasoningContent: string;
      dataSource: string;
      confidenceScore: number;
    }> = [];

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: recommendationId,
        proposedApproach: 'テスト提案アプローチ',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(null),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(75),
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = explainRecommendationReasoning(
      recommendationId,
      mockReasoningData,
      mockAIEngine
    );

    expect(result).toEqual({
      success: false,
      errorMessage: '推奨の根拠情報が取得できませんでした',
      reasoningRecords: null,
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringMatching(/RecommendationReasoningNotFound/)
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`No reasoning records found for recommendation ID: ${recommendationId}`))
    );

    consoleErrorSpy.mockRestore();
  });
});