import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への適用推奨', () => {
  // SCEN-2134
  test('生成された提案アプローチが空文字列のとき、エラーが発生し代替表示される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '',
        similarPatterns: [],
        confidenceScore: 0,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PATTERN-001',
          customerIndustry: 'IT',
          customerSize: 'large',
          dealAmount: 5000000,
          successRate: 0.85,
          proposalApproach: 'クラウド導入による業務効率化提案',
          successCriteria: '経営課題の明確化と予算確保',
        },
      ]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = [
      {
        patternId: 'PATTERN-001',
        customerIndustry: 'IT',
        customerSize: 'large',
        dealAmount: 5000000,
        proposalApproach: 'クラウド導入による業務効率化提案',
        successRate: 0.85,
        applicableConditions: '経営課題が経営効率化である場合',
      },
      {
        patternId: 'PATTERN-002',
        customerIndustry: 'Manufacturing',
        customerSize: 'medium',
        dealAmount: 3000000,
        proposalApproach: 'デジタル変革による製造プロセス最適化',
        successRate: 0.78,
        applicableConditions: '製造効率向上が課題である場合',
      },
    ];

    const newDealInput = {
      customerId: 'CUST-NEW-001',
      customerName: '新規顧客A株式会社',
      customerIndustry: 'IT',
      customerSize: 'large',
      businessChallenge: '経営効率化',
      dealAmount: 5500000,
      proposalPhase: 'initial_contact',
    };

    const result = await generateRecommendation(
      newDealInput,
      mockAIEngine,
      mockPatternMaster,
    );

    expect(result).toEqual({
      success: false,
      errorCode: 'EMPTY_RECOMMENDATION_APPROACH',
      errorMessage:
        '生成された提案アプローチが空文字列です。AIエンジンから有効な推奨内容が返却されませんでした。',
      userMessage:
        '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      fallbackRecommendations: [
        {
          patternId: 'PATTERN-001',
          customerIndustry: 'IT',
          customerSize: 'large',
          dealAmount: 5000000,
          proposalApproach: 'クラウド導入による業務効率化提案',
          successRate: 0.85,
          applicableConditions: '経営課題が経営効率化である場合',
        },
      ],
      confidenceScore: 0,
    });
  });
});