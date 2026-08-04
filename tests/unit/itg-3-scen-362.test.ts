import { validateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠の可視化機能 - 精度検証', () => {
  // SCEN-362
  test('設定閾値が負数のとき、精度検証がエラーになる', () => {
    const invalidThreshold = -0.5;
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    const error = (() => {
      try {
        validateRecommendationAccuracy(invalidThreshold, mockAIRecommendationEngine);
        return null;
      } catch (e) {
        return e;
      }
    })();

    expect(error).not.toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect((error as any).name).toBe('ValidationError');
    expect((error as any).message).toBe('推奨精度の閾値は0以上1以下の値で指定してください。指定値: -0.5');
    expect((error as any).code).toBe('ERR_INVALID_THRESHOLD');
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});