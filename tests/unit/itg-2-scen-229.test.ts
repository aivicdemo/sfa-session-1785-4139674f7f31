import { generateRequirementSpecification } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 要件仕様生成', () => {
  // SCEN-229
  test('プロセス段階情報が1件のとき、要件仕様が正常に生成される', () => {
    const processStageInput = {
      stageId: 'stage_001',
      stageName: '初期接触',
      order: 1,
    };

    const result = generateRequirementSpecification([processStageInput]);

    expect(result).toBeDefined();
    expect(result.stageId).toBe('stage_001');
    expect(result.stageName).toBe('初期接触');
    expect(result.order).toBe(1);
    expect(result.status).toBe('valid');
    expect(result.generationFailureFlag).toBe(false);
  });
});