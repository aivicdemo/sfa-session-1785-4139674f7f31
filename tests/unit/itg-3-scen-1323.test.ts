import { evaluateScheduleAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1323
  test('[normal] 提案内容と顧客制約条件の自動照合機能 - スケジュール期間がちょうど提案実装期間と一致するとき、スケジュール適合判定が肯定で返される', () => {
    const customer_constraint_schedule_start = new Date('2026-09-01T00:00:00Z');
    const customer_constraint_schedule_end = new Date('2026-12-31T23:59:59Z');
    const proposal_implementation_start = new Date('2026-09-01T00:00:00Z');
    const proposal_implementation_end = new Date('2026-12-31T23:59:59Z');

    const ai_engine_stub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposal_id: 'PROP-001',
        implementation_period: {
          start_date: proposal_implementation_start.toISOString(),
          end_date: proposal_implementation_end.toISOString(),
        },
        recommendation_text: 'Recommended approach',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customer_constraint = {
      customer_id: 'CUST-001',
      schedule_start: customer_constraint_schedule_start,
      schedule_end: customer_constraint_schedule_end,
    };

    const proposal = {
      proposal_id: 'PROP-001',
      implementation_start: proposal_implementation_start,
      implementation_end: proposal_implementation_end,
    };

    const result = evaluateScheduleAlignment(
      customer_constraint,
      proposal,
      ai_engine_stub
    );

    expect(result.is_aligned).toBe(true);
    expect(result.alignment_score).toBe(100);
    expect(result.reasoning).toContain(
      '顧客スケジュール期間（2026-09-01～2026-12-31）と提案実装期間（2026-09-01～2026-12-31）が完全に一致しており、実装可能'
    );
  });
});