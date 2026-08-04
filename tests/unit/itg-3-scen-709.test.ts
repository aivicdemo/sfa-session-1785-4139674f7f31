import { describe, test, expect } from '@jest/globals';
import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-709
  test('顧客データ完全性・妥当性判定機能 - 過去に同一顧客との商談記録が0件のとき、推奨生成に必要なデータセットは妥当と判定される', () => {
    const customerId = 'TEST-CUST-001';
    const negotiationHistoryCount = 0;
    const executionTimestamp = new Date('2024-01-15T11:00:00Z');

    const result = validateCustomerDataCompleteness({
      customerId,
      negotiationHistoryCount,
      executionTimestamp,
    });

    expect(result.validationStatus).toBe('VALID');
    expect(result.reasonCode).toBe('ZERO_NEGOTIATION_HISTORY_ACCEPTABLE');
    expect(result.isEligibleForRecommendationGeneration).toBe(true);
    expect(result.metadata.targetCustomerId).toBe('TEST-CUST-001');
    expect(result.metadata.executionTimestamp).toEqual(
      new Date('2024-01-15T11:00:00Z')
    );
  });
});