import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-371
  test('成功パターンが0パターンのとき、成功パターンなしが返される', async () => {
    const salesRepId = 'REP-001';
    const analysisMonth = '2024-01';

    const result = await generateSalesRepBehaviorAnalysisReport({
      salesRepId,
      analysisMonth,
      successPatterns: [],
    });

    expect(result.successPatterns).toEqual([]);
    expect(result.successPatternCount).toBe(0);
    expect(result.successPatternMessage).toMatch(/成功パターンなし/);
  });
});