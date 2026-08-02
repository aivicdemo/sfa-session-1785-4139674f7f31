import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-957
  test('[normal] 提案内容検証機能 - 提案カテゴリが指定されない場合、必須チェック対象外となる', () => {
    const proposalDataWithNullCategory = {
      proposal_id: 'PROP-001',
      customer_id: 'CUST-001',
      proposal_category: null,
      proposal_amount: 100000,
      proposal_name: 'サンプル提案',
      created_date: '2024-01-15T11:00:00Z',
    };

    const result = validateProposalContent(proposalDataWithNullCategory);

    expect(result.is_valid).toBe(true);
    expect(result.validation_errors).not.toContain(
      expect.objectContaining({
        field_name: 'proposal_category',
        error_message: expect.stringMatching(/提案カテゴリ/),
      })
    );
    expect(result.skipped_fields).toContain('proposal_category');
  });
});