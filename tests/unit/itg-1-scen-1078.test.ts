import { analyzeAndSelectMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  test('SCEN-1078: 分析対象期間内のデータが不足している場合にエラーが発生する', () => {
    // Arrange
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');

    const salesActivityLogs: any[] = [];
    const contractedDeals: any[] = [];
    const customerAttributes: any[] = [];

    const input = {
      startDate: analysisStartDate,
      endDate: analysisEndDate,
      salesActivityLogs,
      contractedDeals,
      customerAttributes,
    };

    // Act & Assert
    expect(() => analyzeAndSelectMetrics(input)).toThrow(/データが不足/);
  });
});