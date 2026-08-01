import { analyzeProcessDeviationAndCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業プロセス標準書との乖離分析と成約実績の相関分析', () => {
  // SCEN-845
  test('[normal] ステップ実行度が50%の場合、中間値として相関係数を計算する', () => {
    const salesPersonA = {
      id: 'A001',
      completedSteps: 2.5,
      stepExecutionRate: 0.5,
      dealCount: 10,
      revenue: 5000000,
      experienceYears: 5,
    };

    const comparisonGroup = Array.from({ length: 20 }, (_, i) => ({
      id: `CG${String(i + 1).padStart(3, '0')}`,
      completedSteps: 2.3 + Math.random() * 2,
      stepExecutionRate: 0.46 + Math.random() * 0.08,
      dealCount: 8 + Math.floor(Math.random() * 5),
      revenue: 4000000 + Math.random() * 2000000,
      experienceYears: 4 + Math.floor(Math.random() * 3),
    }));

    const result = analyzeProcessDeviationAndCorrelation(salesPersonA, comparisonGroup);

    expect(result).toHaveProperty('correlationCoefficient');
    expect(typeof result.correlationCoefficient).toBe('number');
    expect(result.correlationCoefficient).toBeGreaterThanOrEqual(-1.0);
    expect(result.correlationCoefficient).toBeLessThanOrEqual(1.0);

    expect(result).toHaveProperty('correctionFactor');
    expect(result.correctionFactor).toBe(0.5);

    expect(result).toHaveProperty('stepExecutionRate');
    expect(result.stepExecutionRate).toBe(0.5);

    expect(result).toHaveProperty('auditLog');
    expect(result.auditLog).toBeDefined();
    expect(result.auditLog).toHaveProperty('inputDataSet');
    expect(result.auditLog).toHaveProperty('correctionFactorApplied');
    expect(result.auditLog).toHaveProperty('intermediateCalculations');
    expect(result.auditLog.correctionFactorApplied).toBe(0.5);

    expect(result.auditLog.inputDataSet).toHaveProperty('salesPersonId', 'A001');
    expect(result.auditLog.inputDataSet).toHaveProperty('completedSteps', 2.5);
    expect(result.auditLog.inputDataSet).toHaveProperty('dealCount', 10);
    expect(result.auditLog.inputDataSet).toHaveProperty('revenue', 5000000);
    expect(result.auditLog.inputDataSet).toHaveProperty('comparisonGroupSize', 20);

    expect(result.auditLog.intermediateCalculations).toBeDefined();
    expect(result.auditLog.intermediateCalculations).toHaveProperty('rawCorrelation');
    expect(typeof result.auditLog.intermediateCalculations.rawCorrelation).toBe('number');
    expect(result.auditLog.intermediateCalculations).toHaveProperty('adjustedCorrelation');
    expect(typeof result.auditLog.intermediateCalculations.adjustedCorrelation).toBe('number');
  });
});