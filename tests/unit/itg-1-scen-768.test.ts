import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析対象指標の自動選定機能', () => {
  // SCEN-768
  test('分析対象指標が1件の場合、その1件のみを含むリストが返される', () => {
    const indicators = [
      {
        indicatorId: 'IND-2024-001',
        indicatorName: '月次売上達成率',
      },
    ];

    const result = selectAnalysisIndicators(indicators);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      indicatorId: 'IND-2024-001',
      indicatorName: '月次売上達成率',
    });
  });
});