import { describe, test, expect } from '@jest/globals';
import { validateSalesData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-370
  test('顧客情報が複数件の場合、全件に対する検証結果が返される', () => {
    const test_customers = [
      {
        customer_id: 'C001',
        customer_name: '株式会社ABC',
        email: 'contact@abc.com',
        phone: '09012345678'
      },
      {
        customer_id: 'C002',
        customer_name: '株式会社DEF',
        email: 'info@def.co.jp',
        phone: '0312345678'
      },
      {
        customer_id: 'C003',
        customer_name: '',
        email: 'invalid-email',
        phone: '123'
      }
    ];

    const test_validation_rules = [
      {
        field: 'customer_name',
        rule_type: 'required',
        is_required: true
      },
      {
        field: 'email',
        rule_type: 'format',
        pattern: '^[^@]+@[^@]+$'
      },
      {
        field: 'phone',
        rule_type: 'digit_range',
        min_digits: 10,
        max_digits: 11
      }
    ];

    const result = validateSalesData(test_customers, test_validation_rules);

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      customer_id: 'C001',
      validation_status: 'pass',
      error_items: []
    });

    expect(result[1]).toEqual({
      customer_id: 'C002',
      validation_status: 'pass',
      error_items: []
    });

    expect(result[2]).toEqual({
      customer_id: 'C003',
      validation_status: 'fail',
      error_items: ['customer_name', 'email', 'phone']
    });
  });
});