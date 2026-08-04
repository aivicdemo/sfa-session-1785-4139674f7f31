import { evaluateProposalViability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案妥当性判定', () => {
  // SCEN-1262: [edge] 提案内容IDの入力値が欠落しているときに適切なエラー判定が出力される
  test('should return validation error when proposalContentId is missing', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputData = {
      customerId: 'CUST-001',
      dealConditionId: 'DEAL-002',
      proposalContentId: '',
      aiRecommendationEngine: mockAIEngine,
    };

    const result = evaluateProposalViability(inputData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      fieldName: 'proposalContentId',
      message: '提案内容IDは必須項目です',
    });
    expect(result.highlightedFields).toContain('proposalContentId');
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(result.formDataPreserved).toEqual({
      customerId: 'CUST-001',
      dealConditionId: 'DEAL-002',
      proposalContentId: '',
    });
    expect(result.canRetryAfterFix).toBe(true);
  });
});