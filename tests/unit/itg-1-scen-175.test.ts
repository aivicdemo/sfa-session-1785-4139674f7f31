import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-175
  test('プロセス標準書ドラフトが null のとき、入力値未設定エラーが発生する', () => {
    const processStandardDraft = null;
    const processId = 'PROC-2024-001';
    const conversionRuleDefinition = {
      ruleId: 'RULE-001',
      ruleType: 'standard',
      mappingRules: [
        {
          sourceField: 'initialContact',
          targetField: 'system_initial_contact',
          transformType: 'direct',
        },
      ],
    };
    const systemTargetList = ['audit_system', 'quality_system', 'ai_agent_system', 'automation_system'];

    expect(() =>
      convertProcessStandardToSystemRequirements(
        processStandardDraft,
        processId,
        conversionRuleDefinition,
        systemTargetList,
      ),
    ).toThrow(/プロセス標準書ドラフト/);
  });
});