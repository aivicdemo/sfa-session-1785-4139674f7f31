import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能', () => {
  test('SCEN-908: 過去成功パターンが降順で照合されたとき同じ順序が保持される', () => {
    // スタブ: AIRecommendationEngine.findSimilarPatterns
    const mockFindSimilarPatterns = jest.fn().mockResolvedValue([
      {
        patternId: 'pattern-001',
        relevanceScore: 0.95,
        businessType: 'SaaS',
        customerScale: 'mid-market',
        budgetRange: 'over-5m',
      },
      {
        patternId: 'pattern-002',
        relevanceScore: 0.87,
        businessType: 'SaaS',
        customerScale: 'mid-market',
        budgetRange: 'over-5m',
      },
      {
        patternId: 'pattern-003',
        relevanceScore: 0.72,
        businessType: 'SaaS',
        customerScale: 'mid-market',
        budgetRange: 'over-5m',
      },
    ]);

    // 推奨パターンマスタの事前登録
    const recommendedPatternMaster = [
      {
        id: 'pattern-001',
        successFactors: ['Factor A', 'Factor B'],
        failureFactors: [],
        applicableConditions: { businessType: 'SaaS', customerScale: 'mid-market' },
      },
      {
        id: 'pattern-002',
        successFactors: ['Factor C', 'Factor D'],
        failureFactors: [],
        applicableConditions: { businessType: 'SaaS', customerScale: 'mid-market' },
      },
      {
        id: 'pattern-003',
        successFactors: ['Factor E'],
        failureFactors: ['Failure X'],
        applicableConditions: { businessType: 'SaaS', customerScale: 'mid-market' },
      },
    ];

    // 新規案件条件
    const newCaseCondition = {
      businessType: 'SaaS',
      customerScale: 'mid-market',
      budgetRange: 'over-5m',
    };

    // 成功パターン照合機能を実行
    const result = findSimilarPatterns(
      newCaseCondition,
      recommendedPatternMaster,
      mockFindSimilarPatterns
    );

    // 期待値: 降順（0.95 → 0.87 → 0.72）で返却される
    expect(result).toHaveLength(3);
    expect(result[0].patternId).toBe('pattern-001');
    expect(result[0].relevanceScore).toBe(0.95);
    expect(result[1].patternId).toBe('pattern-002');
    expect(result[1].relevanceScore).toBe(0.87);
    expect(result[2].patternId).toBe('pattern-003');
    expect(result[2].relevanceScore).toBe(0.72);

    // relevanceScore が変更されていないことを確認
    expect(result[0].relevanceScore).toStrictEqual(0.95);
    expect(result[1].relevanceScore).toStrictEqual(0.87);
    expect(result[2].relevanceScore).toStrictEqual(0.72);
  });
});