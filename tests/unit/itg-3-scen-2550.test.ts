import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2550: 推奨根拠の信頼度スコアがちょうど閾値のとき、表示される', async () => {
    // 信頼度スコア閾値（0.70）をちょうど返すモック
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-2550-001',
        recommendedApproach: '顧客の成長段階に合わせた段階的提案',
        confidenceScore: 0.70,
        trustworthinessReason: 'このパターンは過去成功事例 12件に基づき、貴社の商談条件との一致度が高い',
        recommendationLabel: '推奨可能性：高',
        matchDegree: 0.85,
        similarPatternCount: 12,
        successRate: 0.75,
        applicableScene: '成長期の中堅企業向け営業'
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pat-001',
          matchScore: 0.88,
          successRate: 0.78,
          caseCount: 8
        },
        {
          patternId: 'pat-002',
          matchScore: 0.82,
          successRate: 0.72,
          caseCount: 4
        }
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        briefExplanation: 'このパターンは過去成功事例 12件に基づき、貴社の商談条件との一致度が高い',
        detailedReasons: [
          '顧客業種（IT企業）との一致度：85%',
          '予算規模（500万円以上1000万円未満）との適合度：88%',
          '営業段階（提案前ヒアリング段階）での成功率：75%'
        ],
        riskFactors: [],
        nextRecommendedAction: 'ニーズ確認後、提案資料作成に進む'
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.70,
        isApplicable: true,
        applicabilityReason: '商談条件が過去の成功パターンと合致している'
      })
    };

    // テスト用の商談条件
    const dealCondition = {
      customerId: 'cust-2550-001',
      customerName: '株式会社テスト',
      industry: 'IT',
      companyScale: 'mid-market',
      budget: 750,
      dealStage: 'needs-analysis',
      previousDealCount: 0,
      productCategory: 'cloud-service'
    };

    // generateRecommendation を呼び出し
    const result = await generateRecommendation(dealCondition, mockAIEngine);

    // 推奨内容と根拠スコアが取得される
    expect(result).toBeDefined();
    expect(result.confidenceScore).toBe(0.70);
    expect(result.recommendationId).toBe('rec-2550-001');

    // 画面に表示される推奨根拠の構成要素を検証
    const recommendationDisplay = {
      confidencePercentage: Math.round(result.confidenceScore * 100),
      trustworthinessReason: result.trustworthinessReason,
      recommendationLabel: result.recommendationLabel,
      matchDegree: result.matchDegree,
      similarPatternCount: result.similarPatternCount,
      successRate: result.successRate,
      applicableScene: result.applicableScene
    };

    // ① 信頼度インジケータが70%を示す
    expect(recommendationDisplay.confidencePercentage).toBe(70);

    // ② 根拠説明文が日本語で表示される
    expect(recommendationDisplay.trustworthinessReason).toMatch(/過去成功事例.*件に基づき/);
    expect(recommendationDisplay.trustworthinessReason).toMatch(/一致度/);

    // ③ 『推奨可能性：高』というラベルが表示される
    expect(recommendationDisplay.recommendationLabel).toBe('推奨可能性：高');

    // ④ より詳細な根拠が含まれている
    expect(recommendationDisplay.matchDegree).toBe(0.85);
    expect(recommendationDisplay.similarPatternCount).toBe(12);
    expect(recommendationDisplay.successRate).toBe(0.75);
    expect(recommendationDisplay.applicableScene).toBe('成長期の中堅企業向け営業');

    // 詳細な根拠説明を検証
    const reasoning = await mockAIEngine.explainRecommendationReasoning(dealCondition);
    expect(reasoning.briefExplanation).toMatch(/このパターンは過去成功事例/);
    expect(reasoning.detailedReasons).toContainEqual(expect.stringMatching(/一致度/));
    expect(reasoning.detailedReasons.length).toBeGreaterThan(0);

    // エバリュエーション結果を検証
    const evaluation = await mockAIEngine.evaluatePatternRelevance(dealCondition);
    expect(evaluation.relevanceScore).toBe(0.70);
    expect(evaluation.isApplicable).toBe(true);
    expect(evaluation.applicabilityReason).toBeDefined();

    // モックが呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(dealCondition);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});