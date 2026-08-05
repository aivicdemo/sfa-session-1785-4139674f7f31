import { generateSalesEmployeeAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-456
  test('成約実績が0件の営業担当者について、成約率が0として正常に計算される', () => {
    const salesEmployeeId = 'sales_emp_001';
    const salesEmployeeName = '田中太郎';

    const input = {
      salesEmployeeId: salesEmployeeId,
      salesEmployeeName: salesEmployeeName,
      visitCount: 12,
      contactCount: 8,
      proposalCount: 3,
      closedDealCount: 0,
    };

    const result = generateSalesEmployeeAnalysisReport(input);

    expect(result).toEqual({
      salesEmployeeId: salesEmployeeId,
      salesEmployeeName: salesEmployeeName,
      visitCount: 12,
      contactCount: 8,
      proposalCount: 3,
      closedDealCount: 0,
      conversionRate: 0,
      reportGeneratedAt: expect.any(String),
    });

    expect(typeof result.conversionRate).toBe('number');
    expect(result.conversionRate).toBe(0);
    expect(result.conversionRate).not.toBeNull();
    expect(result.conversionRate).not.toBeUndefined();
    expect(Number.isNaN(result.conversionRate)).toBe(false);
  });
});