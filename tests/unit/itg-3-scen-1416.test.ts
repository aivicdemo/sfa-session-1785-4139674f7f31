import { evaluateProposalConstraintAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  test('SCEN-1416: スケジュール制約データが欠落しているとき、その項目の照合がスキップされる', () => {
    // Arrange: テスト対象データの準備
    const customerConstraints = {
      deliveryConstraint: {
        requiredDeliveryDate: '2024-03-31',
        maxLeadTimeDays: 30,
      },
      budgetConstraint: {
        maxBudgetAmount: 5000000,
        currency: 'JPY',
      },
      scheduleConstraint: null, // スケジュール制約を意図的にnullで設定
    };

    const proposalContent = {
      proposedDeliveryDate: '2024-03-25',
      proposedAmount: 4500000,
      proposedScheduleDetails: {
        phaseOne: '2024-04-01',
        phaseTwo: '2024-05-15',
        phaseThree: '2024-06-30',
      },
    };

    // AIRecommendationEngineのスタブを設定（呼び出しがないことを確認）
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act: 照合機能を実行
    const result = evaluateProposalConstraintAlignment(
      customerConstraints,
      proposalContent,
      mockAIEngine,
    );

    // Assert: 期待値の検証
    expect(result.alignmentResults).toHaveLength(2);
    expect(result.alignmentResults[0]).toEqual({
      constraintType: 'delivery',
      isAligned: true,
      details: {
        requiredDeliveryDate: '2024-03-31',
        proposedDeliveryDate: '2024-03-25',
        daysEarly: 6,
      },
    });
    expect(result.alignmentResults[1]).toEqual({
      constraintType: 'budget',
      isAligned: true,
      details: {
        maxBudgetAmount: 5000000,
        proposedAmount: 4500000,
        remainingBudget: 500000,
      },
    });
    expect(result.status).toBe('PARTIAL_COMPLETE');
    expect(result.completedItemCount).toBe(2);
    expect(result.skippedItemCount).toBe(1);
    expect(result.skippedReasons).toEqual(['scheduleConstraint: data missing']);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});