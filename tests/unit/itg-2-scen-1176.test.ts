import { applyNormalizationRules } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1176
  test('正規化ルール複数件を逆順で適用してデータを正規化した場合、異なる結果が返される', () => {
    const customer_data = {
      phone_number: '090-1234-5678',
      address: '東京都渋谷区',
      company_name: '株式会社ABC（東京営業所）'
    };

    const rule_a = {
      rule_id: 'rule_a',
      rule_name: '電話番号記号削除',
      target_field: 'phone_number',
      pattern: /[-]/g,
      replacement: ''
    };

    const rule_b = {
      rule_id: 'rule_b',
      rule_name: '住所都道府県統一',
      target_field: 'address',
      pattern: /東京都/g,
      replacement: 'Tokyo'
    };

    const rule_c = {
      rule_id: 'rule_c',
      rule_name: '企業名括弧削除',
      target_field: 'company_name',
      pattern: /（[^）]*）/g,
      replacement: ''
    };

    const rules_order_abc = [rule_a, rule_b, rule_c];
    const rules_order_cba = [rule_c, rule_b, rule_a];

    const result_a = applyNormalizationRules(customer_data, rules_order_abc);
    const result_b = applyNormalizationRules(customer_data, rules_order_cba);

    expect(result_a).not.toEqual(result_b);
    expect(result_a.phone_number).not.toBe(result_b.phone_number);
    expect(result_a.address).not.toBe(result_b.address);
    expect(result_a.company_name).not.toBe(result_b.company_name);
  });
});