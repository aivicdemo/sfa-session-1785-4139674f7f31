import { validateProposalCustomerInteractionRecord } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 提案・顧客対応記録検証', () => {
  // SCEN-1004
  test('複数の必須項目が同時に不足している場合にすべての不足項目を含む警告が表示される', () => {
    const input = {
      customerName: '',
      proposalDate: '',
      proposalContent: '',
      assignedPerson: '',
    };

    expect(() => validateProposalCustomerInteractionRecord(input)).toThrow(
      /顧客名|提案日|提案内容|担当者/
    );
  });
});