import { structureSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  test('SCEN-2460: 過去商談データから成功要因が複数件抽出され、すべて構造化テンプレートに反映される', () => {
    // 過去商談データセット（最低3件以上の成功商談データを準備）
    const historicalDeals = [
      {
        dealId: 'DEAL-001',
        customerIndustry: '製造業',
        productCategory: 'クラウドERP',
        proposalApproach: '既存システム統合アプローチ',
        contractedAmount: 5000000,
        contractedDate: '2023-06-15',
        successFlag: true,
        successRate: 0.92,
      },
      {
        dealId: 'DEAL-002',
        customerIndustry: '製造業',
        productCategory: 'クラウドERP',
        proposalApproach: 'フェーズ導入アプローチ',
        contractedAmount: 4800000,
        contractedDate: '2023-05-20',
        successFlag: true,
        successRate: 0.88,
      },
      {
        dealId: 'DEAL-003',
        customerIndustry: '製造業',
        productCategory: 'クラウドERP',
        proposalApproach: 'コンサルティング付き導入アプローチ',
        contractedAmount: 5200000,
        contractedDate: '2023-07-10',
        successFlag: true,
        successRate: 0.95,
      },
    ];

    // 新規案件の条件データ
    const newDealCondition = {
      customerIndustry: '製造業',
      productCategory: 'クラウドERP',
      budget: 5000000,
    };

    // AIRecommendationEngine のスタブ：findSimilarPatterns が3件以上の成功パターンを返す
    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      {
        patternId: 'PATTERN-001',
        dealId: 'DEAL-003',
        patternName: 'コンサルティング付き導入パターン',
        relevanceScore: 0.95,
        recommendedApproach: 'コンサルティング付き導入アプローチ',
      },
      {
        patternId: 'PATTERN-002',
        dealId: 'DEAL-001',
        patternName: '既存システム統合パターン',
        relevanceScore: 0.92,
        recommendedApproach: '既存システム統合アプローチ',
      },
      {
        patternId: 'PATTERN-003',
        dealId: 'DEAL-002',
        patternName: 'フェーズ導入パターン',
        relevanceScore: 0.78,
        recommendedApproach: 'フェーズ導入アプローチ',
      },
    ]);

    // AIRecommendationEngine のスタブ：evaluatePatternRelevance が各パターンのスコアを返す
    const mockEvaluatePatternRelevance = jest.fn()
      .mockReturnValueOnce({ relevanceScore: 0.95, isApplicable: true })
      .mockReturnValueOnce({ relevanceScore: 0.92, isApplicable: true })
      .mockReturnValueOnce({ relevanceScore: 0.78, isApplicable: true });

    // 成功パターン抽出・構造化処理を実行
    const result = structureSuccessPatterns(
      newDealCondition,
      {
        findSimilarPatterns: mockFindSimilarPatterns,
        evaluatePatternRelevance: mockEvaluatePatternRelevance,
      }
    );

    // 期待結果の検証：3件以上の成功パターンが構造化テンプレートに反映されている
    expect(result).toHaveLength(3);

    // 各パターンが正規化されたJSON構造で出力されているか確認
    expect(result[0]).toEqual({
      successPatternId: 'PATTERN-001',
      patternName: 'コンサルティング付き導入パターン',
      relevanceScore: 0.95,
      recommendedApproach: 'コンサルティング付き導入アプローチ',
      historicalSuccessRate: 0.95,
    });

    expect(result[1]).toEqual({
      successPatternId: 'PATTERN-002',
      patternName: '既存システム統合パターン',
      relevanceScore: 0.92,
      recommendedApproach: '既存システム統合アプローチ',
      historicalSuccessRate: 0.92,
    });

    expect(result[2]).toEqual({
      successPatternId: 'PATTERN-003',
      patternName: 'フェーズ導入パターン',
      relevanceScore: 0.78,
      recommendedApproach: 'フェーズ導入アプローチ',
      historicalSuccessRate: 0.78,
    });

    // relevanceScore の降順でソートされていることを確認
    expect(result[0].relevanceScore).toBe(0.95);
    expect(result[1].relevanceScore).toBe(0.92);
    expect(result[2].relevanceScore).toBe(0.78);
    expect(result[0].relevanceScore).toBeGreaterThanOrEqual(result[1].relevanceScore);
    expect(result[1].relevanceScore).toBeGreaterThanOrEqual(result[2].relevanceScore);

    // すべてのパターンが relevanceScore 0.78 以上であることを確認
    result.forEach((pattern) => {
      expect(pattern.relevanceScore).toBeGreaterThanOrEqual(0.78);
    });

    // 必須フィールドがすべて存在することを確認
    result.forEach((pattern) => {
      expect(pattern).toHaveProperty('successPatternId');
      expect(pattern).toHaveProperty('patternName');
      expect(pattern).toHaveProperty('relevanceScore');
      expect(pattern).toHaveProperty('recommendedApproach');
      expect(pattern).toHaveProperty('historicalSuccessRate');
    });

    // データ欠損や形式の不整合がないことを確認
    result.forEach((pattern) => {
      expect(typeof pattern.successPatternId).toBe('string');
      expect(pattern.successPatternId.length).toBeGreaterThan(0);
      expect(typeof pattern.patternName).toBe('string');
      expect(pattern.patternName.length).toBeGreaterThan(0);
      expect(typeof pattern.relevanceScore).toBe('number');
      expect(pattern.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(pattern.relevanceScore).toBeLessThanOrEqual(1);
      expect(typeof pattern.recommendedApproach).toBe('string');
      expect(pattern.recommendedApproach.length).toBeGreaterThan(0);
      expect(typeof pattern.historicalSuccessRate).toBe('number');
      expect(pattern.historicalSuccessRate).toBeGreaterThanOrEqual(0);
      expect(pattern.historicalSuccessRate).toBeLessThanOrEqual(1);
    });
  });
});