import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-170
  test('同じ営業プロセス標準書を2回変換実行した場合、毎回同じシステム要件仕様が生成される', () => {
    const input_process_standard = {
      process_id: 'PROC-001',
      version: 'v1.0',
      process_name: '新規顧客開拓フロー',
      process_stages: [
        {
          stage_number: 1,
          stage_name: '初回接触',
          stage_description: '新規顧客への初回接触を実施する',
          kpi_criteria: '接触率 80% 以上',
          data_items: ['顧客名', '連絡先', '接触日時', '接触方法']
        },
        {
          stage_number: 2,
          stage_name: '提案',
          stage_description: '顧客ニーズに基づいた提案を実施する',
          kpi_criteria: '提案成功率 60% 以上',
          data_items: ['提案内容', '提案金額', '提案日時', '顧客反応']
        },
        {
          stage_number: 3,
          stage_name: '交渉',
          stage_description: '提案条件の交渉を進める',
          kpi_criteria: '交渉進捗率 70% 以上',
          data_items: ['交渉内容', '交渉状況', '条件変更', '交渉日時']
        },
        {
          stage_number: 4,
          stage_name: '成約',
          stage_description: '最終的な成約を成立させる',
          kpi_criteria: '成約率 50% 以上',
          data_items: ['成約金額', '成約日', '契約条件', '納期']
        }
      ],
      transition_rules: [
        {
          from_stage: 1,
          to_stage: 2,
          rule_description: '初回接触から7日以内に提案を実施する'
        },
        {
          from_stage: 2,
          to_stage: 3,
          rule_description: '提案から14日以内に交渉を開始する'
        },
        {
          from_stage: 3,
          to_stage: 4,
          rule_description: '交渉から21日以内に成約を目指す'
        }
      ],
      created_date: '2024-01-01T09:00:00Z',
      last_updated: '2024-01-01T09:00:00Z'
    };

    const first_conversion_result = convertProcessStandardToSystemRequirements(input_process_standard);

    const second_conversion_result = convertProcessStandardToSystemRequirements(input_process_standard);

    expect(first_conversion_result.requirement_id).toBe(second_conversion_result.requirement_id);
    expect(first_conversion_result.requirement_name).toBe(second_conversion_result.requirement_name);
    expect(first_conversion_result.detail_description).toBe(second_conversion_result.detail_description);
    expect(first_conversion_result.priority_level).toBe(second_conversion_result.priority_level);
    expect(first_conversion_result.related_process_steps).toEqual(
      second_conversion_result.related_process_steps
    );
    expect(first_conversion_result.extracted_data_items).toEqual(
      second_conversion_result.extracted_data_items
    );
    expect(first_conversion_result.dependency_relationships).toEqual(
      second_conversion_result.dependency_relationships
    );
    expect(first_conversion_result.process_id).toBe(second_conversion_result.process_id);
    expect(first_conversion_result.process_version).toBe(second_conversion_result.process_version);
    expect(first_conversion_result.conversion_logic_version).toBe(
      second_conversion_result.conversion_logic_version
    );
  });
});