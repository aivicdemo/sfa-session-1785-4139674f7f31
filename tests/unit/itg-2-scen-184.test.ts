import { calculateDataQualityValidationPriority } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-184
  test('検証結果の重度度スコアが閾値より1高いとき、より高い優先度が割り当てられる', () => {
    const severity_threshold = 10;
    
    const test_data_base = {
      data_id: 'test_001',
      customer_id: 'CUST_001',
      customer_name: 'テスト顧客',
      email: 'test@example.com',
      phone: '09012345678',
      address: '東京都渋谷区',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    };

    const validation_result_severity_11 = calculateDataQualityValidationPriority({
      validation_data: test_data_base,
      severity_score: 11,
      severity_threshold: severity_threshold,
    });

    const validation_result_severity_10 = calculateDataQualityValidationPriority({
      validation_data: test_data_base,
      severity_score: 10,
      severity_threshold: severity_threshold,
    });

    const priority_at_severity_11 = validation_result_severity_11.priority;
    const priority_at_severity_10 = validation_result_severity_10.priority;

    expect(priority_at_severity_11).toBeGreaterThan(priority_at_severity_10);
  });
});