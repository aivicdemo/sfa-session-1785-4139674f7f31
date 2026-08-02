import { detectCustomerDuplicatesAndNormalize } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-612
  test('重複候補0件の場合、統合判定結果が空配列で返される', () => {
    const duplicateCandidates = [];
    const normalizationRules = [
      {
        rule_id: 'NR001',
        rule_name: '顧客名正規化',
        pattern: 'name_normalization',
        priority: 1,
        is_active: true
      }
    ];
    const qualityRules = [
      {
        rule_id: 'QR001',
        rule_name: '名前必須チェック',
        target_field: 'customer_name',
        validation_type: 'required',
        is_active: true
      }
    ];

    const result = detectCustomerDuplicatesAndNormalize({
      duplicate_candidates: duplicateCandidates,
      normalization_rules: normalizationRules,
      quality_rules: qualityRules
    });

    expect(result).toEqual([]);
  });
});