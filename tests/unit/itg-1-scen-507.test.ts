import { generateSalesPerformanceAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-507: [edge] 営業担当者ごとの行動パターン分析レポート生成機能 - 成約実績の成功率計算で小数点以下が発生した場合に指定の丸め方で処理される
  test('成約件数3件、提案件数7件の場合、成功率は四捨五入で小数点以下第2位まで表示される', () => {
    const salesPersonId = 'SP-001';
    const salesPersonName = 'Aさん';
    const closedDeals = 3;
    const proposalCount = 7;
    const analysisStartDate = '2024-01-01';
    const analysisEndDate = '2024-01-31';

    const result = generateSalesPerformanceAnalysisReport({
      salesPersonId,
      salesPersonName,
      closedDeals,
      proposalCount,
      analysisStartDate,
      analysisEndDate,
      roundingMethod: 'round_half_up'
    });

    // 期待値：3 ÷ 7 = 0.428571... → 四捨五入で小数点以下第2位 = 0.43（43.00%）
    expect(result.successRate).toBe(0.43);
    expect(result.successRatePercentage).toBe('43.00%');
    expect(result.closedDeals).toBe(3);
    expect(result.proposalCount).toBe(7);
    expect(result.salesPersonId).toBe('SP-001');
    expect(result.salesPersonName).toBe('Aさん');
    expect(result.analysisStartDate).toBe('2024-01-01');
    expect(result.analysisEndDate).toBe('2024-01-31');
  });
});