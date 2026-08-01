import { analyzeSalesRepActionPatterns } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者行動パターン分析機能', () => {
  // SCEN-816
  test('分析対象期間が月をまたぐ場合、複数月のデータを統合して分析を実行する', () => {
    const salesRepId = 'A001';
    const startDate = new Date('2024-01-01T00:00:00Z');
    const endDate = new Date('2024-02-29T23:59:59Z');

    const januaryData = {
      salesRepId: salesRepId,
      date: new Date('2024-01-15T10:00:00Z'),
      visitCount: 15,
      proposalCount: 8,
      contractCount: 3,
    };

    const februaryData = {
      salesRepId: salesRepId,
      date: new Date('2024-02-15T10:00:00Z'),
      visitCount: 18,
      proposalCount: 10,
      contractCount: 4,
    };

    const analysisResult = analyzeSalesRepActionPatterns({
      salesRepId: salesRepId,
      startDate: startDate,
      endDate: endDate,
      monthlyData: [januaryData, februaryData],
    });

    expect(analysisResult.totalVisitCount).toBe(33);
    expect(analysisResult.totalProposalCount).toBe(18);
    expect(analysisResult.totalContractCount).toBe(7);
    expect(analysisResult.analysisPeriodStart).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(analysisResult.analysisPeriodEnd).toEqual(new Date('2024-02-29T23:59:59Z'));
    expect(analysisResult.analysisDurationDays).toBe(60);
  });
});