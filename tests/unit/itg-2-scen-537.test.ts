import { detectDuplicateCustomersAndClassify } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-537
  test('企業名の不整合パターンに該当するデータが検出され、正規化ルール適用前後で分類される', () => {
    const test_data_before_normalization = [
      {
        customer_id: 'CUST_001',
        company_name: '株式会社ABC',
        company_name_kana: 'カブシキガイシャエービーシー',
        postal_code: '100-0001',
        prefecture: '東京都',
        municipality: '千代田区',
      },
      {
        customer_id: 'CUST_002',
        company_name: '(株)ABC',
        company_name_kana: 'カブシキガイシャエービーシー',
        postal_code: '100-0001',
        prefecture: '東京都',
        municipality: '千代田区',
      },
    ];

    const normalization_rule = {
      rule_id: 'NORM_RULE_001',
      rule_name: '企業名表記揺れ統一ルール',
      target_field: 'company_name',
      pattern_type: 'regex_replacement',
      replacements: [
        {
          from_pattern: '^\\(株\\)',
          to_value: '株式会社',
        },
      ],
    };

    const result = detectDuplicateCustomersAndClassify(
      test_data_before_normalization,
      normalization_rule
    );

    // 不整合パターン検出前の分類結果検証
    expect(result.classification_before_normalization).toEqual({
      duplicate_group_id: null,
      classification_status: '分類済み：不整合パターン検出',
      detected_pattern_type: '企業名表記揺れ',
      customer_records: [
        {
          customer_id: 'CUST_001',
          company_name: '株式会社ABC',
          mismatch_reason: '企業名表記形式の不整合',
        },
        {
          customer_id: 'CUST_002',
          company_name: '(株)ABC',
          mismatch_reason: '企業名表記形式の不整合',
        },
      ],
      record_count: 2,
    });

    // 正規化ルール適用後の分類結果検証
    expect(result.classification_after_normalization).toEqual({
      duplicate_group_id: 'DUP_GRP_001',
      classification_status: '統合対象確定',
      normalized_company_name: '株式会社ABC',
      customer_records: [
        {
          customer_id: 'CUST_001',
          normalized_company_name: '株式会社ABC',
        },
        {
          customer_id: 'CUST_002',
          normalized_company_name: '株式会社ABC',
        },
      ],
      record_count: 2,
      match_score: 100,
    });

    // 統合判定履歴の記録検証
    expect(result.integration_judgment_history).toEqual({
      integration_history_id: expect.any(String),
      duplicate_group_id: 'DUP_GRP_001',
      judgment_type: '正規化ルール適用による自動統合',
      judgment_result: '統合対象確定',
      source_records: [
        {
          customer_id: 'CUST_001',
          company_name: '株式会社ABC',
        },
        {
          customer_id: 'CUST_002',
          company_name: '(株)ABC',
        },
      ],
      target_company_name: '株式会社ABC',
      applied_normalization_rule_id: 'NORM_RULE_001',
      judgment_timestamp: expect.any(String),
      judgment_reason: '正規化ルール適用後、企業名が完全一致した為、統合対象と判定',
    });
  });
});