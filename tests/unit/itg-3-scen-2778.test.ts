import { extractSuccessPatternsWithWeighting } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  // SCEN-2778
  test('過去商談データが未定義のとき、エラーを返す', () => {
    const pastDealData = undefined;
    const aiEngine = {
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = extractSuccessPatternsWithWeighting(pastDealData, aiEngine);

    expect(result).toEqual({
      errorCode: 'PAST_DEAL_DATA_UNDEFINED',
      errorMessage: 'Past deal data is required for pattern extraction',
      success: false,
    });
    expect(aiEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(aiEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});