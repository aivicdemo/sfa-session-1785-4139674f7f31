import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターンランク付け機能', () => {
  test('SCEN-2353: 適用可能な成功パターンが1件のときそのパターンがランク1として返却される', () => {
    // Arrange: AIRecommendationEngine.findSimilarPatterns のスタブを作成
    const mockPatternStub = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PAT-001',
          relevanceScore: 0.95,
          dealType: '大型案件',
          industry: '製造業',
          approachMethod: 'コンサルティング提案',
          successRate: 0.88,
        },
      ]),
    };

    const inputCustomerCondition = {
      industry: '製造業',
      companySizeCategory: '大企業',
      estimatedContractValue: 5000000,
    };

    // Act: 推奨パターンランク付け機能を呼び出す
    const result = findSimilarPatterns(
      inputCustomerCondition,
      mockPatternStub
    );

    // Assert: ランク付けロジックの出力を検証
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      patternId: 'PAT-001',
      relevanceScore: 0.95,
      dealType: '大型案件',
      industry: '製造業',
      approachMethod: 'コンサルティング提案',
      successRate: 0.88,
      rank: 1,
    });
    expect(result[0].rank).toBe(1);
    expect(result[0].patternId).toBe('PAT-001');
    expect(result[0].relevanceScore).toBe(0.95);
  });
});