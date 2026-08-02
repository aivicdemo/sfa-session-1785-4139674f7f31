import { detectDuplicateAndJudgeIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-149
  test('複数の正規化ルールが同一レコードに順序通り適用される', () => {
    const normalizationRules = [
      {
        rule_id: 'rule_001',
        rule_name: 'スペース除去',
        rule_type: 'remove_whitespace',
        pattern: ' ',
        replacement: '',
        priority: 1,
        is_active: true,
      },
      {
        rule_id: 'rule_002',
        rule_name: '大文字統一',
        rule_type: 'uppercase',
        pattern: null,
        replacement: null,
        priority: 2,
        is_active: true,
      },
      {
        rule_id: 'rule_003',
        rule_name: '特殊文字削除',
        rule_type: 'remove_special_chars',
        pattern: '-',
        replacement: '',
        priority: 3,
        is_active: true,
      },
    ];

    const testRecord = {
      customer_id: 'CUST_001',
      customer_name: ' ABC - def ',
      customer_kana: 'アビシー',
      postal_code: '100-0001',
      address: 'Tokyo',
      phone: '09012345678',
      email: 'test@example.com',
      industry: 'IT',
      created_at: new Date('2024-01-15T10:00:00Z'),
      updated_at: new Date('2024-01-15T10:00:00Z'),
    };

    const result = detectDuplicateAndJudgeIntegration({
      records: [testRecord],
      normalization_rules: normalizationRules,
      duplicate_detection_threshold: 0.95,
    });

    expect(result).toEqual({
      normalized_records: [
        {
          customer_id: 'CUST_001',
          customer_name: 'ABCDEF',
          customer_kana: 'アビシー',
          postal_code: '100-0001',
          address: 'Tokyo',
          phone: '09012345678',
          email: 'test@example.com',
          industry: 'IT',
          created_at: new Date('2024-01-15T10:00:00Z'),
          updated_at: new Date('2024-01-15T10:00:00Z'),
        },
      ],
      normalization_history: [
        {
          record_id: 'CUST_001',
          field_name: 'customer_name',
          original_value: ' ABC - def ',
          step_1_result: 'ABC-def',
          step_2_result: 'ABC-DEF',
          step_3_result: 'ABCDEF',
          applied_rules: ['rule_001', 'rule_002', 'rule_003'],
        },
      ],
      duplicate_candidates: [],
      integration_judgment: {
        has_duplicates: false,
        duplicate_count: 0,
        integration_targets: [],
      },
    });
  });
});