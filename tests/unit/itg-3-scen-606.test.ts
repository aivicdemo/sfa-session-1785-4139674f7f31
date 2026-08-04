import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動抽出・提案アプローチ推奨機能', () => {
  test('SCEN-606: 過去商談データから成功パターンが1件以上抽出されるとき推奨アプローチが生成される', async () => {
    // テストデータ: 成功パターン1件以上を含むテストデータセット
    const successPattern1 = {
      id: 'pattern-001',
      customerIndustry: '製造業',
      customerSize: '大企業',
      challenge: '生産効率化',
      budget: 5000000,
      successRate: 0.85,
      averageContractValue: 4500000,
      actionSequence: ['初期ヒアリング', '提案資料提示', 'POC実施', '契約'],
    };

    const successPattern2 = {
      id: 'pattern-002',
      customerIndustry: '製造業',
      customerSize: '中堅企業',
      challenge: '生産効率化',
      budget: 2000000,
      successRate: 0.78,
      averageContractValue: 1800000,
      actionSequence: ['初期ヒアリング', '提案資料提示', '契約'],
    };

    const similarPatterns = [successPattern1, successPattern2];

    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(similarPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(
          '過去の類似案件（パターン-001, パターン-002）で高い成約実績があります。初期段階でのヒアリング充実とPOC実施が成功要因です。'
        ),
      evaluatePatternRelevance: jest
        .fn()
        .mockResolvedValue(0.87),
    };

    // 新規案件の顧客・商談条件
    const newDealCondition = {
      customerId: 'new-customer-001',
      customerIndustry: '製造業',
      customerSize: '中堅企業',
      challenge: '生産効率化',
      budget: 2500000,
      proposalTimestamp: new Date('2024-01-15T09:00:00Z'),
    };

    // generateRecommendationメソッドを呼び出す
    const result = await generateRecommendation(
      newDealCondition,
      mockAIEngine
    );

    // findSimilarPatternsが成功パターン1件以上を返したことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);

    // explainRecommendationReasoningが呼び出されたことを確認
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();

    // evaluatePatternRelevanceが呼び出されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();

    // 戻り値のレスポンスオブジェクトの構造を検証
    expect(result).toHaveProperty('recommendedApproach');
    expect(result).toHaveProperty('reasoning');
    expect(result).toHaveProperty('similarPatterns');
    expect(result).toHaveProperty('patternRelevanceScore');

    // recommendedApproachが空文字列でないことを確認
    expect(result.recommendedApproach).not.toBe('');
    expect(typeof result.recommendedApproach).toBe('string');

    // reasoningが空文字列でないことを確認
    expect(result.reasoning).not.toBe('');
    expect(typeof result.reasoning).toBe('string');

    // similarPatternsが配列で、1件以上のパターンを含むことを確認
    expect(Array.isArray(result.similarPatterns)).toBe(true);
    expect(result.similarPatterns.length).toBeGreaterThanOrEqual(1);
    expect(result.similarPatterns).toEqual(similarPatterns);

    // patternRelevanceScoreが0.0～1.0の範囲内で、期待値0.87であることを確認
    expect(typeof result.patternRelevanceScore).toBe('number');
    expect(result.patternRelevanceScore).toBeGreaterThanOrEqual(0.0);
    expect(result.patternRelevanceScore).toBeLessThanOrEqual(1.0);
    expect(result.patternRelevanceScore).toBe(0.87);

    // recommendedApproachに具体的な内容が含まれることを確認
    expect(result.recommendedApproach.length).toBeGreaterThan(0);

    // reasoningに具体的な内容が含まれることを確認
    expect(result.reasoning.length).toBeGreaterThan(0);
  });
});