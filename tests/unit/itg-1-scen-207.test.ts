import { convertProcessDefinitionToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-207
  test('プロセス段階に重複が含まれているとき、重複を除外した上で要件仕様が生成される', () => {
    const input_process_stages = ['提案作成', '顧客ヒアリング', '提案作成', '契約締結'];
    const input_process_definition = {
      process_id: 'PROC-001',
      process_name: '営業プロセス標準書',
      stages: input_process_stages,
      evaluation_criteria: 'standard',
      kpi_definition: { target_win_rate: 50 }
    };

    const result = convertProcessDefinitionToSystemRequirements(input_process_definition);

    const expected_unique_stages = ['提案作成', '顧客ヒアリング', '契約締結'];
    expect(result.system_requirements.process_stages).toEqual(expected_unique_stages);
    expect(result.system_requirements.process_stages.length).toBe(3);
    expect(result.system_requirements.process_stages.filter((stage: string) => stage === '提案作成').length).toBe(1);
  });
});