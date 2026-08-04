import { generateRecommendationWithRelevanceScores } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2720
  test('推奨提案アプローチに対する適用可能性スコアが算出され、営業担当者に提示される', () => {
    // テストデータ: 過去の成功商談3件（業種：IT、商品：クラウドサービス、成約率：85%）
    const successPatterns = [
      {
        patternId: 'pattern_1',
        industry: 'IT',
        product: 'クラウドサービス',
        successRate: 0.85,
        description: '過去の類似案件（IT業種、クラウド商品）において成約に至ったアプローチ'
      },
      {
        patternId: 'pattern_2',
        industry: 'IT',
        product: 'クラウドサービス',
        successRate: 0.85,
        description: '過去の類似案件（IT業種、クラウド商品）において成約に至ったアプローチ'
      },
      {
        patternId: 'pattern_3',
        industry: 'IT',
        product: 'クラウドサービス',
        successRate: 0.85,
        description: '過去の類似案件（IT業種、クラウド商品）において成約に至ったアプローチ'
      }
    ];

    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            patternId: 'pattern_1',
            relevanceScore: 0.92,
            scorePercentage: 92,
            scoreLevelLabel: '高',
            reasoning: '過去の類似案件（IT業種、クラウド商品）において成約に至ったアプローチ'
          },
          {
            patternId: 'pattern_2',
            relevanceScore: 0.78,
            scorePercentage: 78,
            scoreLevelLabel: '中',
            reasoning: '過去の類似案件（IT業種、クラウド商品）において成約に至ったアプローチ'
          },
          {
            patternId: 'pattern_3',
            relevanceScore: 0.65,
            scorePercentage: 65,
            scoreLevelLabel: '中',
            reasoning: '過去の類似案件（IT業種、クラウド商品）において成約に至ったアプローチ'
          }
        ]
      }),
      evaluatePatternRelevance: jest.fn()
        .mockResolvedValueOnce(0.92)
        .mockResolvedValueOnce(0.78)
        .mockResolvedValueOnce(0.65)
    };

    // 新規案件データ（顧客：IT企業、商談条件：クラウド導入検討、予算規模：中規模）
    const newOpportunity = {
      customerId: 'cust_12345',
      customerIndustry: 'IT',
      dealCondition: 'クラウド導入検討',
      budgetScale: '中規模',
      productCategory: 'クラウドサービス'
    };

    // generateRecommendationメソッドを呼び出して推奨を取得
    const result = generateRecommendationWithRelevanceScores(
      newOpportunity,
      successPatterns,
      mockAIEngine
    );

    // 期待結果の検証
    // 1. 推奨提案アプローチが3件表示される
    expect(result.recommendations).toHaveLength(3);

    // 2. 各アプローチに対して適用可能性スコアが提示される
    expect(result.recommendations[0]).toMatchObject({
      patternId: 'pattern_1',
      scorePercentage: 92,
      scoreLevelLabel: '高'
    });

    expect(result.recommendations[1]).toMatchObject({
      patternId: 'pattern_2',
      scorePercentage: 78,
      scoreLevelLabel: '中'
    });

    expect(result.recommendations[2]).toMatchObject({
      patternId: 'pattern_3',
      scorePercentage: 65,
      scoreLevelLabel: '中'
    });

    // 3. スコアがパーセンテージで表示されている
    expect(result.recommendations[0].scorePercentage).toBe(92);
    expect(result.recommendations[1].scorePercentage).toBe(78);
    expect(result.recommendations[2].scorePercentage).toBe(65);

    // 4. 降順（92% → 78% → 65%）にソートされている
    expect(result.recommendations[0].scorePercentage).toBeGreaterThan(
      result.recommendations[1].scorePercentage
    );
    expect(result.recommendations[1].scorePercentage).toBeGreaterThan(
      result.recommendations[2].scorePercentage
    );

    // 5. 各スコアの横に根拠説明テキストが表示されている
    expect(result.recommendations[0].reasoning).toBe(
      '過去の類似案件（IT業種、クラウド商品）において成約に至ったアプローチ'
    );
    expect(result.recommendations[1].reasoning).toBe(
      '過去の類似案件（IT業種、クラウド商品）において成約に至ったアプローチ'
    );
    expect(result.recommendations[2].reasoning).toBe(
      '過去の類似案件（IT業種、クラウド商品）において成約に至ったアプローチ'
    );

    // 6. 推奨内容が構造化されている
    expect(result).toHaveProperty('recommendations');
    expect(result.recommendations[0]).toHaveProperty('patternId');
    expect(result.recommendations[0]).toHaveProperty('relevanceScore');
    expect(result.recommendations[0]).toHaveProperty('scorePercentage');
    expect(result.recommendations[0]).toHaveProperty('scoreLevelLabel');
    expect(result.recommendations[0]).toHaveProperty('reasoning');
  });
});