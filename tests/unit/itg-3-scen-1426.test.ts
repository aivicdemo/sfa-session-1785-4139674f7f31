import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1426
  test('類似パターンマッチスコアが閾値を超過するとき、適用可能と判定される', () => {
    // Arrange
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85),
    };

    const dealCondition = {
      customerScale: 'large',
      industry: 'finance',
      budget: 10000000,
    };

    const applicabilityThreshold = 0.75;

    // Act
    const result = evaluatePatternRelevance(
      dealCondition,
      mockAIEngine.evaluatePatternRelevance,
      applicabilityThreshold
    );

    // Assert
    expect(result.isApplicable).toBe(true);
    expect(result.status).toBe('適用可能');
    expect(result.matchScore).toBe(0.85);
    expect(result.rationale).toEqual({
      matchScore: 0.85,
      threshold: 0.75,
      basis: 'マッチスコアが閾値を超過',
    });
  });
});