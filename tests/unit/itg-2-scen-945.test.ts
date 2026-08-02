import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-945
  test('提案内容検証機能 - 顧客IDが空文字列のとき検証エラーが返される', () => {
    const input = {
      customerId: '',
      proposalName: '新規システム導入提案',
      amount: 5000000,
      proposalDate: '2024-01-15',
      description: '顧客の業務効率化を実現するための提案'
    };

    const result = validateProposalContent(input);

    expect(result.status).toBe('検証失敗');
    expect(result.errorCode).toBe('CUST_ID_EMPTY');
    expect(result.errorMessage).toBe('顧客IDは必須項目です');
    expect(result.isValid).toBe(false);
  });
});