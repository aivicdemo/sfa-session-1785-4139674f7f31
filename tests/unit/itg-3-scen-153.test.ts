import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - 新規案件条件が既存パターンと全く一致しない場合', () => {
  // SCEN-153
  test('新規案件の条件が既存の成功パターンと全く一致しない場合に推奨が保留される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealCondition = {
      customer_industry: '半導体製造',
      company_size: '従業員5000名以上',
      decision_process: '複数部門の承認が必要',
      budget_scale: 5000000,
      implementation_timeline: 12,
    };

    const existingSuccessPatterns = [
      {
        pattern_id: 'pat_001',
        industry: '中小卸売業',
        company_size: '従業員50～100名',
        decision_process: '単一部門決定',
        budget_range: '100万円以下',
        relevance_score: 0.15,
      },
      {
        pattern_id: 'pat_002',
        industry: '建設業',
        company_size: '従業員200～500名',
        decision_process: '経営層決定',
        budget_range: '300万円以下',
        relevance_score: 0.25,
      },
      {
        pattern_id: 'pat_003',
        industry: '飲食チェーン',
        company_size: '従業員100～200名',
        decision_process: '複数店舗承認',
        budget_range: '200万円以下',
        relevance_score: 0.2,
      },
    ];

    mockAIRecommendationEngine.evaluatePatternRelevance.mockImplementation(
      (condition: typeof newDealCondition, pattern: typeof existingSuccessPatterns[0]) => {
        return pattern.relevance_score;
      }
    );

    mockAIRecommendationEngine.findSimilarPatterns.mockReturnValue([]);

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue({
      status: 'PENDING',
      message:
        '該当案件に適用可能な過去成功パターンが見つかりませんでした。提案アプローチの推奨を保留しています。営業担当者による判断をお待ちください。',
      recommendation: null,
      similarPatterns: [],
      reasoningExplanation: null,
    });

    const result = await generateRecommendation(
      newDealCondition,
      existingSuccessPatterns,
      mockAIRecommendationEngine
    );

    expect(result.status).toBe('PENDING');
    expect(result.message).toBe(
      '該当案件に適用可能な過去成功パターンが見つかりませんでした。提案アプローチの推奨を保留しています。営業担当者による判断をお待ちください。'
    );
    expect(result.recommendation).toBeNull();
    expect(result.similarPatterns).toEqual([]);
    expect(result.reasoningExplanation).toBeNull();
  });
});