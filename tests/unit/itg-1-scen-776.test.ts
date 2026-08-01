import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析対象指標の自動選定機能', () => {
  // SCEN-776
  test('成約実績の金額がゼロの場合、その成約実績は相関分析から除外される', () => {
    const contractResults = [
      {
        id: 'A',
        amount: 100000,
        dealId: 'deal-1',
        closedDate: '2024-01-15',
      },
      {
        id: 'B',
        amount: 0,
        dealId: 'deal-2',
        closedDate: '2024-01-16',
      },
      {
        id: 'C',
        amount: 50000,
        dealId: 'deal-3',
        closedDate: '2024-01-17',
      },
    ];

    const result = selectAnalysisIndicators(contractResults);

    expect(result.selectedCount).toBe(2);
    expect(result.excludedCount).toBe(1);
    expect(result.selectedIds).toEqual(['A', 'C']);
    expect(result.excludedIds).toEqual(['B']);
  });
});