import { describe, it, expect, beforeEach } from '@jest/globals';
import { mergeCustomersWithJudgmentInfo } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-530
  it('統合判定の判定者情報が記録される', () => {
    const judgerUserId = 'U001';
    const judgerName = '山田太郎';
    const judgmentTimestamp = new Date('2024-01-15T14:30:45Z').getTime();

    const duplicateCustomerPair = {
      customerId_1: 'CUST_001',
      customerName_1: '顧客A',
      email_1: 'customer_a@example.com',
      customerId_2: 'CUST_002',
      customerName_2: '顧客B',
      email_2: 'customer_b@example.com',
    };

    const mergeInput = {
      primaryCustomerId: 'CUST_001',
      secondaryCustomerId: 'CUST_002',
      judgerUserId: judgerUserId,
      judgerName: judgerName,
      judgmentTimestamp: judgmentTimestamp,
    };

    const result = mergeCustomersWithJudgmentInfo(mergeInput);

    expect(result).toEqual({
      mergedCustomerId: 'CUST_001',
      judgmentRecordId: expect.any(String),
      judgerUserId: 'U001',
      judgerName: '山田太郎',
      judgmentTimestamp: judgmentTimestamp,
      mergeStatus: 'completed',
      recordedAt: expect.any(Number),
    });

    expect(result.judgerUserId).toBe('U001');
    expect(result.judgerName).toBe('山田太郎');
    expect(result.judgmentTimestamp).toBe(judgmentTimestamp);
    expect(result.mergeStatus).toBe('completed');
  });
});