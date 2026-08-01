import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-110
  test('プロセス標準書のシステム要件変換機能 - 入力されたプロセス段階が1件の場合、1件分の要件仕様が正確に生成される', () => {
    const input_process_standard = {
      process_stages: [
        {
          stage_name: '営業提案',
          responsible_department: '営業部',
          period_business_days: 5,
        },
      ],
    };

    const result = convertProcessStandardToSystemRequirements(input_process_standard);

    expect(result.system_requirements).toHaveLength(1);

    const generated_requirement = result.system_requirements[0];

    expect(generated_requirement.stage_name).toBe('営業提案');
    expect(generated_requirement.responsible_department).toBe('営業部');
    expect(generated_requirement.period_business_days).toBe(5);
    expect(generated_requirement.requirement_id).toBeDefined();
    expect(typeof generated_requirement.requirement_id).toBe('string');
    expect(generated_requirement.requirement_id.length).toBeGreaterThan(0);
    expect(generated_requirement.priority_level).toBeDefined();
    expect(['high', 'medium', 'low']).toContain(generated_requirement.priority_level);
    expect(generated_requirement.requirement_description).toBeDefined();
    expect(typeof generated_requirement.requirement_description).toBe('string');
    expect(generated_requirement.requirement_description.length).toBeGreaterThan(0);
  });
});