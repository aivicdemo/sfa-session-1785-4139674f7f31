import { calculateProposalNeedsAlignment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-716
  test('提案資料の課題対応内容が空のとき、課題適合スコア計算が適切に処理される', () => {
    fetchMock.resetMocks();

    const proposal_document = {
      proposal_id: 'PROP-001',
      customer_id: 'CUST-001',
      challenge_response_content: '',
      proposal_date: '2024-01-15',
      product_category: 'サービスA',
    };

    const customer_need = {
      customer_id: 'CUST-001',
      need_category: '業務効率化',
      priority_level: 3,
      business_challenge: '顧客対応時間削減',
      budget_constraint: 500000,
    };

    const result = calculateProposalNeedsAlignment(
      proposal_document,
      customer_need
    );

    expect(result.alignment_score).toBe(0);
    expect(result.error_flag).toBe(true);
    expect(result.status_code).toBe(400);
    expect(result.error_message).toMatch(/課題対応内容は必須項目です/);
  });
});