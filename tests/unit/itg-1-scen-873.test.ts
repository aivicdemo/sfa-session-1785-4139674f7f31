import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeMonthlyOperationQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('Monthly Operation Quality Statistics Analysis - Empty Sales Staff', () => {
  // SCEN-873
  test('should return zero statistics when no sales staff exists', async () => {
    const result = await analyzeMonthlyOperationQualityStatistics({
      target_month: '2024-01-01',
      sales_staff_count: 0,
      total_achievements: [],
    });

    expect(result.status_code).toBe(200);
    expect(result.statistics.sales_staff_count).toBe(0);
    expect(result.statistics.total_sales_amount).toBe(0);
    expect(result.statistics.total_transaction_count).toBe(0);
    expect(result.statistics.average_sales_amount).toBe(0);
    expect(result.statistics.maximum_sales_amount).toBe(0);
    expect(result.statistics.minimum_sales_amount).toBe(0);
    expect(result.error_message).toBe('');
  });
});