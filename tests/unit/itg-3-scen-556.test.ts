import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-556
  test('過去商談データが1件のときに1つの成功パターンが抽出される', () => {
    // Arrange
    const pastDealData = [
      {
        dealId: 'DEAL-001',
        customerIndustry: '製造業',
        customerSize: 'large',
        issue: 'コスト削減',
        proposalApproach: '自動化ソリューション',
        proposedProducts: ['自動化システムA'],
        contractedAmount: 5000000,
        isContracted: true,
        contractDate: '2024-01-15',
        salesPersonId: 'SALES-001',
        dealStage: 'closed_won',
      },
    ];

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest
        .fn()
        .mockResolvedValue([
          {
            patternId: 'PATTERN-001',
            customerIndustry: '製造業',
            customerSize: 'large',
            issue: 'コスト削減',
            proposalApproach: '自動化ソリューション',
            successRateScore: 95,
            isSuccess: true,
            sourceCount: 1,
            lastOccurrenceDate: '2024-01-15',
          },
        ]),
    };

    const newDealCondition = {
      customerIndustry: '製造業',
      customerSize: 'large',
      issue: 'コスト削減',
      estimatedBudget: 4500000,
    };

    // Act
    const result = findSimilarPatterns(
      newDealCondition,
      pastDealData,
      mockAIRecommendationEngine
    );

    // Assert
    return result.then((patterns) => {
      expect(patterns).toHaveLength(1);
      expect(patterns[0]).toEqual({
        patternId: 'PATTERN-001',
        customerIndustry: '製造業',
        customerSize: 'large',
        issue: 'コスト削減',
        proposalApproach: '自動化ソリューション',
        successRateScore: 95,
        isSuccess: true,
        sourceCount: 1,
        lastOccurrenceDate: '2024-01-15',
      });
      expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
        newDealCondition,
        pastDealData
      );
    });
  });
});