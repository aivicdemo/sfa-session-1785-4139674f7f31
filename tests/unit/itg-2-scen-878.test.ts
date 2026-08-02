import { executeConsolidationJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-878
  test('統合判定対象の重複顧客が複数件のとき、全件を対象に統合判定が実行される', () => {
    const duplicateCustomers = [
      {
        customer_duplicate_candidate_id: 1,
        master_customer_id_1: 'CUST001',
        master_customer_id_2: 'CUST002',
        company_name_1: 'テスト商事',
        company_name_2: 'テスト商事',
        address_1: '東京都渋谷区1-1-1',
        address_2: '東京都渋谷区1-1-1',
        phone_1: '03-1234-5678',
        phone_2: '03-1234-5678',
        created_at: new Date('2024-01-01T00:00:00Z'),
      },
      {
        customer_duplicate_candidate_id: 2,
        master_customer_id_1: 'CUST002',
        master_customer_id_2: 'CUST003',
        company_name_1: 'テスト商事',
        company_name_2: 'テスト商事',
        address_1: '東京都渋谷区1-1-1',
        address_2: '東京都渋谷区1-1-1',
        phone_1: '03-1234-5678',
        phone_2: '03-1234-5678',
        created_at: new Date('2024-01-01T00:00:00Z'),
      },
      {
        customer_duplicate_candidate_id: 3,
        master_customer_id_1: 'CUST001',
        master_customer_id_2: 'CUST003',
        company_name_1: 'テスト商事',
        company_name_2: 'テスト商事',
        address_1: '東京都渋谷区1-1-1',
        address_2: '東京都渋谷区1-1-1',
        phone_1: '03-1234-5678',
        phone_2: '03-1234-5678',
        created_at: new Date('2024-01-01T00:00:00Z'),
      },
    ];

    const result = executeConsolidationJudgment(duplicateCustomers);

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty('consolidation_target_flag', true);
    expect(result[0]).toHaveProperty('consolidation_group_id');
    expect(result[0]).toHaveProperty('confidence_score');
    expect(result[1]).toHaveProperty('consolidation_target_flag', true);
    expect(result[1]).toHaveProperty('consolidation_group_id');
    expect(result[1]).toHaveProperty('confidence_score');
    expect(result[2]).toHaveProperty('consolidation_target_flag', true);
    expect(result[2]).toHaveProperty('consolidation_group_id');
    expect(result[2]).toHaveProperty('confidence_score');
    expect(result[0].consolidation_group_id).toBe(result[1].consolidation_group_id);
    expect(result[1].consolidation_group_id).toBe(result[2].consolidation_group_id);
    expect(typeof result[0].confidence_score).toBe('number');
    expect(result[0].confidence_score).toBeGreaterThanOrEqual(0);
    expect(result[0].confidence_score).toBeLessThanOrEqual(1);
    expect(typeof result[1].confidence_score).toBe('number');
    expect(result[1].confidence_score).toBeGreaterThanOrEqual(0);
    expect(result[1].confidence_score).toBeLessThanOrEqual(1);
    expect(typeof result[2].confidence_score).toBe('number');
    expect(result[2].confidence_score).toBeGreaterThanOrEqual(0);
    expect(result[2].confidence_score).toBeLessThanOrEqual(1);
  });
});