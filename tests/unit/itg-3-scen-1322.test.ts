import { evaluateProposalConformity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  test('SCEN-1322: 予算制約値が提案金額より1単位下回るとき、適合判定が否定で返される', () => {
    // Arrange: AIRecommendationEngineのスタブを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalAmount: 100000,
        recommendedApproach: '顧客ニーズに基づいた提案',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 顧客制約条件の設定
    const customerConstraint = {
      customerId: 'CUST001',
      budgetLimit: 99999,
      maxPurchaseFrequency: 'monthly',
      allowedProductCategories: ['category_a', 'category_b'],
    };

    // 提案内容（AIエージェントから生成されたもの）
    const proposalContent = {
      proposalAmount: 100000,
      recommendedApproach: '顧客ニーズに基づいた提案',
      confidenceScore: 85,
    };

    // Act: 照合機能を実行
    const conformityResult = evaluateProposalConformity(
      proposalContent,
      customerConstraint,
      mockAIEngine
    );

    // Assert: 適合判定が不適合（false）で返される
    expect(conformityResult.conformityJudgment).toBe(false);

    // 理由メッセージに予算制約条件の詳細が含まれることを確認
    expect(conformityResult.reasonMessage).toMatch(/予算制約条件/);
    expect(conformityResult.reasonMessage).toMatch(/99,?999/);
    expect(conformityResult.reasonMessage).toMatch(/100,?000/);
    expect(conformityResult.reasonMessage).toMatch(/下回る/);
    expect(conformityResult.reasonMessage).toMatch(/満たしていません/);
  });
});