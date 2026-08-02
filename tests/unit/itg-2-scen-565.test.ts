import { detectAndClassifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-565
  test('正規化ルール適用時にエラーが発生した場合、エラー情報が分類結果に記録される', () => {
    const input_customer_record_1 = {
      customer_id: 'CUST001',
      customer_name: '株式会社テスト',
      kana_name: 'カブシキガイシャテスト',
      postal_code: '100-0001',
      address: '東京都千代田区丸の内1-1-1',
      phone: '03-0000-0000',
      email: 'test@example.com',
    };

    const input_customer_record_2 = {
      customer_id: 'CUST002',
      customer_name: '株式会社テスト　',
      kana_name: 'カブシキガイシャ　テスト',
      postal_code: '100-0001',
      address: '東京都千代田区丸の内1-1-1',
      phone: '03-0000-0000',
      email: 'test@example.com',
    };

    const normalization_rule_error_trigger = {
      rule_id: 'NORM_RULE_001',
      rule_type: 'INVALID_HANDLER',
      should_throw_error: true,
      error_message: 'TypeError: Cannot read property of undefined',
    };

    const result = detectAndClassifyDuplicateCustomers(
      [input_customer_record_1, input_customer_record_2],
      normalization_rule_error_trigger
    );

    expect(result).toEqual({
      error_code: 'NORMALIZATION_RULE_ERROR',
      error_message: '正規化ルール適用処理で予期しないエラーが発生しました',
      error_details: {
        original_error_message: 'TypeError: Cannot read property of undefined',
      },
      processing_status: 'FAILED',
      classification_result: null,
    });
  });
});