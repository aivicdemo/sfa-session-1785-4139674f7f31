import { describe, test, expect } from '@jest/globals';
import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-230
  test('標準プロセス遵守度スコア計算機能 - 商談記録のステップ情報が空配列のときエラーになる', () => {
    const dealRecord = {
      deal_id: 'DEAL-001',
      customer_id: 'CUST-001',
      sales_rep_id: 'REP-001',
      steps: [],
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    };

    expect(() => calculateProcessComplianceScore(dealRecord)).toThrow(/ステップ情報が空です/);
    
    try {
      calculateProcessComplianceScore(dealRecord);
      expect.fail('エラーがスローされるべき');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      const err = error as Error & { code?: string };
      expect(err.message).toContain('ステップ情報が空です。商談記録には最低1件以上のステップが必要です');
      expect(err.code).toBe('ERR_EMPTY_STEPS');
    }
  });
});