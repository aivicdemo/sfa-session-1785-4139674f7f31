import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 類似パターン検索', () => {
  // SCEN-117
  test('検索条件が空のとき検索が実行されない', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
    };

    const emptySearchCondition = {
      customerName: '',
      industry: '',
      dealAmount: null,
      dealStage: '',
    };

    const result = findSimilarPatterns(
      emptySearchCondition,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      errorMessage: '検索条件を入力してください',
      searchResults: [],
    });
  });
});