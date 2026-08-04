import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨ロジック - 外部サービス呼び出し失敗時のフォールバック', () => {
  // SCEN-2703: AIRecommendationEngineへのAPI呼び出しが3回目失敗したとき、内部パターンマスタへのフォールバックが実行される
  test('should fallback to internal master pattern when external AI service fails 3 times with exponential backoff', async () => {
    // Arrange: AIRecommendationEngineのスタブを用意し、3回連続でタイムアウトエラーを返す設定
    const mockRetryTimestamps: number[] = [];
    
    const stubAIRecommendationEngine = {
      generateRecommendation: jest.fn(async () => {
        mockRetryTimestamps.push(Date.now());
        throw new Error('TIMEOUT: External AI service request exceeded 30s limit');
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // テスト用の新規案件データ
    const newCaseInput = {
      customerId: 'CUST-20250201-001',
      customerIndustry: 'manufacturing',
      customerSize: 'mid_enterprise',
      dealAmount: 5000000,
      dealStage: 'proposal_preparation',
      dealDescription: 'Process automation solution',
    };

    // 内部パターンマスタの期待されるレコード
    const expectedInternalMasterPatterns = [
      {
        patternId: 'PAT-MFG-001',
        industry: 'manufacturing',
        enterpriseSize: 'mid_enterprise',
        proposalApproach: 'cost_reduction_focus',
        pastSuccessCount: 47,
        successRate: 0.89,
      },
      {
        patternId: 'PAT-MFG-002',
        industry: 'manufacturing',
        enterpriseSize: 'mid_enterprise',
        proposalApproach: 'efficiency_improvement',
        pastSuccessCount: 32,
        successRate: 0.84,
      },
    ];

    const stubInternalMaster = {
      queryTopPatternsByIndustryAndSize: jest.fn().mockResolvedValue(expectedInternalMasterPatterns),
    };

    // Act: 指数バックオフ再試行を行う推奨ロジックを実行
    const result = await generateRecommendationWithFallback(
      newCaseInput,
      stubAIRecommendationEngine,
      stubInternalMaster
    );

    // Assert: 指数バックオフ再試行ロジックの検証
    expect(stubAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // 再試行の待機時間が指数バックオフで 1秒 → 2秒 → 4秒 であることを検証
    expect(mockRetryTimestamps.length).toBe(3);
    // 最初の呼び出しから2番目の呼び出しまでの間隔がおおよそ 1000ms
    expect(mockRetryTimestamps[1] - mockRetryTimestamps[0]).toBeGreaterThanOrEqual(950);
    expect(mockRetryTimestamps[1] - mockRetryTimestamps[0]).toBeLessThanOrEqual(1100);
    // 2番目から3番目の呼び出しまでの間隔がおおよそ 2000ms
    expect(mockRetryTimestamps[2] - mockRetryTimestamps[1]).toBeGreaterThanOrEqual(1900);
    expect(mockRetryTimestamps[2] - mockRetryTimestamps[1]).toBeLessThanOrEqual(2100);

    // Assert: 3回目失敗後、内部パターンマスタクエリが自動実行されたことを確認
    expect(stubInternalMaster.queryTopPatternsByIndustryAndSize).toHaveBeenCalledTimes(1);
    expect(stubInternalMaster.queryTopPatternsByIndustryAndSize).toHaveBeenCalledWith({
      industry: 'manufacturing',
      enterpriseSize: 'mid_enterprise',
    });

    // Assert: 戻り値オブジェクトの構造と値を検証
    expect(result).toBeDefined();
    expect(result.recommendationSource).toBe('fallback_internal_master');
    expect(result.reasoningType).toBe('simplified_summary');
    
    // Assert: 内部パターンマスタから取得した具体的なパターンデータが含まれていることを確認
    expect(result.patterns).toBeDefined();
    expect(Array.isArray(result.patterns)).toBe(true);
    expect(result.patterns.length).toBeGreaterThanOrEqual(1);

    // 最初のパターン（統計的に上位のパターン）の詳細検証
    const topPattern = result.patterns[0];
    expect(topPattern.patternId).toBe('PAT-MFG-001');
    expect(topPattern.industry).toBe('manufacturing');
    expect(topPattern.enterpriseSize).toBe('mid_enterprise');
    expect(topPattern.proposalApproach).toBe('cost_reduction_focus');
    expect(topPattern.pastSuccessCount).toBe(47);
    expect(topPattern.successRate).toBe(0.89);

    // Assert: 2番目のパターンも含まれていることを確認
    if (result.patterns.length > 1) {
      const secondPattern = result.patterns[1];
      expect(secondPattern.patternId).toBe('PAT-MFG-002');
      expect(secondPattern.proposalApproach).toBe('efficiency_improvement');
      expect(secondPattern.pastSuccessCount).toBe(32);
    }
  });
});