import { detectDuplicateAndInconsistency } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-342
  test('顧客名が完全一致している場合、重複候補スコアが加算される', () => {
    const customerA = {
      customer_id: 'CUST_001',
      customer_name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const customerB = {
      customer_id: 'CUST_002',
      customer_name: '山田太郎',
      address: '大阪府大阪市',
      phone: '090-9876-5432',
    };

    const result = detectDuplicateAndInconsistency([customerA, customerB]);

    expect(result).toHaveProperty('duplicate_candidates');
    expect(Array.isArray(result.duplicate_candidates)).toBe(true);
    expect(result.duplicate_candidates.length).toBeGreaterThan(0);

    const candidatePair = result.duplicate_candidates.find(
      (pair: any) =>
        (pair.customer_id_1 === customerA.customer_id &&
          pair.customer_id_2 === customerB.customer_id) ||
        (pair.customer_id_1 === customerB.customer_id &&
          pair.customer_id_2 === customerA.customer_id)
    );

    expect(candidatePair).toBeDefined();
    expect(candidatePair.duplicate_score).toBeGreaterThanOrEqual(5);
    expect(candidatePair.duplicate_score).toBeLessThanOrEqual(10);
    expect(candidatePair).toHaveProperty('match_reasons');
    expect(Array.isArray(candidatePair.match_reasons)).toBe(true);
    expect(candidatePair.match_reasons).toContain('name_exact_match');
  });
});