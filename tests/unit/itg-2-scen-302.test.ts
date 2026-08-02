import { detectDeviationPattern } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 乖離パターン検出', () => {
  // SCEN-302
  test('初回接触が遅く・提案が早いとき、前半停滞・後半加速パターンとして検出される', () => {
    const contract_start_date = new Date('2024-01-01T00:00:00Z');
    const first_contact_date = new Date('2024-01-31T00:00:00Z');
    const proposal_date = new Date('2024-02-05T00:00:00Z');

    const deal_data = {
      deal_id: 'DEAL-001',
      contract_start_date,
      first_contact_date,
      proposal_date,
      contract_date: new Date('2024-02-20T00:00:00Z'),
    };

    const result = detectDeviationPattern(deal_data);

    expect(result.pattern_type).toBe('LATE_CONTACT_EARLY_PROPOSAL');
    expect(result.pattern_classification).toBe('前半停滞・後半加速');
    expect(result.days_to_first_contact).toBe(30);
    expect(result.days_proposal_to_first_contact).toBe(5);
    expect(result.is_deviation_detected).toBe(true);
  });
});