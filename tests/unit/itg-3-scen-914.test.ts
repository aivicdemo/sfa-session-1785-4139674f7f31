import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - 複数アプローチ推奨', () => {
  test('SCEN-914: 照合対象の提案アプローチが複数件のとき複数アプローチが推奨候補として返される', () => {
    // モック AIRecommendationEngine の stub 定義
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // findSimilarPatterns が複数の提案アプローチを返すようスタブを設定
    const mockSimilarPatterns = [
      {
        approachId: 'app-001',
        approachName: '初期接触で経営課題ヒアリング',
        relevanceScore: 0.95,
        reasoning: '製造業CFO層への初期接触において経営課題の深掘りが成功パターン',
      },
      {
        approachId: 'app-002',
        approachName: '業界ベストプラクティス提示',
        relevanceScore: 0.87,
        reasoning: '同業種の事例提示により予算規模5000万円以上の案件での成約率が向上',
      },
      {
        approachId: 'app-003',
        approachName: 'ROIシミュレーション先行提示',
        relevanceScore: 0.76,
        reasoning: 'CFO決裁者に対するROI数値化により購買判断の加速が確認',
      },
    ];

    mockAIEngine.findSimilarPatterns.mockReturnValue(mockSimilarPatterns);
    mockAIEngine.generateRecommendation.mockReturnValue({
      recommendedApproaches: mockSimilarPatterns.sort(
        (a, b) => b.relevanceScore - a.relevanceScore
      ),
      confidenceScore: 0.88,
    });

    // 新規案件の顧客・商談条件
    const dealCondition = {
      industry: '製造業',
      decisionMaker: 'CFO',
      budgetAmount: 50000000,
      dealStage: '初期接触',
    };

    // 推奨機能を呼び出し
    const result = generateRecommendation(dealCondition, mockAIEngine);

    // 推奨アプローチが3件以上であることを確認
    expect(result.recommendedApproaches.length).toBeGreaterThanOrEqual(3);

    // 各推奨アプローチの必須フィールドが存在することを確認
    result.recommendedApproaches.forEach((approach) => {
      expect(approach.approachId).toBeDefined();
      expect(typeof approach.approachId).toBe('string');
      expect(approach.approachName).toBeDefined();
      expect(typeof approach.approachName).toBe('string');
      expect(approach.relevanceScore).toBeDefined();
      expect(typeof approach.relevanceScore).toBe('number');
      expect(approach.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(approach.relevanceScore).toBeLessThanOrEqual(1);
      expect(approach.reasoning).toBeDefined();
      expect(typeof approach.reasoning).toBe('string');
    });

    // 推奨アプローチが relevanceScore 降順でソートされていることを確認
    for (let i = 0; i < result.recommendedApproaches.length - 1; i++) {
      expect(result.recommendedApproaches[i].relevanceScore).toBeGreaterThanOrEqual(
        result.recommendedApproaches[i + 1].relevanceScore
      );
    }

    // 具体的なスコア値と順序を検証
    expect(result.recommendedApproaches[0].approachId).toBe('app-001');
    expect(result.recommendedApproaches[0].relevanceScore).toBe(0.95);
    expect(result.recommendedApproaches[1].approachId).toBe('app-002');
    expect(result.recommendedApproaches[1].relevanceScore).toBe(0.87);
    expect(result.recommendedApproaches[2].approachId).toBe('app-003');
    expect(result.recommendedApproaches[2].relevanceScore).toBe(0.76);

    // AIエンジンが正しく呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      dealCondition,
      expect.any(Object)
    );
  });
});