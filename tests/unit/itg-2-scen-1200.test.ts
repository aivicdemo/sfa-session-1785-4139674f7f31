import { describe, test, expect } from '@jest/globals';
import { categorizeValidationErrors } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1200
  test('検出問題パターンの可視化 - 複数種類の検証エラーが混在している場合、エラー種別ごとに問題パターンが分類される', () => {
    const validation_errors = [
      {
        record_id: 'REC001',
        error_type: '必須項目未入力',
        field_name: 'customer_name',
        error_message: '顧客名が未入力です'
      },
      {
        record_id: 'REC002',
        error_type: '必須項目未入力',
        field_name: 'email',
        error_message: 'メールアドレスが未入力です'
      },
      {
        record_id: 'REC003',
        error_type: 'データ型不正',
        field_name: 'phone_number',
        error_message: '電話番号の形式が不正です'
      },
      {
        record_id: 'REC004',
        error_type: 'データ型不正',
        field_name: 'postal_code',
        error_message: '郵便番号の形式が不正です'
      },
      {
        record_id: 'REC005',
        error_type: 'データ型不正',
        field_name: 'contract_date',
        error_message: '契約日の形式が不正です'
      },
      {
        record_id: 'REC006',
        error_type: '範囲外',
        field_name: 'contract_amount',
        error_message: '契約金額が範囲外です'
      }
    ];

    const result = categorizeValidationErrors(validation_errors);

    expect(result.categorized_errors).toEqual({
      '必須項目未入力': {
        count: 2,
        records: [
          {
            record_id: 'REC001',
            error_type: '必須項目未入力',
            field_name: 'customer_name',
            error_message: '顧客名が未入力です'
          },
          {
            record_id: 'REC002',
            error_type: '必須項目未入力',
            field_name: 'email',
            error_message: 'メールアドレスが未入力です'
          }
        ]
      },
      'データ型不正': {
        count: 3,
        records: [
          {
            record_id: 'REC003',
            error_type: 'データ型不正',
            field_name: 'phone_number',
            error_message: '電話番号の形式が不正です'
          },
          {
            record_id: 'REC004',
            error_type: 'データ型不正',
            field_name: 'postal_code',
            error_message: '郵便番号の形式が不正です'
          },
          {
            record_id: 'REC005',
            error_type: 'データ型不正',
            field_name: 'contract_date',
            error_message: '契約日の形式が不正です'
          }
        ]
      },
      '範囲外': {
        count: 1,
        records: [
          {
            record_id: 'REC006',
            error_type: '範囲外',
            field_name: 'contract_amount',
            error_message: '契約金額が範囲外です'
          }
        ]
      }
    });

    expect(result.total_errors).toBe(6);
    expect(result.error_category_count).toBe(3);
    expect(result.visibility_status).toBe('success');
  });
});