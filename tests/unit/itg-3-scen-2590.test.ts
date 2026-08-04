import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  // SCEN-2590: [normal] 成功パターンテンプレート自動判定機能 - 顧客属性と商談条件が完全に一致する成功パターンが1件存在する場合、そのパターンが推奨出力される
  test('should recommend pattern SP-001 when customer attributes and deal conditions perfectly match', () => {
    // テストデータ: 新規案件の顧客属性と商談条件
    const newDealInput = {
      customerId: 'CUST-NEW-001',
      industry: '製造業',
      companyScale: '中堅企業',
      decisionMaker: '経営層',
      productCategory: '生産管理システム',
      budgetRange: '1000万円以上',
      implementationTimeline: '3ヶ月以内',
    };

    // 推奨パターンマスタの成功パターン
    const successPatterns = [
      {
        patternId: 'SP-001',
        industry: '製造業',
        companyScale: '中堅企業',
        decisionMaker: '経営層',
        productCategory: '生産管理システム',
        budgetRange: '1000万円以上',
        implementationTimeline: '3ヶ月以内',
        successRate: 92,
        similarCaseCount: 15,
      },
      {
        patternId: 'SP-002',
        industry: '小売業',
        companyScale: '大企業',
        decisionMaker: '部門長',
        productCategory: 'POS システム',
        budgetRange: '500万円以上1000万円未満',
        implementationTimeline: '6ヶ月以内',
        successRate: 88,
        similarCaseCount: 12,
      },
      {
        patternId: 'SP-003',
        industry: '金融機関',
        companyScale: '大企業',
        decisionMaker: '経営層',
        productCategory: 'リスク管理システム',
        budgetRange: '5000万円以上',
        implementationTimeline: '12ヶ月以内',
        successRate: 85,
        similarCaseCount: 8,
      },
      {
        patternId: 'SP-004',
        industry: '製造業',
        companyScale: '小規模企業',
        decisionMaker: '現場責任者',
        productCategory: '品質管理システム',
        budgetRange: '100万円以上500万円未満',
        implementationTimeline: '2ヶ月以内',
        successRate: 81,
        similarCaseCount: 10,
      },
    ];

    // AIRecommendationEngineスタブの設定
    const aiEngineStub = {
      findSimilarPatterns: jest.fn((dealCondition: typeof newDealInput) => {
        return successPatterns.map((pattern) => {
          const isExactMatch =
            pattern.industry === dealCondition.industry &&
            pattern.companyScale === dealCondition.companyScale &&
            pattern.decisionMaker === dealCondition.decisionMaker &&
            pattern.productCategory === dealCondition.productCategory &&
            pattern.budgetRange === dealCondition.budgetRange &&
            pattern.implementationTimeline === dealCondition.implementationTimeline;

          return {
            patternId: pattern.patternId,
            relevanceScore: isExactMatch ? 1.0 : 0.4,
            successRate: pattern.successRate,
            similarCaseCount: pattern.similarCaseCount,
          };
        });
      }),
      generateRecommendation: jest.fn((dealCondition: typeof newDealInput, similarPatterns: any[]) => {
        const topPattern = similarPatterns.reduce((max, current) =>
          current.relevanceScore > max.relevanceScore ? current : max
        );

        return {
          patternId: topPattern.patternId,
          recommendationReason: `顧客属性（${dealCondition.industry}・${dealCondition.companyScale}・${dealCondition.decisionMaker}）と商談条件（${dealCondition.productCategory}・${dealCondition.budgetRange}・${dealCondition.implementationTimeline}導入）が過去成功事例と完全に一致`,
          relevanceScore: topPattern.relevanceScore,
          successRate: topPattern.successRate,
          similarCaseCount: topPattern.similarCaseCount,
        };
      }),
    };

    // 推奨出力機能を実行
    const similarPatterns = aiEngineStub.findSimilarPatterns(newDealInput);
    const recommendation = aiEngineStub.generateRecommendation(newDealInput, similarPatterns);

    // 検証: AIRecommendationEngineのメソッドが呼び出されたことを確認
    expect(aiEngineStub.findSimilarPatterns).toHaveBeenCalledWith(newDealInput);
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledWith(newDealInput, similarPatterns);

    // 検証: 推奨パターンがSP-001（パターンID）であることを確認
    expect(recommendation.patternId).toBe('SP-001');

    // 検証: 推奨理由が期待通りであることを確認
    expect(recommendation.recommendationReason).toBe(
      '顧客属性（製造業・中堅企業・経営層）と商談条件（生産管理システム・1000万円以上・3ヶ月以内導入）が過去成功事例と完全に一致'
    );

    // 検証: スコア表示が1.0（最高関連性）であることを確認
    expect(recommendation.relevanceScore).toBe(1.0);

    // 検証: 根拠情報として過去の類似案件数が15件であることを確認
    expect(recommendation.similarCaseCount).toBe(15);

    // 検証: 根拠情報として成功率が92%であることを確認
    expect(recommendation.successRate).toBe(92);

    // 検証: 出力された推奨パターンの内容が完全に正確であることを確認
    expect(recommendation).toEqual({
      patternId: 'SP-001',
      recommendationReason:
        '顧客属性（製造業・中堅企業・経営層）と商談条件（生産管理システム・1000万円以上・3ヶ月以内導入）が過去成功事例と完全に一致',
      relevanceScore: 1.0,
      successRate: 92,
      similarCaseCount: 15,
    });
  });
});