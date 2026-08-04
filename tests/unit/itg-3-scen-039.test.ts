import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容生成機能 - 顧客情報未設定時の検証', () => {
  // SCEN-039
  test('顧客情報が未設定の場合に検証結果が正常に返される', () => {
    const input_recommendation_request = {
      customer_info: null,
      deal_amount: 500000,
      deal_stage: 'proposal',
      industry: 'manufacturing',
      company_size: 'large',
    };

    const result = generateRecommendation(input_recommendation_request);

    expect(result.is_valid).toBe(false);
    expect(result.error_code).toBe('CUSTOMER_INFO_MISSING');
    expect(result.error_message).toBe('顧客情報が設定されていません');
    expect(Array.isArray(result.validation_details)).toBe(true);
    expect(result.validation_details.length).toBeGreaterThan(0);
    expect(result.validation_details).toContain('customer_info');
    expect(result.http_status_code).toBe(400);
  });
});