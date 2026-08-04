import { evaluateProposalAgainstCustomerConstraints } from '../../src/logic/it-1-br-3-3-2-1';

describe('顧客制約条件との照合機能 - 提案の合計金額が顧客の購入上限ちょうどのとき', () => {
  test('SCEN-1170: 提案金額が購入上限とちょうど一致する場合、適用可能と判定する', () => {
    // 顧客制約条件を設定：購入上限金額 = 500,000円
    const customerConstraint = {
      customerId: 'CUST-20240115-001',
      purchaseUpperLimitAmount: 500000,
      allowedProductCategories: ['CAT-A', 'CAT-B'],
      purchaseFrequencyLimitPerYear: 4,
    };

    // テスト用の提案内容を作成：合計金額 = 500,000円（購入上限とちょうど一致）
    const proposal = {
      proposalId: 'PROP-20240115-001',
      customerId: 'CUST-20240115-001',
      totalAmount: 500000,
      proposalItems: [
        {
          itemId: 'ITEM-001',
          productCategory: 'CAT-A',
          quantity: 1,
          unitPrice: 250000,
          subtotal: 250000,
        },
        {
          itemId: 'ITEM-002',
          productCategory: 'CAT-B',
          quantity: 1,
          unitPrice: 250000,
          subtotal: 250000,
        },
      ],
      proposalDate: new Date('2024-01-15T10:00:00Z'),
    };

    // AIRecommendationEngineをスタブに差し替え、成功レスポンスを返却するよう設定
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 85,
        isApplicable: true,
      }),
    };

    // 照合機能を実行し、提案の合計金額（500,000円）と顧客の購入上限（500,000円）を比較
    const result = evaluateProposalAgainstCustomerConstraints(
      proposal,
      customerConstraint,
      mockAIEngine
    );

    // 照合結果のステータスと判定フラグを検証
    // 期待結果：適用可能フラグが true
    expect(result.isApplicable).toBe(true);

    // 期待結果：判定理由が『提案金額がちょうど購入上限に一致している』
    expect(result.evaluationReason).toBe('提案金額がちょうど購入上限に一致している');

    // 期待結果：照合ステータスコードが 'WITHIN_BUDGET_EXACT_MATCH'
    expect(result.evaluationStatusCode).toBe('WITHIN_BUDGET_EXACT_MATCH');

    // 期待結果：提案の合計金額が顧客の購入上限と一致していることを確認
    expect(result.proposalTotalAmount).toBe(500000);
    expect(result.customerPurchaseUpperLimit).toBe(500000);
    expect(result.remainingBudget).toBe(0);
  });
});