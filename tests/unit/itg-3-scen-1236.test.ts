import { evaluateProposalViability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1236: 提案妥当性確認判定機能 - 確認日時が未来日のとき、エラーを返す', () => {
    const current_time = new Date('2026-08-01T10:00:00Z');
    const future_confirmation_datetime = new Date('2026-08-01T10:30:00Z');

    const proposal_id = 'PROP-001';
    const deal_conditions = {
      customer_industry: '製造業',
      customer_size: '中堅企業',
      deal_amount: 5000000,
      deal_stage: '提案段階'
    };
    const customer_info = {
      customer_id: 'CUST-001',
      company_name: '株式会社テスト',
      budget_limit: 10000000,
      purchase_frequency: '年1回'
    };

    const mock_ai_engine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const result = evaluateProposalViability(
      {
        proposal_id,
        deal_conditions,
        customer_info,
        confirmation_datetime: future_confirmation_datetime,
        current_datetime: current_time
      },
      mock_ai_engine
    );

    expect(result.is_success).toBe(false);
    expect(result.error_code).toBe('INVALID_CONFIRMATION_DATETIME');
    expect(result.error_message).toMatch(/確認日時は現在時刻以前である必要があります/);
    expect(mock_ai_engine.generateRecommendation).not.toHaveBeenCalled();
    expect(mock_ai_engine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mock_ai_engine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mock_ai_engine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});