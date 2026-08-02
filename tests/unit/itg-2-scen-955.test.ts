import { validateProposal } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-955
  test('提案内容が複数項目欠けているとき全欠落項目のエラーが返される', () => {
    const proposal = {
      proposalId: 'PROP-001',
      customerId: 'CUST-123'
    };

    expect(() => validateProposal(proposal)).toThrow(/顧客名|提案金額|納期|提案理由|VALIDATION_ERROR_MULTIPLE_FIELDS_REQUIRED/);
  });
});