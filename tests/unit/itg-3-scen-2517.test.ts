import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2517
  test('成功パターンが1件のとき、1つのテンプレート要素として構造化される', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-001',
          industry: '製造業',
          dealSize: '5000万円',
          approachType: 'テクニカルアプローチ',
          successRate: 0.92,
        },
      ]),
    };

    const currentDealCondition = {
      customerId: 'CUST-12345',
      industry: '製造業',
      dealAmount: 50000000,
      dealStage: '提案段階',
      productCategory: 'ソリューション提案',
    };

    const result = await findSimilarPatterns(
      currentDealCondition,
      mockAIEngine
    );

    expect(result).toHaveLength(1);

    const templateElement = result[0];
    expect(templateElement).toHaveProperty('patternId');
    expect(templateElement).toHaveProperty('category');
    expect(templateElement).toHaveProperty('applicableConditions');
    expect(templateElement).toHaveProperty('recommendedApproach');
    expect(templateElement).toHaveProperty('relevanceScore');

    expect(templateElement.patternId).toBe('PAT-001');
    expect(templateElement.relevanceScore).toBe(0.92);

    expect(templateElement.applicableConditions).toEqual({
      industry: '製造業',
      dealSize: '5000万円',
      dealStage: '提案段階',
    });

    expect(templateElement.recommendedApproach).toBe('テクニカルアプローチ');
    expect(templateElement.category).toBeDefined();
    expect(typeof templateElement.category).toBe('string');
  });
});