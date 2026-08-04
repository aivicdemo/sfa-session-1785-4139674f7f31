import { validateProposalFeasibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案妥当性確認判定機能', () => {
  // SCEN-1230
  test('提案が削除済み状態のとき、エラーを返す', async () => {
    const deletedProposalId = 'proposal-deleted-001';
    const deletedAt = new Date('2024-01-10T09:00:00Z');

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = await validateProposalFeasibility(
      deletedProposalId,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      errorCode: 'PROPOSAL_DELETED',
      httpStatus: 410,
      errorMessage: '指定された提案は削除済みです。妥当性確認を実行することはできません。',
    });

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});