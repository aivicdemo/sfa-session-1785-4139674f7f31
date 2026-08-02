import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-940
  test('提案金額が小数点第2位を超えるとき検証エラーが返される', () => {
    const input = {
      proposalAmount: 1000.125,
      proposalContent: 'テスト提案',
      customerId: 'CUST001',
      proposalDate: '2024-01-15',
    };

    const result = validateProposalContent(input);

    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('INVALID_PROPOSAL_AMOUNT_PRECISION');
    expect(result.errorMessage).toBe('提案金額は小数点第2位までで入力してください');
  });
});