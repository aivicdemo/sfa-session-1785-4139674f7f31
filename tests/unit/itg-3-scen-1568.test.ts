import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-1568: [error] 類似顧客マッチング処理 - 提案内容に必須フィールドが欠けているとき、エラーが発生する', () => {
    const proposalWithMissingSegment = {
      proposalId: 'PROP-001',
      customerId: 'CUST-12345',
      customerSegment: null,
      purchaseHistory: [
        {
          productId: 'PROD-A',
          purchaseDate: '2023-06-15T09:00:00Z',
          quantity: 100,
          amount: 500000,
        },
      ],
      proposedApproach: 'Consultative selling',
      proposedAmount: 750000,
    };

    expect(() => {
      findSimilarPatterns(proposalWithMissingSegment);
    }).toThrow(/customerSegment/);
  });
});