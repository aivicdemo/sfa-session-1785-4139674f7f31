import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 標準プロセス遵守度スコア計算', () => {
  // SCEN-294
  test('全4ステップが標準プロセスと一致するとき、総スコアが満点（100）になる', () => {
    const salesData = {
      step1_initial_contact: {
        executed: true,
        aligned_with_standard: true,
        contact_date: '2024-01-15',
        contact_method: 'email',
      },
      step2_proposal_submission: {
        executed: true,
        aligned_with_standard: true,
        submission_date: '2024-01-20',
        proposal_content_type: 'standard_template',
      },
      step3_quotation_presentation: {
        executed: true,
        aligned_with_standard: true,
        quotation_date: '2024-01-25',
        quotation_format: 'standard_format',
      },
      step4_contract_execution: {
        executed: true,
        aligned_with_standard: true,
        contract_date: '2024-02-01',
        contract_type: 'standard_contract',
      },
    };

    const result = calculateProcessComplianceScore(salesData);

    expect(result.total_score).toBe(100);
    expect(result.step1_score).toBe(25);
    expect(result.step2_score).toBe(25);
    expect(result.step3_score).toBe(25);
    expect(result.step4_score).toBe(25);
    expect(result.compliance_level).toBe('perfect');
  });
});