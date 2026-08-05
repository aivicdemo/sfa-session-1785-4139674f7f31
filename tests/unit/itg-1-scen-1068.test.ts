import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  // SCEN-1068
  test('分析対象期間の開始日が未指定の場合にエラーが発生する', () => {
    const input = {
      start_date: '',
      end_date: '2024-01-31',
      selected_indicators: ['訪問件数']
    };

    expect(() => selectAnalysisIndicators(input)).toThrow(/開始日/);
  });
});