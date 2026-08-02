import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-327
  test('標準プロセスとの乖離度が改善指導対象の閾値を超える場合、改善指導対象と判定される', () => {
    const deviationThreshold = 80;
    const deviationDegree = 81;

    const salesDataSet = {
      employeeId: 'EMP001',
      deviationDegree: deviationDegree,
      processStepCompliance: {
        initialContact: false,
        proposal: true,
        negotiation: true,
        contract: false,
      },
      transactionCount: 5,
      timestamp: new Date('2024-01-15T10:30:00Z'),
    };

    const result = validateSalesDataQuality(salesDataSet, {
      deviationThreshold: deviationThreshold,
    });

    expect(result.requiresImprovement).toBe(true);
    expect(result.deviationDegree).toBe(81);
    expect(result.isTargetForGuidance).toBe(true);
  });
});