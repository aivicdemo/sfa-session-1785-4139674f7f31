import { generateProcessStageRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-164
  test('プロセス段階の要件仕様化機能 - プロセス段階に紐づく判定基準が0個の場合、判定基準なしの要件として正しく整理される', () => {
    const process_stage_id = 'ps_001';
    const process_stage_name = '営業提案';
    const criteria_list: Array<{
      criteria_id: string;
      criteria_name: string;
      criteria_status: string;
    }> = [];

    const result = generateProcessStageRequirements({
      process_stage_id,
      process_stage_name,
      criteria_list,
    });

    expect(result).toEqual({
      process_stage_id: 'ps_001',
      process_stage_name: '営業提案',
      requirement_criteria_id: '',
      requirement_criteria_name: '判定基準なし',
      requirement_criteria_status: '未設定',
      is_requirement_defined: false,
    });
  });
});