import { describe, test, expect } from '@jest/globals';
import { normalizeCustomerRecords } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出・統合判定機能', () => {
  // SCEN-144
  test('定義された正規化ルール複数件のとき、全ての適用対象レコードが順序通り正規化される', () => {
    const normalizationRules = [
      {
        rule_id: 'rule_1',
        priority: 1,
        field_name: 'phone_number',
        pattern: '^0',
        replacement: '',
        description: '電話番号の先頭の0を削除',
      },
      {
        rule_id: 'rule_2',
        priority: 2,
        field_name: 'company_name',
        pattern: '（[^）]*）',
        replacement: '',
        description: '企業名の括弧内テキストを削除',
      },
      {
        rule_id: 'rule_3',
        priority: 3,
        field_name: 'postal_code',
        pattern: '-',
        replacement: '',
        description: '郵便番号のハイフンを削除',
      },
    ];

    const inputRecords = [
      {
        record_id: 'A',
        phone_number: '09012345678',
        company_name: 'ABC社（東京）',
        postal_code: '100-0001',
      },
      {
        record_id: 'B',
        phone_number: '09087654321',
        company_name: 'XYZ株式会社（大阪）',
        postal_code: '530-0001',
      },
      {
        record_id: 'C',
        phone_number: '08011112222',
        company_name: 'DEF有限会社（福岡）',
        postal_code: '810-0001',
      },
    ];

    const result = normalizeCustomerRecords(inputRecords, normalizationRules);

    expect(result).toEqual([
      {
        record_id: 'A',
        phone_number: '9012345678',
        company_name: 'ABC社',
        postal_code: '1000001',
      },
      {
        record_id: 'B',
        phone_number: '9087654321',
        company_name: 'XYZ株式会社',
        postal_code: '5300001',
      },
      {
        record_id: 'C',
        phone_number: '8011112222',
        company_name: 'DEF有限会社',
        postal_code: '8100001',
      },
    ]);
  });
});