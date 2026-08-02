import { validateProposal } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-947
  test('[error] 提案内容検証機能 - 提案タイトルが空文字列のとき検証エラーが返される', () => {
    const proposal = {
      title: '',
      description: 'Test description',
      customerId: 'CUST001',
      amount: 100000,
      status: 'draft'
    };

    const result = validateProposal(proposal);

    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('PROPOSAL_TITLE_REQUIRED');
    expect(result.error?.message).toBe('提案タイトルは必須項目です');
    expect(result.error?.field).toBe('title');
  });
});