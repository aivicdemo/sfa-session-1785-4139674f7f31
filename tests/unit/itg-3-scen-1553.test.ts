import { generateRecommendationApproach } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ自動推奨', () => {
  // SCEN-1553
  test('OpenAI APIが正常応答した場合、生成AIから取得した成功パターンと提案アプローチが返却される', async () => {
    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        successPatterns: [
          {
            pastCaseId: 'CASE-001',
            customerIndustry: '製造業',
            proposalContent: 'クラウド基幹システム導入',
            contractAmount: 5000000,
            contractPeriodDays: 180,
            explanation: '同業種の製造業における基幹システム導入は6ヶ月で完了し、運用効率が30%向上した事例'
          },
          {
            pastCaseId: 'CASE-002',
            customerIndustry: '製造業',
            proposalContent: 'データ分析基盤構築',
            contractAmount: 3000000,
            contractPeriodDays: 120,
            explanation: '生産管理データの可視化により、不良率が15%削減された成功事例'
          },
          {
            pastCaseId: 'CASE-003',
            customerIndustry: '製造業',
            proposalContent: 'AI予測保全システム導入',
            contractAmount: 4500000,
            contractPeriodDays: 150,
            explanation: '予測保全の導入により、機械停止時間が40%削減された事例'
          }
        ],
        proposalApproaches: [
          {
            approachName: '段階的導入アプローチ',
            concreteAction: 'Phase 1: 要件定義・設計（4週間）、Phase 2: 開発・テスト（8週間）、Phase 3: 本番運用（4週間）',
            priority: 'High',
            expectedSuccessRate: 0.85
          },
          {
            approachName: 'プロトタイプ検証アプローチ',
            concreteAction: 'まず部門単位でのパイロット運用を実施し、成果を検証してから全社展開する',
            priority: 'High',
            expectedSuccessRate: 0.80
          },
          {
            approachName: 'ROI最適化アプローチ',
            concreteAction: '初年度の投資対効果を明確化し、経営層への説得資料を整備してから本提案を実施する',
            priority: 'Medium',
            expectedSuccessRate: 0.75
          }
        ],
        confidenceScore: 0.78
      })
    };

    const input_deal_condition = {
      newCustomerIndustry: '製造業',
      newCustomerScale: '従業員500名',
      budgetRange: '3000万～5000万円',
      businessChallenge: '生産効率の向上と品質管理の強化',
      competitorInfo: '競合他社は同等システムで運用効率20%向上を実現'
    };

    const result = await generateRecommendationApproach(
      input_deal_condition,
      mock_ai_engine
    );

    expect(result.successPatterns).toHaveLength(3);
    expect(result.successPatterns[0]).toEqual({
      pastCaseId: 'CASE-001',
      customerIndustry: '製造業',
      proposalContent: 'クラウド基幹システム導入',
      contractAmount: 5000000,
      contractPeriodDays: 180,
      explanation: '同業種の製造業における基幹システム導入は6ヶ月で完了し、運用効率が30%向上した事例'
    });

    expect(result.proposalApproaches.length).toBeGreaterThanOrEqual(3);
    expect(result.proposalApproaches[0]).toHaveProperty('approachName');
    expect(result.proposalApproaches[0]).toHaveProperty('concreteAction');
    expect(result.proposalApproaches[0]).toHaveProperty('priority');
    expect(result.proposalApproaches[0]).toHaveProperty('expectedSuccessRate');

    expect(result.proposalApproaches[0].priority).toBe('High');
    expect(result.proposalApproaches[0].expectedSuccessRate).toBe(0.85);

    result.successPatterns.forEach(pattern => {
      expect(pattern.explanation).toBeDefined();
      expect(typeof pattern.explanation).toBe('string');
      expect(pattern.explanation.length).toBeGreaterThan(0);
    });

    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.7);
    expect(result.confidenceScore).toBe(0.78);
  });
});