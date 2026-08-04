import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1687
  test('過去商談データが空配列のとき、エラーが発生する', () => {
    const emptyDealHistory: never[] = [];
    const currentDealCondition = {
      industry: '製造業',
      scale: 'large',
      customerChallenges: ['コスト削減', '効率化'],
    };

    const stubAiEngine = {
      findSimilarPatterns: jest.fn(() => {
        throw new ValidationError(
          '過去商談データが空です。推奨を生成するには最低1件以上の成功事例が必要です'
        );
      }),
    };

    expect(() => {
      findSimilarPatterns(emptyDealHistory, currentDealCondition, stubAiEngine);
    }).toThrow(/過去商談データが空です/);
  });
});

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}