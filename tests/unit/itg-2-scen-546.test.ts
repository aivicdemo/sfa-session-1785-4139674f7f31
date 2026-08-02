import { detectCustomerDuplicateAndClassify } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-546
  test('信頼度スコアが統合判定閾値（0.85）と完全に一致するとき、統合可能と判定される', () => {
    const customer_a = {
      customer_id: 'CUST001',
      customer_name: 'Acme Corporation',
      postal_code: '100-0001',
      address: 'Tokyo, Chiyoda Ward',
      phone: '03-1234-5678',
      email: 'contact@acme.example.com',
      industry: 'IT',
      employee_count: 500,
    };

    const customer_b = {
      customer_id: 'CUST002',
      customer_name: 'ACME Corp',
      postal_code: '100-0001',
      address: 'Tokyo, Chiyoda Ward',
      phone: '03-1234-5678',
      email: 'info@acme.example.com',
      industry: 'IT',
      employee_count: 495,
    };

    const merge_threshold = 0.85;

    const result = detectCustomerDuplicateAndClassify(
      customer_a,
      customer_b,
      merge_threshold
    );

    expect(result.can_merge).toBe(true);
    expect(result.confidence_score).toBe(0.85);
    expect(result.status_code).toBe('threshold_met');
  });
});