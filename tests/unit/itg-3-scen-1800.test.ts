import { evaluateProposalApproachFeasibility } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - 制約条件適合判定', () => {
  // SCEN-1800
  test('提案内容が顧客購買提案の制約条件に適合しているか判定される', () => {
    // Arrange: 顧客購買提案の制約条件を定義
    const customerConstraints = {
      budgetLimitYen: 1000000,
      implementationPeriodMonths: 3,
      applicableIndustries: ['製造業']
    };

    // 提案アプローチを定義（AIエージェントが生成したシミュレーション）
    const proposalApproach = {
      budgetEstimateYen: 800000,
      implementationPeriodMonths: 2,
      targetIndustry: '製造業',
      description: 'ERP導入提案'
    };

    // Act: 判定ロジック関数を呼び出す
    const evaluationResult = evaluateProposalApproachFeasibility(
      proposalApproach,
      customerConstraints
    );

    // Assert: 判定結果の検証
    expect(evaluationResult.isFeasible).toBe(true);

    // 判定根拠の検証
    expect(evaluationResult.budgetCompliance).toEqual({
      isMet: true,
      proposedBudgetYen: 800000,
      constraintLimitYen: 1000000,
      reason: '提案予算80万円は制約上限100万円以下を満たす'
    });

    expect(evaluationResult.implementationPeriodCompliance).toEqual({
      isMet: true,
      proposedPeriodMonths: 2,
      constraintPeriodMonths: 3,
      reason: '提案実装期間2ヶ月は制約期間3ヶ月以内を満たす'
    });

    expect(evaluationResult.industryCompliance).toEqual({
      isMet: true,
      proposedIndustry: '製造業',
      constraintIndustries: ['製造業'],
      reason: '提案対象業界製造業は制約条件の対応業界製造業と一致'
    });

    // すべての制約条件項目が適合状態として記録されることを検証
    expect(evaluationResult.allConstraintsSatisfied).toBe(true);
    expect(evaluationResult.satisfiedConstraintCount).toBe(3);
    expect(evaluationResult.totalConstraintCount).toBe(3);
  });
});