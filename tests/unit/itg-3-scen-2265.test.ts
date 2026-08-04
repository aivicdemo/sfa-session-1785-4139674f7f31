import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案内容と顧客対応パターン分析機能', () => {
  // SCEN-2265
  test('過去商談データが0件のとき、異常パターン検出がエラーになる', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const newCaseCondition = {
      industry: 'IT',
      budget: 5000000,
      challenge: 'システム統合',
    };

    const expectedError = {
      code: 'ERR_NO_HISTORICAL_DATA',
      message: '異常パターン検出に必要な過去商談データが存在しません',
      httpStatus: 422,
      userMessage:
        '推奨の生成に必要な過去事例データがまだ蓄積されていません。過去の取引実績が5件以上になると、より精度の高い推奨が可能になります',
    };

    expect(() =>
      findSimilarPatterns(newCaseCondition, mockAIRecommendationEngine)
    ).toThrow(/過去商談データ/);
  });
});