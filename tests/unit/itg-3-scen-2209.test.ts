import { analyzeContactPatternTiming } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2209: [edge] 顧客対応の接触パターンの分析 - 顧客対応の接触タイミングが成功パターンより 1 日早いとき、タイミングの乖離スコアが算出される
  test('接触タイミングが成功パターンより1日早い場合、乖離スコアが0.8以上で算出される', () => {
    const initial_contact_date = new Date('2026-01-10T00:00:00Z');
    const actual_contact_date = new Date('2026-01-14T00:00:00Z');
    const standard_contact_days_after_initial = 5;
    const actual_contact_days_after_initial = 4;

    const mock_ai_engine = {
      getSuccessPatternStandardTiming: jest.fn().mockReturnValue({
        standard_days_after_initial_contact: standard_contact_days_after_initial,
        pattern_description: 'Standard contact pattern from successful deals'
      })
    };

    const result = analyzeContactPatternTiming(
      {
        customer_name: 'Test Customer Inc',
        initial_contact_date: initial_contact_date,
        actual_contact_date: actual_contact_date,
        business_condition: 'New opportunity'
      },
      mock_ai_engine
    );

    expect(result).toEqual({
      timing_deviation_days: -1,
      timing_deviation_score: expect.any(Number),
      explanation: expect.stringContaining('1日早い')
    });

    expect(result.timing_deviation_days).toBe(-1);
    expect(result.timing_deviation_score).toBeGreaterThanOrEqual(0.8);
    expect(result.timing_deviation_score).toBeLessThanOrEqual(1.0);
    expect(result.explanation).toMatch(/標準タイミングより1日早い接触/);
    expect(result.explanation).toMatch(/迅速な対応/);
  });
});