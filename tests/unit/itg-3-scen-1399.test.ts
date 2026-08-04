import { evaluateConstraintMatching } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  // SCEN-1399
  test('顧客制約条件が0件のとき、照合結果がすべて制約なしとして判定される', () => {
    // 顧客制約条件を空配列で初期化
    const emptyConstraints = [];

    // 提案内容オブジェクトの複数の制約項目を設定
    const proposalContent = {
      budgetAmount: 5000000,
      implementationPeriodDays: 180,
      requiredFeatures: ['feature1', 'feature2', 'feature3'],
      industryCategory: 'manufacturing',
      excludedCompetitors: ['competitor_a', 'competitor_b'],
    };

    // AIRecommendationEngineのスタブを設定
    const aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 照合機能を呼び出し
    const matchingResult = evaluateConstraintMatching(
      proposalContent,
      emptyConstraints,
      aiEngineStub
    );

    // 照合結果オブジェクトのすべての制約項目を検証
    expect(matchingResult.budgetConstraint.status).toBe('UNCONSTRAINED');
    expect(matchingResult.implementationPeriodConstraint.status).toBe(
      'UNCONSTRAINED'
    );
    expect(matchingResult.requiredFeaturesConstraint.status).toBe(
      'UNCONSTRAINED'
    );
    expect(matchingResult.industryConstraint.status).toBe('UNCONSTRAINED');
    expect(matchingResult.excludedCompetitorsConstraint.status).toBe(
      'UNCONSTRAINED'
    );

    // 制約違反判定フラグがfalse、違反数カウントが0
    expect(matchingResult.hasViolation).toBe(false);
    expect(matchingResult.violationCount).toBe(0);

    // すべての制約項目の reasonCode が「EMPTY_CONSTRAINT_LIST」
    expect(matchingResult.budgetConstraint.reasonCode).toBe(
      'EMPTY_CONSTRAINT_LIST'
    );
    expect(matchingResult.implementationPeriodConstraint.reasonCode).toBe(
      'EMPTY_CONSTRAINT_LIST'
    );
    expect(matchingResult.requiredFeaturesConstraint.reasonCode).toBe(
      'EMPTY_CONSTRAINT_LIST'
    );
    expect(matchingResult.industryConstraint.reasonCode).toBe(
      'EMPTY_CONSTRAINT_LIST'
    );
    expect(matchingResult.excludedCompetitorsConstraint.reasonCode).toBe(
      'EMPTY_CONSTRAINT_LIST'
    );
  });
});