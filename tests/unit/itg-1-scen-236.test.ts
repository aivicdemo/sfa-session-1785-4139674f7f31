import { describe, test, expect } from '@jest/globals';
import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-236
  test('[error] 標準プロセス遵守度スコア計算機能 - 商談記録のステップ実行順序が標準プロセス定義の順序に違反しているときエラーになる', () => {
    const standardProcessDefinition = {
      processId: 'proc_001',
      stages: [
        { stageId: 'stage_001', stageName: '初期接触', sequenceNumber: 1 },
        { stageId: 'stage_002', stageName: 'ニーズ把握', sequenceNumber: 2 },
        { stageId: 'stage_003', stageName: '提案', sequenceNumber: 3 },
        { stageId: 'stage_004', stageName: '契約', sequenceNumber: 4 },
      ],
    };

    const dealRecord = {
      dealId: 'deal_001',
      customerId: 'cust_001',
      salesPersonId: 'sales_001',
      executedSteps: [
        { stageId: 'stage_001', stageName: '初期接触', executedAt: '2024-01-15T09:00:00Z' },
        { stageId: 'stage_003', stageName: '提案', executedAt: '2024-01-15T10:00:00Z' },
        { stageId: 'stage_002', stageName: 'ニーズ把握', executedAt: '2024-01-15T11:00:00Z' },
        { stageId: 'stage_004', stageName: '契約', executedAt: '2024-01-15T12:00:00Z' },
      ],
    };

    expect(() =>
      calculateProcessComplianceScore(standardProcessDefinition, dealRecord)
    ).toThrow(/PROCESS_ORDER_VIOLATION/);
  });
});