import { DataQualityValidator } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-032
  test('学習データが複数件の場合に最小要件判定が正常に実行される', () => {
    // Arrange
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((pattern: unknown) => ({
        score: 75,
        isApplicable: true,
      })),
    };

    const testDataset = [
      {
        customerId: 'CUST001',
        industry: 'manufacturing',
        dealAmount: 5000000,
        isContracted: true,
        salesActivityContent: 'initial_proposal',
      },
      {
        customerId: 'CUST002',
        industry: 'retail',
        dealAmount: 3000000,
        isContracted: true,
        salesActivityContent: 'follow_up',
      },
      {
        customerId: 'CUST003',
        industry: 'finance',
        dealAmount: 7500000,
        isContracted: false,
        salesActivityContent: 'needs_analysis',
      },
    ];

    const validator = new DataQualityValidator(mockAIEngine);

    // Act
    const validationResult = validator.validateDataset(testDataset);

    // Assert
    expect(validationResult.isMinimumRequirementMet).toBe(true);
    expect(validationResult.qualityScore).toBeGreaterThanOrEqual(60);
    expect(validationResult.qualityScore).toBeLessThanOrEqual(100);
    expect(validationResult.detailedResults).toHaveLength(3);
    expect(validationResult.detailedResults[0]).toEqual({
      pass: true,
      reason: 'SUFFICIENT_VOLUME',
    });
    expect(validationResult.detailedResults[1]).toEqual({
      pass: true,
      reason: 'SUFFICIENT_VOLUME',
    });
    expect(validationResult.detailedResults[2]).toEqual({
      pass: true,
      reason: 'SUFFICIENT_VOLUME',
    });
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
  });
});