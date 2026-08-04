import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・提案アプローチ推奨機能', () => {
  // SCEN-2841
  test('新規案件の顧客属性が過去成功パターンと異なった場合、適用可能スコアが低く算出される', () => {
    // セットアップ: 過去成功パターンデータ
    const successPatternA = {
      id: 'pattern-001',
      customerType: 'large_enterprise',
      budgetMin: 50000000,
      budgetMax: 100000000,
      decisionMaker: 'it_department',
      approachDescription: 'Large enterprise IT-driven approach',
      successRate: 0.85,
    };

    const successPatternB = {
      id: 'pattern-002',
      customerType: 'mid_market',
      budgetMin: 10000000,
      budgetMax: 50000000,
      decisionMaker: 'executive',
      approachDescription: 'Mid-market executive decision approach',
      successRate: 0.75,
    };

    // 新規案件データ
    const newDealData = {
      customerId: 'customer-new-001',
      customerType: 'startup',
      budget: 2000000,
      decisionMaker: 'technical_lead',
      industry: 'technology',
      companySize: 'small',
    };

    // AIRecommendationEngine をスタブ化
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((pattern, deal) => {
        if (pattern.id === 'pattern-001') {
          return 0.15;
        }
        if (pattern.id === 'pattern-002') {
          return 0.72;
        }
        return 0;
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // スタブのレスポンスを設定
    const recommendationResult = {
      dealId: 'deal-001',
      patterns: [
        {
          patternId: 'pattern-002',
          relevanceScore: 0.72,
          ranking: 1,
          approachDescription: 'Mid-market executive decision approach',
          reasoning: 'New deal budget (2,000,000 yen) is closer to success pattern B (10,000,000-50,000,000 yen). Pattern A budget requirement (50,000,000+ yen) significantly differs, making applicability low.',
        },
        {
          patternId: 'pattern-001',
          relevanceScore: 0.15,
          ranking: 2,
          approachDescription: 'Large enterprise IT-driven approach',
          reasoning: 'New deal budget (2,000,000 yen) is significantly different from pattern A requirement (50,000,000+ yen). Pattern A applicability is low.',
        },
      ],
      primaryRecommendation: {
        patternId: 'pattern-002',
        proposedApproach: 'Tailor mid-market executive approach for startup context',
        confidenceScore: 0.68,
      },
    };

    mockAIEngine.generateRecommendation.mockReturnValue(recommendationResult);

    // 関数を呼び出し
    const result = generateRecommendation(newDealData, mockAIEngine);

    // 検証: 適用可能スコアが期待範囲内
    expect(result.patterns[0].relevanceScore).toBe(0.72);
    expect(result.patterns[1].relevanceScore).toBe(0.15);

    // 検証: 最も高いスコア（0.72）を持つパターンBが最優先推奨
    expect(result.patterns[0].ranking).toBe(1);
    expect(result.patterns[0].patternId).toBe('pattern-002');

    // 検証: 理由説明に差分が含まれている
    expect(result.patterns[1].reasoning).toMatch(/新規案件の予算規模.*200万円/);
    expect(result.patterns[1].reasoning).toMatch(/成功パターンA.*5000万円以上/);
    expect(result.patterns[1].reasoning).toMatch(/大きく異なる/);
    expect(result.patterns[1].reasoning).toMatch(/適用可能性は低い/);

    // 検証: スコアの順序が正しい（降順）
    expect(result.patterns[0].relevanceScore).toBeGreaterThan(result.patterns[1].relevanceScore);

    // 検証: プライマリ推奨がスコア最高のパターン
    expect(result.primaryRecommendation.patternId).toBe('pattern-002');

    // 検証: mockAIEngine が正しく呼ばれたこと
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newDealData, mockAIEngine);
  });
});