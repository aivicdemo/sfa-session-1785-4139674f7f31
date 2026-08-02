import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-917
  test('提案内容の提案作成日の形式が不正なとき形式エラーを検出する', () => {
    const invalidProposalContent = {
      proposal_id: 'PROP-001',
      proposal_date: '2024/13/45',
      customer_id: 'CUST-001',
      product_name: 'Product A',
      amount: 100000,
    };

    const result = validateProposalContent(invalidProposalContent);

    expect(result.error_code).toBe('INVALID_DATE_FORMAT');
    expect(result.error_message).toBe('提案作成日の形式が不正です。YYYY-MM-DD形式で入力してください');
    expect(result.is_valid).toBe(false);
  });
});