import { trackRecommendationResult } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容の結果追跡機能', () => {
  // SCEN-259
  test('推奨結果レコードが存在しないときに結果追跡処理がエラーになる', () => {
    const nonExistentRecommendationId = 'REC-999999';

    const mockRecommendationRepository = {
      findById: jest.fn().mockResolvedValue(null),
    };

    const error = expect(() =>
      trackRecommendationResult(
        nonExistentRecommendationId,
        mockRecommendationRepository
      )
    ).toThrow(/推奨結果/);
  });
});