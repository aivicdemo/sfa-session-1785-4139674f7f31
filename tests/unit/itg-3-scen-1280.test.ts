import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案妥当性判定機能 - 既承認提案エッジケース', () => {
  test('SCEN-1280: 承認済み提案に対して判定が実行されずエラーが返される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockLogger = {
      warn: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    };

    const approvedProposal = {
      id: 'PROP-20240115-001',
      customer_id: 'CUST-001',
      approval_status: 'APPROVED',
      approved_at: new Date('2024-01-10T09:30:00Z'),
      proposal_content: {
        product_category: 'クラウドサービス',
        estimated_amount: 5000000,
      },
      customer_constraints: {
        budget_limit: 10000000,
        purchase_frequency_months: 12,
      },
    };

    const result = evaluateProposalValidity(
      approvedProposal,
      mockAIEngine,
      mockLogger
    );

    expect(result.status_code).toBe(400);
    expect(result.error_message).toContain(
      '既に承認済みのため、妥当性判定は実行できません'
    );
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(0);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(0);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(0);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('提案状態チェック')
    );
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('既承認提案のため判定スキップ')
    );
  });
});