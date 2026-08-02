import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-953
  test('提案内容説明が最大文字数ちょうどのとき検証に成功する', () => {
    const max_description_length = 2000;
    const description_exactly_max = 'a'.repeat(max_description_length);

    const input_proposal = {
      proposal_id: 'PROP-20240115-001',
      customer_id: 'CUST-00001',
      product_category: '営業支援ツール',
      description: description_exactly_max,
      estimated_amount: 500000,
      proposal_date: '2024-01-15T11:00:00Z'
    };

    const result = validateProposalContent(input_proposal);

    expect(result.is_valid).toBe(true);
    expect(result.error_message).toBe('');
  });
});