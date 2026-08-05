import { convertProcessRequirementsSpec } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-191
  test('[error] 営業プロセス標準書の要件仕様変換機能 - 判定基準の条件式が解析不可能なとき、構文エラーが発生する', () => {
    const invalid_criteria_expression = '売上 > AND < 100万円';
    const process_definition = {
      process_id: 'proc_001',
      process_name: '営業プロセス標準書',
      stages: [
        {
          stage_id: 'stage_001',
          stage_name: '初回接触',
          judgment_criteria: invalid_criteria_expression,
        },
      ],
    };

    expect(() => {
      convertProcessRequirementsSpec(process_definition);
    }).toThrow(/判定基準の条件式が解析できません/);
  });
});