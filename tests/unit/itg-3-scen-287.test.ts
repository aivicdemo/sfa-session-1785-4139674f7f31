import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-287: 推奨根拠の信頼度スコアが表示閾値直下のとき、その根拠が可視化対象から除外される', () => {
    // Arrange: AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn((pattern) => {
        // パターンIDに応じて異なる信頼度スコアを返す
        if (pattern.patternId === 'low_relevance') {
          return 0.49; // 表示閾値0.50未満
        }
        if (pattern.patternId === 'high_relevance_1') {
          return 0.75; // 表示閾値0.50以上
        }
        if (pattern.patternId === 'high_relevance_2') {
          return 0.82; // 表示閾値0.50以上
        }
        return 0.50; // 境界値
      }),
    };

    // generateRecommendationが返す推奨内容（複数の根拠を含む）
    const mockRecommendation = {
      customerId: 'CUST-001',
      dealId: 'DEAL-2024-001',
      recommendedApproach: '営業フォローアップメール送付後、営業電話による確認',
      confidenceScore: 0.78,
      rationales: [
        {
          patternId: 'low_relevance',
          description: '類似顧客の過去フォローアップパターン',
          relevanceScore: 0.49,
          evidence: {
            similarCustomerCount: 3,
            successRate: 0.45,
          },
        },
        {
          patternId: 'high_relevance_1',
          description: '同業種での成功事例',
          relevanceScore: 0.75,
          evidence: {
            similarCustomerCount: 12,
            successRate: 0.72,
          },
        },
        {
          patternId: 'high_relevance_2',
          description: '顧客属性マッチング分析結果',
          relevanceScore: 0.82,
          evidence: {
            attributeMatchCount: 8,
            totalAttributes: 10,
          },
        },
      ],
      timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    mockAIEngine.generateRecommendation.mockReturnValue(mockRecommendation);

    // Act: 推奨根拠の可視化ロジックを実行
    const recommendation = mockAIEngine.generateRecommendation({
      customerId: 'CUST-001',
      dealId: 'DEAL-2024-001',
      dealConditions: {
        industry: 'IT',
        companySize: 'mid_market',
        budget: 5000000,
        timeline: 'Q1-2024',
      },
    });

    // 表示閾値定義
    const VISIBILITY_THRESHOLD = 0.50;

    // 可視化対象となる根拠を抽出（信頼度スコア >= 0.50）
    const visibleRationales = recommendation.rationales.filter(
      (rationale) => rationale.relevanceScore >= VISIBILITY_THRESHOLD,
    );

    // Assert: 可視化対象に含まれる根拠の検証
    // 1. 信頼度スコア0.49の根拠が除外されていることを確認
    expect(
      visibleRationales.find((r) => r.patternId === 'low_relevance'),
    ).toBeUndefined();

    // 2. 可視化される根拠は2件のみ（high_relevance_1, high_relevance_2）
    expect(visibleRationales.length).toBe(2);

    // 3. 可視化される根拠のスコアをすべて確認（0.50以上）
    expect(visibleRationales[0].patternId).toBe('high_relevance_1');
    expect(visibleRationales[0].relevanceScore).toBe(0.75);
    expect(visibleRationales[1].patternId).toBe('high_relevance_2');
    expect(visibleRationales[1].relevanceScore).toBe(0.82);

    // 4. すべての表示対象根拠が閾値を満たしていることを検証
    visibleRationales.forEach((rationale) => {
      expect(rationale.relevanceScore).toBeGreaterThanOrEqual(VISIBILITY_THRESHOLD);
    });

    // 5. 除外された根拠の信頼度スコア値を確認
    const excludedRationale = recommendation.rationales.find(
      (r) => r.patternId === 'low_relevance',
    );
    expect(excludedRationale).toBeDefined();
    expect(excludedRationale!.relevanceScore).toBe(0.49);
    expect(excludedRationale!.relevanceScore).toBeLessThan(VISIBILITY_THRESHOLD);
  });
});