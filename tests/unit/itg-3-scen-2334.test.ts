import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2334: 推奨根拠データが0件のとき説明文が生成されない', () => {
    // Arrange: 推奨根拠データが0件の入力
    const emptyRecommendationBasis: Array<{
      patternId: string;
      matchScore: number;
      similarityReason: string;
    }> = [];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act: explainRecommendationReasoningメソッドを呼び出し
    const result = explainRecommendationReasoning(
      emptyRecommendationBasis,
      mockAIEngine
    );

    // Assert: 戻り値がnull、undefined、または空文字列であることを確認
    expect(
      result === null ||
        result === undefined ||
        result === ''
    ).toBe(true);

    // Assert: スキップ理由がシステムログに記録されていることを確認
    const logEntry = console.log as jest.Mock;
    const hasSkipLog = logEntry.mock.calls.some((call: any[]) =>
      /推奨根拠データが0件のため説明文生成をスキップ/.test(
        call[0]?.toString() || ''
      )
    );

    expect(hasSkipLog).toBe(true);
  });
});