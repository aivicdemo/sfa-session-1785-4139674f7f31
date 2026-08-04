import { calculateGoalFitScore } from '../../src/logic/it-1-br-3-1-1-1';

const MIN_GOAL_FIT_THRESHOLD = 10;

describe('AIエージェント推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  test('SCEN-1327: 経営目標の適合度スコアが0%のとき、最小の目標適合値が返される', () => {
    // Arrange: テストデータの準備
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0),
    };

    const customerConstraints = {
      businessGoal: 'コスト削減30%',
      budget: 5000000,
      implementationPeriod: 6,
      targetDepartments: ['営業部', '管理部'],
      requirementLevel: 'high',
    };

    // Act: calculateGoalFitScore() を呼び出す
    const goalFitValue = calculateGoalFitScore(
      customerConstraints,
      mockAIEngine,
      MIN_GOAL_FIT_THRESHOLD
    );

    // Assert: 戻り値が最小目標適合値と一致することを検証
    expect(goalFitValue).toBe(MIN_GOAL_FIT_THRESHOLD);
    expect(typeof goalFitValue).toBe('number');
    expect(goalFitValue).toBeGreaterThanOrEqual(0);
    expect(goalFitValue).toBeLessThanOrEqual(100);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});