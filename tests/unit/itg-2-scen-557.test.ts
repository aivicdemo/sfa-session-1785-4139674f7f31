import { classifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出・分類機能', () => {
  // SCEN-557
  test('分類機能に同じ入力データで2回連続実行したとき、同じ分類結果が返される', () => {
    const test_customer_data = {
      customer_id: 'CUST001',
      customer_name: '山田太郎',
      email_address: 'yamada@example.com',
      phone_number: '090-1234-5678',
      company_name: '株式会社サンプル',
      industry_code: '5411',
      establishment_date: '2020-01-15',
      representative_name: '山田太郎',
      postal_code: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
      address_detail: '丸の内1-1-1',
    };

    const first_classification_result = classifyDuplicateCustomers(test_customer_data);
    const second_classification_result = classifyDuplicateCustomers(test_customer_data);

    expect(first_classification_result.classification_category).toBe(
      second_classification_result.classification_category
    );
    expect(first_classification_result.confidence_score).toBe(
      second_classification_result.confidence_score
    );
    expect(first_classification_result.detected_matching_fields).toEqual(
      second_classification_result.detected_matching_fields
    );
    expect(first_classification_result.matching_reason_code).toBe(
      second_classification_result.matching_reason_code
    );
  });
});