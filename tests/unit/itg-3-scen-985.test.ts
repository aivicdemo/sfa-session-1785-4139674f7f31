import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - 重複排除', () => {
  test('SCEN-985: 過去商談データに重複パターンが含まれるとき、重複排除後の一意なパターンのみが返される', () => {
    // Arrange: テスト用の過去商談データセットを用意
    const duplicatePattern = {
      industry: '製造業',
      scale: '大規模',
      annualBudget: 50000000,
      decisionMaker: '工場長',
      implementationMonths: 3,
    };

    const pastDealsWithDuplicates = [
      {
        id: 'deal-001',
        pattern: duplicatePattern,
        successFlag: true,
      },
      {
        id: 'deal-002',
        pattern: duplicatePattern,
        successFlag: true,
      },
      {
        id: 'deal-003',
        pattern: duplicatePattern,
        successFlag: true,
      },
      {
        id: 'deal-004',
        pattern: {
          industry: 'IT',
          scale: '中堅',
          annualBudget: 20000000,
          decisionMaker: 'IT部長',
          implementationMonths: 6,
        },
        successFlag: true,
      },
    ];

    const currentDealCondition = {
      industry: '製造業',
      scale: '大規模',
      annualBudget: 55000000,
      decisionMaker: '工場長',
      implementationMonths: 2,
    };

    // Create stub for AIRecommendationEngine
    const aiEngineSub = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          pattern: duplicatePattern,
          relevanceScore: 95,
          sourceDeals: ['deal-001', 'deal-002', 'deal-003'],
        },
        {
          pattern: {
            industry: 'IT',
            scale: '中堅',
            annualBudget: 20000000,
            decisionMaker: 'IT部長',
            implementationMonths: 6,
          },
          relevanceScore: 45,
          sourceDeals: ['deal-004'],
        },
      ]),
    };

    // Act: 成功パターン抽出・照合機能を実行
    const result = findSimilarPatterns(
      pastDealsWithDuplicates,
      currentDealCondition,
      aiEngineSub,
    );

    // Assert: 重複排除後の検証
    expect(result).toEqual({
      uniquePatterns: [
        {
          pattern: {
            industry: '製造業',
            scale: '大規模',
            annualBudget: 50000000,
            decisionMaker: '工場長',
            implementationMonths: 3,
          },
          relevanceScore: 95,
          count: 1,
        },
        {
          pattern: {
            industry: 'IT',
            scale: '中堅',
            annualBudget: 20000000,
            decisionMaker: 'IT部長',
            implementationMonths: 6,
          },
          relevanceScore: 45,
          count: 1,
        },
      ],
      totalCountBefore: 4,
      totalCountAfter: 2,
      deduplicatedCount: 3,
    });
  });
});