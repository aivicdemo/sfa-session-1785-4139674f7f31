import { describe, test, expect } from '@jest/globals';
import { convertProcessDefinitionToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  test('SCEN-206: プロセス段階が逆順で定義されたとき、変換時に正しい順序に並び替えられる', () => {
    const inputProcessDefinition = {
      processDefinitionId: 'pd-001',
      processName: '営業標準プロセス',
      stages: [
        {
          stageId: 'stage-3',
          stageName: '契約締結',
          stageSequence: 3,
          kpiCriteria: '成約率 80% 以上',
          dataItems: ['契約金額', '契約日'],
        },
        {
          stageId: 'stage-2',
          stageName: '提案・見積',
          stageSequence: 2,
          kpiCriteria: '提案成功率 60% 以上',
          dataItems: ['提案内容', '見積金額'],
        },
        {
          stageId: 'stage-1',
          stageName: '初期接触',
          stageSequence: 1,
          kpiCriteria: '接触頻度 週1回以上',
          dataItems: ['顧客名', '初回接触日'],
        },
      ],
      transitionRules: [],
    };

    const result = convertProcessDefinitionToSystemRequirements(inputProcessDefinition);

    expect(result.systemRequirementId).toBeDefined();
    expect(result.processStages).toHaveLength(3);
    expect(result.processStages[0].stageSequence).toBe(1);
    expect(result.processStages[0].stageName).toBe('初期接触');
    expect(result.processStages[1].stageSequence).toBe(2);
    expect(result.processStages[1].stageName).toBe('提案・見積');
    expect(result.processStages[2].stageSequence).toBe(3);
    expect(result.processStages[2].stageName).toBe('契約締結');
  });
});