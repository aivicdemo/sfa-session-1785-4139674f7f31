import { validateProposalData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1015
  test('提案内容の顧客ID項目が欠けている場合に検証エラーとして拒否される', () => {
    const proposalDataMissingCustomerId = {
      proposal_id: 'PROP-20240115-001',
      proposal_date: '2024-01-15',
      amount: 500000,
    };

    const validationResult = validateProposalData(proposalDataMissingCustomerId);

    expect(validationResult.is_valid).toBe(false);
    expect(validationResult.error_code).toBe('MISSING_REQUIRED_FIELD');
    expect(validationResult.message).toMatch(/顧客ID/);
    expect(validationResult.status).toBe('rejected');
  });
});