import { generateSalesPersonPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-423
  test('レポートの平均計算で端数が発生する場合、浮動小数点数として正確に保持される', () => {
    const salesPersonA = {
      id: 'sp-001',
      name: '営業担当者A',
      conclusionCount: 3,
    };

    const salesPersonB = {
      id: 'sp-002',
      name: '営業担当者B',
      conclusionCount: 5,
    };

    const salesPersonC = {
      id: 'sp-003',
      name: '営業担当者C',
      conclusionCount: 7,
    };

    const totalSalesCount = 15;

    const report = generateSalesPersonPatternAnalysisReport([
      salesPersonA,
      salesPersonB,
      salesPersonC,
    ], totalSalesCount);

    const averageConclusionRate = report.averageConclusionRate;

    expect(averageConclusionRate).toBe(0.3333333333333333);
  });
});