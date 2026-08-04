import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-041: [normal] 推奨内容生成機能 - 適用可能な成功パターンが0件の場合に代替提案が正常に返される
  test('適用可能な成功パターンが0件の場合、代替提案が簡略版根拠説明とフラグ付きで返却される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.65),
    };

    const mockPatternMaster = [
      {
        id: 'pattern_001',
        rank: 1,
        successRate: 0.92,
        customerIndustry: '製造業',
        budgetRange: '500万～1000万',
        productCategory: 'ERP',
        approachName: '経営効率化提案',
        successCount: 45,
      },
      {
        id: 'pattern_002',
        rank: 2,
        successRate: 0.88,
        customerIndustry: '流通業',
        budgetRange: '1000万～2000万',
        productCategory: 'SCM',
        approachName: 'サプライチェーン最適化提案',
        successCount: 38,
      },
      {
        id: 'pattern_003',
        rank: 3,
        successRate: 0.85,
        customerIndustry: '金融',
        budgetRange: '2000万～5000万',
        productCategory: 'コンプライアンス',
        approachName: 'リスク管理統合提案',
        successCount: 32,
      },
      {
        id: 'pattern_004',
        rank: 4,
        successRate: 0.83,
        customerIndustry: '卸売業',
        budgetRange: '300万～700万',
        productCategory: 'DMS',
        approachName: '販売管理自動化提案',
        successCount: 28,
      },
      {
        id: 'pattern_005',
        rank: 5,
        successRate: 0.81,
        customerIndustry: '建設業',
        budgetRange: '700万～1500万',
        productCategory: 'PM',
        approachName: 'プロジェクト管理効率化提案',
        successCount: 24,
      },
    ];

    const dealCondition = {
      customerIndustry: 'コンサルティング',
      customerScale: '中堅企業',
      budgetRange: '800万～1500万',
      productCategory: 'BI',
      salesStage: '初期接触',
      decisionMakerRole: '経営企画部長',
    };

    const result = generateRecommendation(
      dealCondition,
      mockAIRecommendationEngine,
      mockPatternMaster
    );

    expect(result).toBeDefined();
    expect(result.isAlternativeProposal).toBe(true);
    expect(result.recommendations).toHaveLength(5);
    expect(result.recommendations[0].id).toBe('pattern_001');
    expect(result.recommendations[0].successRate).toBe(0.92);
    expect(result.recommendations[4].id).toBe('pattern_005');
    expect(result.recommendations[4].successRate).toBe(0.81);
    expect(result.recommendations.every((rec) => rec.reasoning.length < 100)).toBe(
      true
    );
    expect(result.recommendations[0].reasoning).toMatch(/経営効率化/);
    expect(result.statusCode).toBe(200);
    expect(result.message).toBeUndefined();
  });
});