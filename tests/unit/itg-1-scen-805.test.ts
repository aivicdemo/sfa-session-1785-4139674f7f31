import { analyzeActionPatternDeviation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  // SCEN-805
  test('[normal] 乖離が成約率低下と負の相関を持つ場合、その乖離は改善対象と分類される', () => {
    const salesPersonId = 'SP001';
    const standardVisitFrequency = 10;
    const actualVisitFrequency = 7;
    const salesPersonClosureRate = 15;
    const teamAverageClosureRate = 25;
    
    const result = analyzeActionPatternDeviation({
      salesPersonId,
      standardVisitFrequency,
      actualVisitFrequency,
      salesPersonClosureRate,
      teamAverageClosureRate,
    });

    const deviationPercentage = ((standardVisitFrequency - actualVisitFrequency) / standardVisitFrequency) * 100;
    const closureRateDifference = teamAverageClosureRate - salesPersonClosureRate;
    
    expect(deviationPercentage).toBe(30);
    expect(closureRateDifference).toBe(10);
    
    const correlationCoefficient = -0.95;
    expect(result.correlationCoefficient).toBeLessThan(0);
    expect(result.correlationCoefficient).toBeCloseTo(correlationCoefficient, 1);
    
    expect(result.deviationClassification).toBe('改善対象');
    expect(result.salesPersonId).toBe('SP001');
    expect(typeof result.correlationCoefficient).toBe('number');
  });
});