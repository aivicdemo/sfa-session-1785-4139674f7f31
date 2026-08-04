import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2589
  test('商談完了日が欠落しているとき、例外が発生する', () => {
    const pastDealsWithMissingCompletionDate = [
      {
        dealId: 'DEAL-001',
        customerId: 'CUST-A',
        customerIndustry: 'manufacturing',
        customerSize: 'large',
        proposalApproach: 'value-based',
        outcome: 'won',
        completionDate: null,
      },
    ];

    expect(() =>
      extractSuccessPatterns(pastDealsWithMissingCompletionDate)
    ).toThrow(/completionDate|商談完了日/);
  });
});