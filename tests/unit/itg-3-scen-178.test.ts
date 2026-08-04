import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出フィルタリング機能', () => {
  // SCEN-178
  test('抽出された成功パターンが過去データの昇順で0件である場合、推奨パターンマスタからフォールバック処理が発動する', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const dealCondition = {
      customerIndustry: 'IT',
      customerSize: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    const result = await extractSuccessPatterns(
      dealCondition,
      mockAIEngine,
      mockFileStorage,
    );

    expect(result.extractedPatterns).toEqual([]);
    expect(result.sortedPatterns).toEqual([]);
    expect(result.fallbackActivated).toBe(true);
    expect(result.fallbackPatterns).toBeDefined();
    expect(result.fallbackPatterns.length).toBeGreaterThan(0);
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
    );
    expect(result.reasoningExplanation).toBe('簡略版');
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(dealCondition);
  });
});