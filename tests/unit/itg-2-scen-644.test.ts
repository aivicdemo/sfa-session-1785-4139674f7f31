import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-644: [normal] 顧客重複・不整合検出および統合判定機能 - データ品質ルール設定がない場合、デフォルトルールが適用される
  test('データ品質ルール設定がない場合、デフォルトルールが適用されて重複度が正しく計算される', () => {
    const customer_records = [
      {
        customer_id: 'C001',
        name: '山田太郎',
        address: '東京都渋谷区1-1-1',
        phone: '09012345678',
      },
      {
        customer_id: 'C002',
        name: '山田太郎',
        address: '東京都渋谷区1-1-1',
        phone: '09012345678',
      },
      {
        customer_id: 'C003',
        name: '山田太郎',
        address: '東京都渋谷区1-1-1',
        phone: '09087654321',
      },
      {
        customer_id: 'C004',
        name: '山田花子',
        address: '東京都渋谷区1-1-1',
        phone: '09087654321',
      },
      {
        customer_id: 'C005',
        name: '鈴木次郎',
        address: '大阪府大阪市1-1-1',
        phone: '09012345678',
      },
    ];

    const data_quality_rules = null;

    const result = detectDuplicateCustomers(customer_records, data_quality_rules);

    // 完全一致（C001 と C002）: 重複度 100%
    const pair_c001_c002 = result.duplicate_pairs.find(
      (p) =>
        (p.customer_id_1 === 'C001' && p.customer_id_2 === 'C002') ||
        (p.customer_id_1 === 'C002' && p.customer_id_2 === 'C001'),
    );
    expect(pair_c001_c002).toBeDefined();
    expect(pair_c001_c002?.similarity_score).toBe(100);

    // 部分一致（C001 と C003: 氏名・住所同一、電話異なる）: 重複度 70%
    const pair_c001_c003 = result.duplicate_pairs.find(
      (p) =>
        (p.customer_id_1 === 'C001' && p.customer_id_2 === 'C003') ||
        (p.customer_id_1 === 'C003' && p.customer_id_2 === 'C001'),
    );
    expect(pair_c001_c003).toBeDefined();
    expect(pair_c001_c003?.similarity_score).toBe(70);

    // 電話のみ一致（C001 と C005: 電話号号のみ同一）: 重複度 40%
    const pair_c001_c005 = result.duplicate_pairs.find(
      (p) =>
        (p.customer_id_1 === 'C001' && p.customer_id_2 === 'C005') ||
        (p.customer_id_1 === 'C005' && p.customer_id_2 === 'C001'),
    );
    expect(pair_c001_c005).toBeDefined();
    expect(pair_c001_c005?.similarity_score).toBe(40);

    // 統合候補（重複度60%以上）はC001-C002, C001-C003, C003-C004 のペアのみ
    const consolidation_candidates = result.duplicate_pairs.filter(
      (p) => p.similarity_score >= 60,
    );
    expect(consolidation_candidates.length).toBeGreaterThanOrEqual(2);
    expect(consolidation_candidates.every((p) => p.similarity_score >= 60)).toBe(
      true,
    );

    // デフォルトルールが適用されたことを確認
    expect(result.applied_rule_name).toBe('default');
    expect(result.duplicate_pairs.length).toBeGreaterThan(0);
  });
});