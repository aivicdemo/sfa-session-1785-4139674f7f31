import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2198
  test('提案ステップが標準プロセスのステップを重複して含んでいるとき、重複による乖離が個別に算出される', () => {
    const standardProcessSteps = [
      { stepId: 'step_1', stepName: 'ヒアリング', order: 1 },
      { stepId: 'step_2', stepName: '要件分析', order: 2 },
      { stepId: 'step_3', stepName: '提案作成', order: 3 },
      { stepId: 'step_4', stepName: 'フォローアップ', order: 4 }
    ];

    const proposalSteps = [
      { stepId: 'step_1', stepName: 'ヒアリング', proposalOrder: 1 },
      { stepId: 'step_2', stepName: '要件分析', proposalOrder: 2 },
      { stepId: 'step_1', stepName: 'ヒアリング', proposalOrder: 3 },
      { stepId: 'step_3', stepName: '提案作成', proposalOrder: 4 },
      { stepId: 'step_2', stepName: '要件分析', proposalOrder: 5 },
      { stepId: 'step_4', stepName: 'フォローアップ', proposalOrder: 6 }
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const result = evaluatePatternRelevance(
      proposalSteps,
      standardProcessSteps,
      mockAIEngine
    );

    expect(result).toHaveProperty('deviationAnalysis');
    expect(Array.isArray(result.deviationAnalysis)).toBe(true);
    expect(result.deviationAnalysis.length).toBe(2);

    const firstDuplicate = result.deviationAnalysis.find(
      (item: any) => item.duplicateStepId === 'step_1'
    );
    expect(firstDuplicate).toBeDefined();
    expect(firstDuplicate.deviationScore).toBe(0.35);
    expect(firstDuplicate.proposalPosition).toBe(3);
    expect(firstDuplicate.standardPosition).toBe(1);

    const secondDuplicate = result.deviationAnalysis.find(
      (item: any) => item.duplicateStepId === 'step_2'
    );
    expect(secondDuplicate).toBeDefined();
    expect(secondDuplicate.deviationScore).toBe(0.28);
    expect(secondDuplicate.proposalPosition).toBe(5);
    expect(secondDuplicate.standardPosition).toBe(2);

    expect(result.totalDeviationScore).toBe(0.63);
  });
});