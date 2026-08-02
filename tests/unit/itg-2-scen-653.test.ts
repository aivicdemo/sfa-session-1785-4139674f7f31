import { describe, test, expect } from '@jest/globals';
import { getRecommendationBasisVisualization } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-653: [normal] 推奨内容根拠の可視化機能 - 顧客マスタから抽出した顧客データが複数件のとき、該当顧客のデータのみが正しく組み立てられる
  test('should visualize recommendation basis for specific customer when multiple customers exist', () => {
    const testDataset = [
      {
        customer_id: 'CUST-001',
        customer_name: 'Company A',
        sales_amount: 150000,
        contract_date: '2024-01-15',
        last_contact_date: '2024-01-10',
        recommendation_type: 'Cross-sell',
        recommendation_basis: 'Previous purchase history',
      },
      {
        customer_id: 'CUST-002',
        customer_name: 'Company B',
        sales_amount: 250000,
        contract_date: '2024-02-20',
        last_contact_date: '2024-02-18',
        recommendation_type: 'Upsell',
        recommendation_basis: 'Usage frequency and expansion signal',
      },
      {
        customer_id: 'CUST-003',
        customer_name: 'Company C',
        sales_amount: 100000,
        contract_date: '2023-12-01',
        last_contact_date: '2024-01-05',
        recommendation_type: 'Renewal',
        recommendation_basis: 'Contract expiration approaching',
      },
    ];

    const targetCustomerId = 'CUST-002';
    const result = getRecommendationBasisVisualization(testDataset, targetCustomerId);

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].customer_id).toBe('CUST-002');
    expect(result[0].customer_name).toBe('Company B');
    expect(result[0].sales_amount).toBe(250000);
    expect(result[0].contract_date).toBe('2024-02-20');
    expect(result[0].last_contact_date).toBe('2024-02-18');
    expect(result[0].recommendation_type).toBe('Upsell');
    expect(result[0].recommendation_basis).toBe('Usage frequency and expansion signal');

    const allRecordsMatchTargetId = result.every(
      (record) => record.customer_id === targetCustomerId
    );
    expect(allRecordsMatchTargetId).toBe(true);

    const hasExcludedCustomers = result.some(
      (record) => record.customer_id === 'CUST-001' || record.customer_id === 'CUST-003'
    );
    expect(hasExcludedCustomers).toBe(false);
  });
});