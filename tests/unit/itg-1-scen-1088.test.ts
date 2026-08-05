import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1088: [edge] 行動パターン分析対象指標の自動選定機能 - 最大規模の営業案件数（10000件超）に対して指標選定が完了する
  test('should complete indicator selection within 60 seconds for 10001 sales opportunities', async () => {
    const largeDataset = Array.from({ length: 10001 }, (_, index) => ({
      opportunityId: `opp_${String(index + 1).padStart(5, '0')}`,
      initialContactFrequency: Math.floor(Math.random() * 20) + 1,
      proposalSuccessRate: Math.random() * 100,
      followUpInterval: Math.floor(Math.random() * 30) + 1,
      customerContactCount: Math.floor(Math.random() * 50) + 1,
      proposalContentQuality: Math.random() * 100,
      contractedAmount: Math.floor(Math.random() * 1000000) + 10000,
      isContracted: Math.random() > 0.3,
      contractDate: new Date('2024-01-15T11:00:00Z').toISOString(),
      processDeviation: Math.random() * 100,
    }));

    const startTime = Date.now();
    const result = await selectAnalysisIndicators(largeDataset);
    const endTime = Date.now();

    const processingTimeMs = endTime - startTime;
    const processingTimeSec = processingTimeMs / 1000;

    expect(result).toBeDefined();
    expect(result.selectedIndicators).toBeDefined();
    expect(Array.isArray(result.selectedIndicators)).toBe(true);

    const selectedCount = result.selectedIndicators.length;
    expect(selectedCount).toBeGreaterThanOrEqual(1);
    expect(selectedCount).toBeLessThanOrEqual(10001);

    expect(processingTimeSec).toBeLessThan(60);

    expect(result.error).toBeUndefined();
    expect(result.status).toBe('completed');
  });
});