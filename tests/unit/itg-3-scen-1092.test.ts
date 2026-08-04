import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1092
  test('新規案件の業界分類が過去成功パターンと無関連なとき、類似度スコアが閾値未満でエラーになる', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.25),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newProjectData = {
      industry: 'AI・機械学習',
      companySize: '従業員5,000名以上',
      budget: '1000万円以上',
    };

    const successPatterns = [
      { id: 'p1', industry: '建設業', patternName: 'Construction Pattern' },
      { id: 'p2', industry: '製造業', patternName: 'Manufacturing Pattern' },
      { id: 'p3', industry: '小売業', patternName: 'Retail Pattern' },
    ];

    const result = findSimilarPatterns(
      newProjectData,
      successPatterns,
      mockAIRecommendationEngine
    );

    expect(result.isError).toBe(true);
    expect(result.errorType).toBe('PATTERN_RELEVANCE_BELOW_THRESHOLD');
    expect(result.userMessage).toBe(
      '新規案件の業界分類が過去成功パターンと無関連のため、推奨の生成ができません。営業担当者にご相談ください'
    );
    expect(result.relevanceScore).toBe(0.25);
    expect(result.threshold).toBe(0.5);
    expect(result.diagnosticInfo).toEqual({
      industry: 'AI・機械学習',
      score: 0.25,
      threshold: 0.5,
    });
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});