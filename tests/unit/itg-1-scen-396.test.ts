import { calculateCustomerResponsePatternAlignment } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-396
  test('顧客対応パターンレコードが0件の場合、合致度の計算が適切に処理される', () => {
    const customerResponsePatterns: any[] = [];
    const contractPerformanceData = {
      contractCount: 5,
      averageResponseTimeMinutes: 120,
    };

    const result = calculateCustomerResponsePatternAlignment(
      customerResponsePatterns,
      contractPerformanceData
    );

    expect(result).toEqual({
      alignmentScore: 0,
      status: '計算不可',
    });
  });
});