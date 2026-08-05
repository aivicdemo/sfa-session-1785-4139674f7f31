import { classifyDiscrepancyPattern } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-240
  test('[error] 乖離パターン分類機能 - 乖離パターン分析の参照データが null のときエラーになる', () => {
    const input = {
      discrepancyPatterns: null,
      analysisData: {
        executedSteps: ['initial_contact', 'proposal'],
        expectedSteps: ['initial_contact', 'proposal', 'negotiation'],
        timestamp: new Date('2024-01-15T10:00:00Z'),
      },
    };

    expect(() => classifyDiscrepancyPattern(input)).toThrow(/乖離パターン参照データ/);
  });
});