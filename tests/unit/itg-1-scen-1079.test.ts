import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  // SCEN-1079
  test('データ品質チェック結果が未完了の状態で指標選定を実行した場合にエラーが発生する', () => {
    const data_quality_check_status = 'IN_PROGRESS';
    const analysis_status = 'WAITING';

    expect(() =>
      selectAnalysisIndicators({
        data_quality_check_status,
        analysis_status,
      })
    ).toThrow(/データ品質チェック/);
  });
});