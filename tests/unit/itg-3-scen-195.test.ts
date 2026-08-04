import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し提案アプローチを推奨する機能', () => {
  // SCEN-195
  test('新規案件条件に合致する過去成功パターン複数件から適用可能性スコア降順で推奨される', () => {
    // テストデータ: 新規案件の顧客・商談条件
    const newDealCondition = {
      industry: 'IT/SaaS',
      companyScale: 'mid_enterprise',
      challenges: ['cost_reduction', 'efficiency_improvement'],
      budget: 5000000,
      budgetMax: 10000000,
      decisionMaker: 'CTO'
    };

    // テストデータ: 過去成功パターン（スコアが異なる状態）
    const pastSuccessPatterns = [
      {
        id: 'pattern_a',
        name: 'SaaS型コスト最適化ソリューション + 段階導入アプローチ',
        industry: 'IT/SaaS',
        companyScale: 'mid_enterprise',
        challenges: ['cost_reduction', 'efficiency_improvement'],
        budgetRange: { min: 3000000, max: 12000000 },
        relevanceScore: 0.95,
        reasoning: '業種・規模・課題・予算帯が完全に合致。段階導入により導入リスク低減。'
      },
      {
        id: 'pattern_b',
        name: '基本パッケージ + カスタマイズ提案',
        industry: 'IT/SaaS',
        companyScale: 'mid_enterprise',
        challenges: ['efficiency_improvement'],
        budgetRange: { min: 2000000, max: 8000000 },
        relevanceScore: 0.87,
        reasoning: '業種・規模は合致だが課題が部分的。予算上限がやや低い。'
      },
      {
        id: 'pattern_c',
        name: 'エンタープライズ統合ソリューション + 導入支援',
        industry: 'IT/SaaS',
        companyScale: 'mid_enterprise',
        challenges: ['cost_reduction', 'efficiency_improvement'],
        budgetRange: { min: 4000000, max: 15000000 },
        relevanceScore: 0.92,
        reasoning: '全要件合致。導入支援により顧客成功を確保。'
      }
    ];

    // AIRecommendationEngine スタブ
    const stubAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([
        pastSuccessPatterns[0],
        pastSuccessPatterns[2],
        pastSuccessPatterns[1]
      ]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
        .mockImplementation((pattern) => {
          if (pattern.id === 'pattern_a') return 0.95;
          if (pattern.id === 'pattern_c') return 0.92;
          if (pattern.id === 'pattern_b') return 0.87;
          return 0;
        })
    };

    // 推奨機能の実行
    const result = generateRecommendation(newDealCondition, stubAIEngine);

    // 検証: 戻り値のリストに3件以上の推奨アプローチが含まれる
    expect(result.recommendations).toHaveLength(3);

    // 検証: リスト内のすべての提案アプローチが適用可能性スコアの降順で整列
    expect(result.recommendations[0].applicabilityScore).toBe(0.95);
    expect(result.recommendations[1].applicabilityScore).toBe(0.92);
    expect(result.recommendations[2].applicabilityScore).toBe(0.87);
    expect(result.recommendations[0].applicabilityScore).toBeGreaterThanOrEqual(result.recommendations[1].applicabilityScore);
    expect(result.recommendations[1].applicabilityScore).toBeGreaterThanOrEqual(result.recommendations[2].applicabilityScore);

    // 検証: 各提案アプローチに適用可能性スコア、提案アプローチ名、根拠説明が含まれる
    result.recommendations.forEach((recommendation) => {
      expect(recommendation).toHaveProperty('applicabilityScore');
      expect(recommendation).toHaveProperty('approachName');
      expect(recommendation).toHaveProperty('reasoning');
      expect(typeof recommendation.applicabilityScore).toBe('number');
      expect(typeof recommendation.approachName).toBe('string');
      expect(typeof recommendation.reasoning).toBe('string');
    });

    // 検証: 最上位アプローチ（スコア0.95）の詳細内容が新規案件に適合した具体的営業施策
    const topRecommendation = result.recommendations[0];
    expect(topRecommendation.approachName).toBe('SaaS型コスト最適化ソリューション + 段階導入アプローチ');
    expect(topRecommendation.applicabilityScore).toBe(0.95);
    expect(topRecommendation.reasoning).toContain('業種');
    expect(topRecommendation.reasoning).toContain('規模');
    expect(topRecommendation.reasoning).toContain('課題');
  });
});