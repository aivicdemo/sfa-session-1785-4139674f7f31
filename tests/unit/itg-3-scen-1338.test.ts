import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('新規案件への成功パターン推奨機能', () => {
  test('SCEN-1338: 複数の顧客条件すべてに対してパターンマッチングが実行される', () => {
    // Arrange: 新規案件データの準備
    const newDealData = {
      dealId: 'DEAL-20240115-001',
      customerId: 'CUST-20240115-001',
      dealName: '新規案件A',
      dealStage: 'proposal',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };

    // 複数の顧客条件を準備
    const customerConditions = [
      {
        conditionId: 'COND-A',
        industry: '製造業',
        employeeCount: 1000,
        conditionType: 'industry_employee',
      },
      {
        conditionId: 'COND-B',
        budgetScale: 50000000,
        conditionType: 'budget',
      },
      {
        conditionId: 'COND-C',
        implementationPeriod: 3,
        conditionType: 'timing',
      },
    ];

    // AIRecommendationEngineのスタブを作成
    const findSimilarPatternsCalls: any[] = [];
    const evaluatePatternRelevanceCalls: any[] = [];

    const aiEngineStub = {
      findSimilarPatterns: jest.fn(async (condition: any) => {
        findSimilarPatternsCalls.push(condition);
        if (condition.conditionId === 'COND-A') {
          return [
            {
              patternId: 'PATTERN-A1',
              similarityScore: 0.92,
              pastDealId: 'PAST-DEAL-001',
            },
          ];
        } else if (condition.conditionId === 'COND-B') {
          return [
            {
              patternId: 'PATTERN-B1',
              similarityScore: 0.85,
              pastDealId: 'PAST-DEAL-002',
            },
          ];
        } else if (condition.conditionId === 'COND-C') {
          return [
            {
              patternId: 'PATTERN-C1',
              similarityScore: 0.78,
              pastDealId: 'PAST-DEAL-003',
            },
          ];
        }
        return [];
      }),

      evaluatePatternRelevance: jest.fn(async (condition: any, pattern: any) => {
        evaluatePatternRelevanceCalls.push({ condition, pattern });
        if (condition.conditionId === 'COND-A') {
          return { relevanceScore: 0.92, isApplicable: true };
        } else if (condition.conditionId === 'COND-B') {
          return { relevanceScore: 0.85, isApplicable: true };
        } else if (condition.conditionId === 'COND-C') {
          return { relevanceScore: 0.78, isApplicable: true };
        }
        return { relevanceScore: 0, isApplicable: false };
      }),

      generateRecommendation: jest.fn(async () => ({
        recommendationId: 'REC-20240115-001',
      })),

      explainRecommendationReasoning: jest.fn(async () => ''),
    };

    // Act: generateRecommendationを呼び出し
    const result = generateRecommendation(newDealData, customerConditions, aiEngineStub);

    // Assert: 推奨結果の検証
    expect(result).toEqual(
      expect.objectContaining({
        recommendationId: expect.any(String),
        dealId: 'DEAL-20240115-001',
        matchingResults: expect.arrayContaining([
          expect.objectContaining({
            conditionId: 'COND-A',
            score: 0.92,
          }),
          expect.objectContaining({
            conditionId: 'COND-B',
            score: 0.85,
          }),
          expect.objectContaining({
            conditionId: 'COND-C',
            score: 0.78,
          }),
        ]),
      })
    );

    // findSimilarPatternsが条件A、B、Cそれぞれに対して1回ずつ、計3回呼び出されたことを検証
    expect(findSimilarPatternsCalls).toHaveLength(3);
    expect(findSimilarPatternsCalls[0].conditionId).toBe('COND-A');
    expect(findSimilarPatternsCalls[1].conditionId).toBe('COND-B');
    expect(findSimilarPatternsCalls[2].conditionId).toBe('COND-C');

    // evaluatePatternRelevanceが条件A、B、Cそれぞれに対して1回ずつ、計3回呼び出されたことを検証
    expect(evaluatePatternRelevanceCalls).toHaveLength(3);
    expect(evaluatePatternRelevanceCalls[0].condition.conditionId).toBe('COND-A');
    expect(evaluatePatternRelevanceCalls[1].condition.conditionId).toBe('COND-B');
    expect(evaluatePatternRelevanceCalls[2].condition.conditionId).toBe('COND-C');

    // 各条件に対するスコアが正確に返却されたことを検証
    const matchingResults = result.matchingResults;
    const conditionAResult = matchingResults.find((r: any) => r.conditionId === 'COND-A');
    const conditionBResult = matchingResults.find((r: any) => r.conditionId === 'COND-B');
    const conditionCResult = matchingResults.find((r: any) => r.conditionId === 'COND-C');

    expect(conditionAResult.score).toBe(0.92);
    expect(conditionBResult.score).toBe(0.85);
    expect(conditionCResult.score).toBe(0.78);

    // AIエンジンメソッドの呼び出し回数を確認
    expect(aiEngineStub.findSimilarPatterns).toHaveBeenCalledTimes(3);
    expect(aiEngineStub.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
  });
});