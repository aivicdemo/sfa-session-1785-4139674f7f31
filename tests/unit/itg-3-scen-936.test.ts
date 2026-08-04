import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 商談条件マスタ単一マッチ', () => {
  test('SCEN-936: 商談条件マスタから現在の案件に合致する条件が1件の場合、その条件を使用して成功パターンの照合が実行される', () => {
    // Arrange: テストデータとして商談条件マスタから合致する条件を定義
    const dealConditionMaster = [
      {
        conditionId: 'COND-001',
        industry: 'IT',
        budgetRange: '1000万円以上',
        decisionPeriod: '3ヶ月以内'
      }
    ];

    // 現在の案件情報を定義
    const currentDealInfo = {
      customerIndustry: 'IT',
      budgetRange: '1000万円以上',
      decisionPeriod: '3ヶ月以内'
    };

    // AIRecommendationEngineのスタブを作成
    let findSimilarPatternsCallCount = 0;
    let evaluatePatternRelevanceCallCount = 0;
    let findSimilarPatternsCalledWithCondition: string | null = null;

    const stubAIRecommendationEngine = {
      generateRecommendation: jest.fn(async (condition: any) => {
        return {
          recommendationId: 'REC-001',
          proposalApproach: '段階的導入アプローチ',
          rationale: 'IT業界の1000万円以上予算案件は段階的導入により成功率が95%'
        };
      }),
      findSimilarPatterns: jest.fn(async (condition: any) => {
        findSimilarPatternsCallCount += 1;
        findSimilarPatternsCalledWithCondition = condition.conditionId;
        return [
          {
            patternId: 'PAT-IT-001',
            industry: 'IT',
            budgetRange: '1000万円以上',
            decisionPeriod: '3ヶ月以内',
            successCount: 12,
            totalCount: 13
          }
        ];
      }),
      evaluatePatternRelevance: jest.fn(async (pattern: any, condition: any) => {
        evaluatePatternRelevanceCallCount += 1;
        return {
          relevanceScore: 0.95,
          applicability: true
        };
      }),
      explainRecommendationReasoning: jest.fn(async (recommendation: any) => {
        return '過去の類似案件では段階的導入により、スコープの明確化と段階ごとの効果検証が可能になり、契約率が向上しました。';
      })
    };

    // Act: generateRecommendationメソッドを呼び出す
    const result = generateRecommendation(
      currentDealInfo,
      dealConditionMaster,
      stubAIRecommendationEngine
    );

    // Assert: 商談条件マスタから条件ID='COND-001'が特定されたことを確認
    expect(result.matchedConditionId).toBe('COND-001');

    // AIRecommendationEngine.findSimilarPatternsが呼び出されたことを確認
    expect(findSimilarPatternsCallCount).toBe(1);
    expect(findSimilarPatternsCalledWithCondition).toBe('COND-001');

    // AIRecommendationEngine.evaluatePatternRelevanceが呼び出されたことを確認
    expect(evaluatePatternRelevanceCallCount).toBe(1);

    // generateRecommendationメソッドの戻り値を確認
    expect(result.recommendationPatternId).toBe('PAT-IT-001');
    expect(result.relevanceScore).toBe(0.95);
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0.95);
    expect(result.proposalApproach).toBe('段階的導入アプローチ');
    expect(result.rationale).toBeDefined();
    expect(typeof result.rationale).toBe('string');
    expect(result.rationale.length).toBeGreaterThan(0);

    // AIRecommendationEngine各メソッドが正確に1回ずつ呼び出されたことを確認
    expect(stubAIRecommendationEngine.findSimilarPatterns.mock.calls.length).toBe(1);
    expect(stubAIRecommendationEngine.evaluatePatternRelevance.mock.calls.length).toBe(1);
  });
});