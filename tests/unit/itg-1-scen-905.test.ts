import { generateSalesPerformanceAnalysisReport } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-905
  test('改善提案が空のとき、エラーになる', () => {
    const analysisParams = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      employeeId: 'EMP-001',
      improvementSuggestions: '',
    };

    expect(() => generateSalesPerformanceAnalysisReport(analysisParams)).toThrow(/改善提案は必須項目です/);
  });
});