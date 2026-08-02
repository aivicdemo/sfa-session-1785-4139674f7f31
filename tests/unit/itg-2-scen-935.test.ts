import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-935
  test('[error] 提案内容検証機能 - 提案金額が未入力のとき検証エラーが返される', () => {
    const input = {
      proposalName: 'システム導入提案',
      customerName: '株式会社テスト',
      proposalDate: '2024-01-15',
      proposalAmount: ''
    };

    const result = validateProposalContent(input);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toEqual({
      field: 'proposalAmount',
      message: '提案金額は必須項目です'
    });
  });
});