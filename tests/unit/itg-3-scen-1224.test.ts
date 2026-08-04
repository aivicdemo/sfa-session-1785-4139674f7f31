import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { evaluateProposalFeasibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案妥当性確認判定', () => {
  let mockAIRecommendationEngine: any;
  let mockFileStorageAdapter: any;

  beforeEach(() => {
    mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };
  });

  // SCEN-1224
  test('指定された商談IDが存在しないとき、エラーコード DEAL_NOT_FOUND と404ステータスを返す', async () => {
    const nonexistent_deal_id = '99999999-nonexistent';

    const result = await evaluateProposalFeasibility(
      {
        deal_id: nonexistent_deal_id,
        proposal_content: 'Sample proposal',
        customer_constraints: {
          budget_limit: 1000000,
          schedule_constraint: '2024-12-31',
        },
      },
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(result).toEqual({
      success: false,
      error_code: 'DEAL_NOT_FOUND',
      error_message: `指定された商談ID: ${nonexistent_deal_id} は存在しません`,
      http_status_code: 404,
    });

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.generateDownloadUrl).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.deleteExpiredReports).not.toHaveBeenCalled();
  });
});