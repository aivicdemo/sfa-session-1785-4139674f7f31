import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-114
  test('プロセス段階の名称が欠落している場合、エラーをスローする', () => {
    const processStandardWithMissingName = {
      id: 'PS001',
      name: '営業プロセス標準書2024',
      stages: [
        {
          stageId: 'STAGE001',
          name: '初回接触',
          criteria: '顧客初回訪問完了',
          requiredData: ['顧客名', '接触日時'],
        },
        {
          stageId: 'STAGE002',
          name: null,
          criteria: '提案資料提出完了',
          requiredData: ['提案内容', '提案日時'],
        },
      ],
      kpiDefinitions: [
        {
          kpiId: 'KPI001',
          kpiName: '初回接触率',
          target: 100,
          unit: '%',
        },
      ],
    };

    expect(() =>
      convertProcessStandardToSystemRequirements(processStandardWithMissingName),
    ).toThrow(/プロセス段階の名称が必須項目です/);
  });
});