import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-132
  test('プロセス段階の説明文が欠落している場合、基本情報のみで要件仕様が生成される', () => {
    const inputProcessStage = {
      processId: 'PROC-001',
      stageName: '要件定義フェーズ',
      stageDescription: '',
      responsibleRole: '営業部長',
      executionDays: 5
    };

    const result = convertProcessStandardToSystemRequirements(inputProcessStage);

    expect(result).toEqual({
      processId: 'PROC-001',
      stageName: '要件定義フェーズ',
      responsibleRole: '営業部長',
      executionDays: 5
    });

    expect(result).not.toHaveProperty('functionalRequirements');
    expect(result).not.toHaveProperty('nonFunctionalRequirements');
    expect(result).not.toHaveProperty('deliverables');
  });
});