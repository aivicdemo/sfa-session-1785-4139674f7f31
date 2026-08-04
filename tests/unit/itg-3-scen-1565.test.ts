import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1565
  test('[error] 類似顧客マッチング処理 - 類似度閾値が0未満のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn()
    };

    const dealCondition = {
      customerId: 'CUST001',
      industry: 'IT',
      companySize: 'large',
      budget: 5000000,
      dealStage: 'negotiation'
    };

    const similarityThreshold = -0.5;

    expect(() => {
      findSimilarPatterns(
        dealCondition,
        similarityThreshold,
        mockAIRecommendationEngine
      );
    }).toThrow(/類似度閾値|similarityThreshold/);

    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
  });
});