import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠の可視化機能', () => {
  // SCEN-1907
  test('推奨スコアが閾値ちょうど（0.8）のときに根拠が適用される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.8),
      generateRecommendation: jest.fn().mockReturnValue({
        approach: 'フォローアップメール送付',
        confidence: 0.8,
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          pastCaseId: 'CASE-20240115-001',
          similarity: 0.8,
          successApproach: '初回接触から5営業日後にフォローアップ',
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '類似度: 0.8、過去事例ID: CASE-20240115-001、アプローチ: 初回接触から5営業日後にフォローアップ'
      ),
    };

    const dealCondition = {
      customerId: 'CUST-12345',
      dealId: 'DEAL-67890',
      industryType: 'IT',
      companySize: 'mid-market',
      currentPhase: 'initial_proposal',
    };

    const result = visualizeRecommendationReasoning(dealCondition, mockAIEngine);

    expect(result.isReasoningApplied).toBe(true);
    expect(result.reasoningExplanation).toBe(
      '類似度: 0.8、過去事例ID: CASE-20240115-001、アプローチ: 初回接触から5営業日後にフォローアップ'
    );
    expect(result.reasoningExplanation).not.toBe('');
    expect(result.recommendedApproach).toBe('フォローアップメール送付');
    expect(result.confidenceScore).toBe(0.8);

    expect(result.reasoningElements).toEqual({
      similarityScore: 0.8,
      applicabilityReason:
        '初回接触から5営業日後にフォローアップ',
      recommendedApproachPattern: 'フォローアップメール送付',
    });

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealCondition
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      dealCondition
    );
  });
});