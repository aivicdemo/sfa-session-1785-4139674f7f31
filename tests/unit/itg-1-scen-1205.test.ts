import { describe, test, expect } from '@jest/globals';
import { calculateProcessComplianceDeviationScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1205
  test('相関分析レポート生成機能 - 営業プロセス標準書のステップ定義が null のときエラーになる', () => {
    const processDefinitionWithNullSteps = {
      id: 'proc-001',
      name: '標準営業プロセス',
      steps: null,
      createdAt: new Date('2024-01-15T11:00:00Z'),
      version: 1,
    };

    const salesActivityData = {
      salesPersonId: 'sp-001',
      customerId: 'cust-001',
      activities: [
        {
          type: 'initial_contact',
          timestamp: new Date('2024-01-15T09:00:00Z'),
          result: 'completed',
        },
        {
          type: 'proposal',
          timestamp: new Date('2024-01-15T10:30:00Z'),
          result: 'completed',
        },
      ],
      dealResult: 'won',
      dealAmount: 500000,
    };

    expect(() =>
      calculateProcessComplianceDeviationScore(
        processDefinitionWithNullSteps as any,
        salesActivityData
      )
    ).toThrow(/営業プロセス標準書のステップ定義が未設定です/);
  });
});