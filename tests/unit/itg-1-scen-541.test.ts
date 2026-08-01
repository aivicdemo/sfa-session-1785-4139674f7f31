import { determineProblemResponseTiming } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-541
  test('[normal] 問題対応タイミングの判定機能 - 問題の優先度が対応時期判定に考慮される', () => {
    const urgentProblem = {
      priority: 1,
      description: 'Critical inference failure'
    };

    const highProblem = {
      priority: 2,
      description: 'High priority data quality issue'
    };

    const mediumProblem = {
      priority: 3,
      description: 'Medium priority process deviation'
    };

    const lowProblem = {
      priority: 4,
      description: 'Low priority monitoring alert'
    };

    const urgentResponseTiming = determineProblemResponseTiming(urgentProblem);
    expect(urgentResponseTiming).toBe('当日中対応');

    const highResponseTiming = determineProblemResponseTiming(highProblem);
    expect(highResponseTiming).toBe('翌営業日対応');

    const mediumResponseTiming = determineProblemResponseTiming(mediumProblem);
    expect(mediumResponseTiming).toBe('3営業日以内対応');

    const lowResponseTiming = determineProblemResponseTiming(lowProblem);
    expect(lowResponseTiming).toBe('1週間以内対応');
  });
});