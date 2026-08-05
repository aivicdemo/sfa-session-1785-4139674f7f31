import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1086: [edge] 行動パターン分析対象指標の自動選定機能 - 初回接触頻度の計算で端数が発生する場合に正しく四捨五入される
  test('行動パターン分析対象指標の自動選定 - 初回接触頻度が小数点第3位で四捨五入される', () => {
    const input = {
      totalContactCount: 5,
      targetPeriodDays: 91,
      customerId: 'CUST_001',
      analysisStartDate: '2024-01-01T00:00:00Z',
      analysisEndDate: '2024-04-01T00:00:00Z',
    };

    const result = selectAnalysisIndicators(input);

    expect(result).toEqual({
      selectedIndicators: [
        {
          indicatorName: 'initial_contact_frequency',
          indicatorValue: 0.055,
          displayName: '初回接触頻度',
          unit: '回/日',
        },
      ],
      analysisReady: true,
      customerId: 'CUST_001',
      computedAt: expect.any(String),
    });

    expect(result.selectedIndicators[0].indicatorValue).toBe(0.055);
  });
});