import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1557
  test('類似顧客マッチング処理 - 現在の提案内容データが空のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
    };

    expect(() => {
      findSimilarPatterns(null, mockAIRecommendationEngine);
    }).toThrow(/提案内容データが存在しません/);
  });
});