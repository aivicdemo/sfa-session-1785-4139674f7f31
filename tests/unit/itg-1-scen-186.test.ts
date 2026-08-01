import { calculateProcessDeviationJudgment } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-186
  test('標準プロセス乖離度が計算されていない場合、判定処理が中断される', () => {
    const input = {
      salesPersonId: 'SP001',
      processDeviationDegree: null,
      deviationPattern: 'unknown',
      complianceScore: 0,
      standardProcessDefinition: {
        steps: ['initial_contact', 'proposal', 'negotiation', 'contract'],
        kpiCriteria: { minComplianceRate: 0.8 },
      },
    };

    const result = calculateProcessDeviationJudgment(input);

    expect(result.status).toBe('error');
    expect(result.message).toBe('乖離度データ不足');
    expect(result.judgmentResult).toBeNull();
  });
});