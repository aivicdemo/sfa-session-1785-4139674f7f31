import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-356
  test('成約率が0%ちょうどのとき、数値が正確に計算される', () => {
    const salesPersonId = 'SP-001';
    const salesPersonName = '営業担当者A';
    const contractedCount = 0;
    const proposalCount = 0;
    const followUpFrequency = 0;
    const averageResponseTime = 0;
    const processComplianceScore = 0;
    const periodStart = new Date('2024-01-01T00:00:00Z');
    const periodEnd = new Date('2024-01-31T23:59:59Z');

    const input = {
      salesPersonId,
      salesPersonName,
      contractedCount,
      proposalCount,
      followUpFrequency,
      averageResponseTime,
      processComplianceScore,
      periodStart,
      periodEnd,
    };

    const result = generateSalesPersonBehaviorAnalysisReport(input);

    expect(result).toEqual({
      salesPersonId: 'SP-001',
      salesPersonName: '営業担当者A',
      conversionRate: 0,
      proposalCount: 0,
      contractedCount: 0,
      followUpFrequency: 0,
      averageResponseTime: 0,
      processComplianceScore: 0,
      periodStart: new Date('2024-01-01T00:00:00Z'),
      periodEnd: new Date('2024-01-31T23:59:59Z'),
      generatedAt: expect.any(Date),
    });

    expect(typeof result.conversionRate).toBe('number');
    expect(Number.isNaN(result.conversionRate)).toBe(false);
    expect(result.conversionRate).toBe(0);
  });
});