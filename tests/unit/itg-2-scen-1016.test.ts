import { validate } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1016
  test('提案内容の提案金額項目が欠けている場合に検証エラーとして拒否される', () => {
    const proposal_content = {
      proposal_id: 'PROP-001',
      proposal_name: 'システム導入提案',
      proposal_amount: undefined,
    };

    const result = validate(proposal_content);

    expect(result.is_valid).toBe(false);
    expect(result.error_code).toBe('VALIDATION_ERROR_MISSING_PROPOSAL_AMOUNT');
    expect(result.error_message).toBe('提案金額は必須項目です');
    expect(result.target_field).toBe('proposal_amount');
    expect(result.is_approved).toBe(false);
  });
});