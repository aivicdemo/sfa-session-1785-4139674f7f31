import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1089
  test('営業担当者のユーザーID が null のとき、推奨生成処理がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newProposalData = {
      customerId: 'C001',
      customerName: '株式会社テスト',
      industry: '製造業',
      companySize: 'large',
      budget: 5000000,
      proposalDate: '2024-01-15T10:00:00Z',
    };

    expect(() => {
      generateRecommendation(
        null,
        newProposalData,
        mockAIEngine,
      );
    }).toThrow(/ユーザーID/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});