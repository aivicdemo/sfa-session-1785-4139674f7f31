import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - 顧客条件0個の場合の推奨', () => {
  // SCEN-558
  test('顧客条件が0個のとき最も汎用的な成功パターンが推奨される', () => {
    // Arrange: 推奨パターンマスタに登録されている複数の成功パターン
    const recommendationPatterns = [
      {
        patternId: 'PAT-GEN-001',
        patternName: '業界別に最適化されていない標準提案アプローチ',
        versatilityScore: 95,
        industry: null,
        companySize: null,
        successRate: 0.72,
        appliedCases: 1250,
        recommendedApproach: '顧客ニーズ理解と基本的な提案フロー',
        simplifiedReasoning: '最も一般的で適用範囲の広い標準パターン',
      },
      {
        patternId: 'PAT-IT-001',
        patternName: 'IT業界向け最適化パターン',
        versatilityScore: 68,
        industry: 'IT',
        companySize: null,
        successRate: 0.81,
        appliedCases: 450,
        recommendedApproach: 'IT業界向けカスタマイズ提案',
        simplifiedReasoning: 'IT業界特有の課題への対応',
      },
      {
        patternId: 'PAT-MID-001',
        patternName: '中堅企業向けパターン',
        versatilityScore: 72,
        industry: null,
        companySize: 'MEDIUM',
        successRate: 0.78,
        appliedCases: 520,
        recommendedApproach: '中堅企業の意思決定プロセス対応',
        simplifiedReasoning: '企業規模別最適化パターン',
      },
    ];

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 顧客条件が0個の場合、内部パターンマスタから統計的に上位のパターンを返却
    mockAIEngine.generateRecommendation.mockReturnValue({
      patternId: 'PAT-GEN-001',
      patternName: '業界別に最適化されていない標準提案アプローチ',
      versatilityScore: 95,
      recommendedApproach: '顧客ニーズ理解と基本的な提案フロー',
      simplifiedReasoning: '最も一般的で適用範囲の広い標準パターン',
      isUsingFallback: true,
      confidenceScore: 78,
    });

    // 新規案件データ：顧客条件が0個
    const newDealData = {
      customerId: 'TEST-NEW-001',
      customerConditions: [],
      dealAmount: 500000,
      industry: null,
      companySize: null,
    };

    // Act: generateRecommendationメソッドを呼び出し
    const result = generateRecommendation(newDealData, mockAIEngine);

    // Assert: 返却された推奨内容の検証
    expect(result).toBeDefined();
    expect(result.patternId).toBe('PAT-GEN-001');
    expect(result.patternName).toBe('業界別に最適化されていない標準提案アプローチ');
    expect(result.versatilityScore).toBe(95);
    expect(result.recommendedApproach).toBe('顧客ニーズ理解と基本的な提案フロー');
    expect(result.simplifiedReasoning).toBe('最も一般的で適用範囲の広い標準パターン');
    expect(result.isUsingFallback).toBe(true);
    expect(result.confidenceScore).toBe(78);

    // 返却されたパターンが最も汎用的なパターンであることを検証
    const maxVersatilityScore = Math.max(
      ...recommendationPatterns.map((p) => p.versatilityScore)
    );
    expect(result.versatilityScore).toBe(maxVersatilityScore);

    // 簡略版根拠説明が含まれていることを確認
    expect(result.simplifiedReasoning).toBeDefined();
    expect(result.simplifiedReasoning.length).toBeGreaterThan(0);

    // システムが顧客条件の欠落を理由に推奨生成を失敗させず、代替パターンを正常に提示
    expect(result.isUsingFallback).toBe(true);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealData,
      expect.any(Object)
    );
  });
});