import { convertProcessStageToSystemRequirement } from '../../src/logic/it-1-br-2-1-1';

describe('プロセス標準書のシステム要件変換機能', () => {
  test('SCEN-133: プロセス段階の説明文が空文字列の場合、その段階の基本情報のみで要件仕様が生成される', () => {
    const processStageInput = {
      stageId: 'STAGE-001',
      stageName: '要件定義',
      description: '',
      responsibleDepartment: '営業企画部',
    };

    const result = convertProcessStageToSystemRequirement(processStageInput);

    expect(result.stageId).toBe('STAGE-001');
    expect(result.stageName).toBe('要件定義');
    expect(result.responsibleDepartment).toBe('営業企画部');
    expect(result.description === '' || result.description === null || result.description === undefined).toBe(true);
  });
});