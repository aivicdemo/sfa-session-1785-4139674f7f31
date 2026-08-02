import { applyNormalizationRules } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-509: [normal] 顧客データ重複検知・統合判定機能 - 正規化ルール適用で住所の表記ゆれが統一される', () => {
    const input_datasets = [
      {
        customer_id: 'A',
        address: '東京都渋谷区道玄坂１－２－３'
      },
      {
        customer_id: 'B',
        address: '東京都渋谷区道玄坂1-2-3'
      },
      {
        customer_id: 'C',
        address: '東京都渋谷区道玄坂１ー２ー３'
      }
    ];

    const normalization_rules = [
      {
        rule_id: 'full_to_half_digit',
        pattern: /[０-９]/g,
        replacement: (match: string) => {
          const full_digit_map: { [key: string]: string } = {
            '０': '0', '１': '1', '２': '2', '３': '3', '４': '4',
            '５': '5', '６': '6', '７': '7', '８': '8', '９': '9'
          };
          return full_digit_map[match] || match;
        },
        target_field: 'address'
      },
      {
        rule_id: 'hyphen_to_dash_unified',
        pattern: /[ー\-]/g,
        replacement: '-',
        target_field: 'address'
      }
    ];

    const result = applyNormalizationRules(input_datasets, normalization_rules);

    const expected_normalized_address = '東京都渋谷区道玄坂1-2-3';

    expect(result).toHaveLength(3);
    expect(result[0].address).toBe(expected_normalized_address);
    expect(result[1].address).toBe(expected_normalized_address);
    expect(result[2].address).toBe(expected_normalized_address);

    const all_normalized_identical = result.every(
      (record) => record.address === expected_normalized_address
    );
    expect(all_normalized_identical).toBe(true);
  });
});