import { calculateCorrelationBetweenDeviationAndResults } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-320
  test('営業担当者1名のデータから乖離度と成約実績の相関が計算される', () => {
    const salesPersonId = 'SALES-001';
    const monthlyData = [
      { month: '2023-01', visitCount: 5, proposalCount: 3, contractCount: 1 },
      { month: '2023-02', visitCount: 6, proposalCount: 4, contractCount: 2 },
      { month: '2023-03', visitCount: 4, proposalCount: 2, contractCount: 0 },
      { month: '2023-04', visitCount: 7, proposalCount: 5, contractCount: 3 },
      { month: '2023-05', visitCount: 5, proposalCount: 3, contractCount: 1 },
      { month: '2023-06', visitCount: 8, proposalCount: 6, contractCount: 4 },
      { month: '2023-07', visitCount: 6, proposalCount: 4, contractCount: 2 },
      { month: '2023-08', visitCount: 4, proposalCount: 2, contractCount: 0 },
      { month: '2023-09', visitCount: 7, proposalCount: 5, contractCount: 3 },
      { month: '2023-10', visitCount: 5, proposalCount: 3, contractCount: 1 },
      { month: '2023-11', visitCount: 9, proposalCount: 7, contractCount: 5 },
      { month: '2023-12', visitCount: 6, proposalCount: 4, contractCount: 2 },
    ];

    const result = calculateCorrelationBetweenDeviationAndResults({
      salesPersonId,
      monthlyData,
    });

    expect(result).toBeDefined();
    expect(typeof result.correlationCoefficient).toBe('number');
    expect(result.correlationCoefficient).toBeGreaterThanOrEqual(-0.8);
    expect(result.correlationCoefficient).toBeLessThanOrEqual(0.8);
    expect(Number.isNaN(result.correlationCoefficient)).toBe(false);
  });
});