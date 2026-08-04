import { evaluateProposalAppropriateness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1274
  test('提案妥当性判定機能 - 判定時刻が月末である場合に期間判定が正確に行われる', () => {
    const mock_now = new Date('2025-01-31T23:59:59Z');
    jest.useFakeTimers();
    jest.setSystemTime(mock_now);

    const mock_evaluatePatternRelevance = jest.fn().mockReturnValue({
      score: 85,
      matched_patterns: ['PATTERN_001']
    });

    const mock_engine = {
      evaluatePatternRelevance: mock_evaluatePatternRelevance
    };

    const deal_condition = {
      customer_industry: '製造業',
      budget_scale: '5000万円以上',
      decision_period: '1ヶ月以内'
    };

    const base_pattern = 'PATTERN_001';

    const result = evaluateProposalAppropriateness(
      deal_condition,
      base_pattern,
      mock_engine
    );

    expect(mock_evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        start_date: '2025-01-01',
        end_date: '2025-01-31',
        pattern_id: 'PATTERN_001'
      })
    );

    expect(result).toEqual(
      expect.objectContaining({
        judgment_target_period: '2025-01-01～2025-01-31',
        score: 85,
        matched_patterns: ['PATTERN_001']
      })
    );

    jest.useRealTimers();
  });
});