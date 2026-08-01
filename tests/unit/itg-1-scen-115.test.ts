import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-115
  test('プロセス標準書のシステム要件変換機能 - プロセス段階の名称が空文字列の場合、変換処理がエラーになる', () => {
    const processStageWithEmptyName = {
      processId: 'PROC-001',
      sequenceNumber: 1,
      name: '',
      description: 'Initial Contact',
      criteria: 'Customer confirms meeting',
      expectedDuration: 3,
      kpiTarget: 0.8,
    };

    expect(() => {
      convertProcessStandardToSystemRequirements(processStageWithEmptyName);
    }).toThrow(/プロセス段階の名称/);
  });
});