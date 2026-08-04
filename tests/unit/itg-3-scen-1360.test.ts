import { evaluateProposalConstraintCompatibility } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 提案内容と顧客制約条件の自動照合', () => {
  test('SCEN-1360: 提案内容が顧客の経営目標と矛盾しているとき不適合を示す', () => {
    // Arrange: テスト用の顧客制約条件を準備
    const customerConstraints = {
      customerId: 'CUST-001',
      businessGoal: 'コスト削減',
      targetCostReductionPercentage: 20,
      annualBudgetLimit: 1000000,
      budgetCurrency: 'JPY',
      implementationScheduleMonths: 12,
      allowedProductCategories: ['standard', 'basic'],
      maxAnnualSpendIncreasePercentage: 5,
    };

    // テスト用の提案内容を準備
    const proposalContent = {
      proposalId: 'PROP-001',
      productPlan: 'プレミアムプラン',
      annualCostIncreasePercentage: 50,
      estimatedAnnualCost: 1500000,
      productCategory: 'premium',
      implementationMonths: 6,
      expectedOutcome: '高機能により業務効率が向上',
    };

    // AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        proposalId: proposalContent.proposalId,
        recommendedApproach: proposalContent.productPlan,
        reasoning: '高機能プレミアムプランの導入を推奨',
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn().mockReturnValue(''),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0),
    };

    // Act: 提案内容と顧客制約条件の自動照合機能を実行
    const result = evaluateProposalConstraintCompatibility(
      proposalContent,
      customerConstraints,
      mockAIEngine
    );

    // Assert: 照合ロジックが顧客の経営目標とコスト増加を比較して不適合判定を返すことを確認
    expect(result.compatible).toBe(false);
    expect(result.incompatible).toBe(true);
    expect(result.incompatibilityReason).toContain('提案内容が顧客の経営目標「コスト削減」と矛盾しています');
    expect(result.incompatibilityReason).toContain('年間費用を50%増加させ');
    expect(result.incompatibilityReason).toContain('年間20%のコスト削減');
    expect(result.severityLevel).toBe('高');
    expect(result.detailedAnalysis).toEqual({
      customerGoal: 'コスト削減',
      customerTargetReductionPercent: 20,
      proposedCostIncreasePercent: 50,
      allowedMaxCostIncreasePercent: 5,
      customerAllowedCategories: ['standard', 'basic'],
      proposedCategory: 'premium',
      conflictPoints: [
        '提案の年間費用増加（50%）が顧客の目標（20%削減）と矛盾',
        '提案の年間費用増加（50%）が顧客の上限（5%増加まで）を超過',
        '提案カテゴリ（premium）が顧客の許可カテゴリ外',
      ],
    });
  });
});