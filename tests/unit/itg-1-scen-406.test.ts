import { calculateSalesAnalysis } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-406
  test('分析結果の数値が浮動小数点数であり、端数が発生する場合も正確に保持される', () => {
    const salesPersonId = 'SP001';
    const closedDealsCount = 7;
    const totalRevenue = 1500000;
    const totalDealsCount = 21;

    const analysisResult = calculateSalesAnalysis({
      salesPersonId,
      closedDealsCount,
      totalRevenue,
      totalDealsCount,
    });

    const expectedClosingRate = closedDealsCount / totalDealsCount;
    const expectedAveragePrice = totalRevenue / closedDealsCount;

    expect(analysisResult.closingRate).toBeCloseTo(0.3333333333333333, 15);
    expect(analysisResult.averagePrice).toBeCloseTo(214285.71428571428, 15);

    expect(Math.abs(analysisResult.closingRate - expectedClosingRate)).toBeLessThan(1e-10);
    expect(Math.abs(analysisResult.averagePrice - expectedAveragePrice)).toBeLessThan(1e-10);

    expect(typeof analysisResult.closingRate).toBe('number');
    expect(typeof analysisResult.averagePrice).toBe('number');

    const serialized = JSON.stringify(analysisResult);
    const deserialized = JSON.parse(serialized);

    expect(Math.abs(deserialized.closingRate - expectedClosingRate)).toBeLessThan(1e-10);
    expect(Math.abs(deserialized.averagePrice - expectedAveragePrice)).toBeLessThan(1e-10);
  });
});