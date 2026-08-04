import { compareWithStandardProcess } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2299
  test('顧客対応記録が1件のとき標準プロセスと比較されて異常判定される', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          id: 'CUST-REC-001',
          pattern: '初回接触→資料送付→フォローメール',
          similarityScore: 0.65,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        stdProcId: 'STD-PROC-001',
        relevanceScore: 0.42,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      generateRecommendation: jest.fn().mockResolvedValue({}),
    };

    const standardProcessMaster = {
      'STD-PROC-001': {
        id: 'STD-PROC-001',
        pattern: '初回接触→ニーズ詳細ヒアリング→提案書作成→フォローメール',
      },
    };

    const newDealData = {
      customerIndustry: '製造業',
      budgetSize: '500万円',
    };

    const result = compareWithStandardProcess(
      newDealData,
      mockAIEngine,
      standardProcessMaster
    );

    expect(result.comparisonStatus).toBe('DEVIATION_DETECTED');
    expect(result.deviationSeverity).toBe('MEDIUM');
    expect(result.deviationDescription).toContain('提案書作成ステップが欠落している');
    expect(result.isAnomalous).toBe(true);
    expect(result.reasoning).toContain('適用可能スコア（0.42）が閾値（0.5）未満');
  });
});