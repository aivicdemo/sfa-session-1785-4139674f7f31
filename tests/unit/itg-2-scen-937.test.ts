import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-937
  test('提案金額が0のとき検証エラーが返される', () => {
    const proposal_content = {
      proposal_id: 'PROP-001',
      proposal_name: 'クラウドサービス導入提案',
      customer_name: '株式会社ABC',
      proposal_date: '2024-01-15',
      proposal_amount: 0,
      proposal_description: 'クラウドサービスの導入による業務効率化',
      currency: 'JPY'
    };

    const result = validateProposalContent(proposal_content);

    expect(result.is_valid).toBe(false);
    expect(result.error_code).toBe('PROPOSAL_AMOUNT_INVALID');
    expect(result.error_message).toBe('提案金額は0より大きい値を入力してください');
  });
});