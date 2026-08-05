import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-178
  test('[error] 営業プロセス標準書の要件仕様変換機能 - プロセス各段階の定義が空配列のとき、入力値不正エラーが発生する', () => {
    const invalid_process_definition = {
      process_id: 'PROC_001',
      process_name: '標準営業プロセス',
      stages: [],
      kpi_criteria: [
        {
          stage_id: 'STAGE_001',
          metric_name: '初回接触率',
          target_value: 100,
        },
      ],
    };

    expect(() => convertProcessStandardToSystemRequirements(invalid_process_definition)).toThrow(/プロセス各段階の定義は1件以上必要です/);
  });
});