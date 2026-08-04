import { evaluateProposalConstraintAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1389: 顧客スケジュール制約が提案実装期間と等しいとき、投資対効果が適正範囲と判定される', () => {
    // Arrange
    const customer_id = 'CUST-20250115-001';
    const industry_classification = 'IT_SERVICES';
    const proposal_amount = 5000000;
    const customer_schedule_start = new Date('2025-04-01');
    const customer_schedule_end = new Date('2025-06-30');
    const proposal_implementation_start = new Date('2025-04-01');
    const proposal_implementation_end = new Date('2025-06-30');
    const annual_revenue = 100000000;

    const mock_ai_engine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevance_score: 0.87,
        status: 'GREEN',
        schedule_match_ratio: 1.0,
        recommendation_rationale: 'スケジュール制約と実装期間が完全に合致'
      })
    };

    // Act
    const result = evaluateProposalConstraintAlignment(
      {
        customer_id,
        industry_classification,
        proposal_amount,
        customer_schedule_start,
        customer_schedule_end,
        proposal_implementation_start,
        proposal_implementation_end,
        annual_revenue
      },
      mock_ai_engine
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.relevance_score).toBeGreaterThanOrEqual(0.80);
    expect(result.relevance_score).toBeLessThanOrEqual(0.95);
    expect(result.status).toBe('GREEN');
    expect(result.schedule_match_ratio).toBe(1.0);
    expect(mock_ai_engine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_id,
        industry_classification,
        proposal_amount,
        customer_schedule_start,
        customer_schedule_end,
        proposal_implementation_start,
        proposal_implementation_end,
        annual_revenue
      })
    );
  });
});