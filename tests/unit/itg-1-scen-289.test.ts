import { describe, test, expect } from '@jest/globals';
import { calculateSalesComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-289
  test('商談進捗データの進捗率が100を超える値のとき、処理が中断される', () => {
    const invalidProgressRate = 150;
    
    expect(() => {
      calculateSalesComplianceScore({
        salesPersonId: 'SP001',
        dealProgressRate: invalidProgressRate,
        proposalSuccessRate: 75,
        followUpIntervalDays: 5,
        analysisMonth: '2024-01',
      });
    }).toThrow(/進捗率/);
  });
});