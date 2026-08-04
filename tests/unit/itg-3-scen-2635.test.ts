import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2635
  test('推奨根拠の参照オブジェクトが存在しないとき、可視化エラーが発生する', () => {
    const nonExistentObjectId = 'obj_999999_not_found';
    const recommendationId = 'rec_12345';
    const referenceTimestamp = new Date('2024-02-15T10:30:00Z');

    const recommendationReasoning = {
      recommendationId: recommendationId,
      referencedObjectId: nonExistentObjectId,
      reasonType: 'past_success_pattern',
      timestamp: referenceTimestamp,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockErrorLogger = jest.fn();
    const mockUINotifier = jest.fn();

    expect(() => {
      visualizeRecommendationReasoning(
        recommendationReasoning,
        mockAIEngine,
        mockErrorLogger,
        mockUINotifier
      );
    }).toThrow(/参照オブジェクト/);

    expect(mockErrorLogger).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCode: 'VISUALIZATION_REFERENCE_NOT_FOUND',
        referencedObjectId: nonExistentObjectId,
        recommendationId: recommendationId,
        timestamp: referenceTimestamp,
      })
    );

    expect(mockUINotifier).toHaveBeenCalledWith(
      '推奨根拠の詳細表示に失敗しました。推奨パターンマスタから簡略版を表示します'
    );
  });
});