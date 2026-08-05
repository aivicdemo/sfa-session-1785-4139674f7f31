import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('IT-1-BR-2-1-1: 月次営業品質統計分析 - 営業担当者1名の統計値算出', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-874
  test('営業担当者が1人の場合に統計値が正常に算出される', async () => {
    const { calculateSalesStatistics } = await import(
      '../../src/logic/it-1-br-2-1-1'
    );

    const testData = [
      {
        employee_id: 'EMP001',
        employee_name: '田中太郎',
        monthly_sales_amount: 5000000,
        monthly_deal_count: 25,
        monthly_contract_rate: 80,
      },
    ];

    const result = calculateSalesStatistics(testData);

    expect(result.average_sales_amount).toBe(5000000);
    expect(result.average_deal_count).toBe(25);
    expect(result.average_contract_rate).toBe(80);
    expect(result.median_sales_amount).toBe(5000000);
    expect(result.standard_deviation_sales).toBe(0);
    expect(result.max_sales_amount).toBe(5000000);
    expect(result.min_sales_amount).toBe(5000000);
    expect(result.warning_message).toBe('');
    expect(result.process_status).toBe('完了');
  });
});