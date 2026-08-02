import { generateRequirementSpecifications } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 要件仕様生成', () => {
  // SCEN-230
  test('プロセス段階情報が複数件のとき、各段階の要件仕様が全て生成される', () => {
    const processStages = [
      {
        stageId: 'stage_001',
        stageName: '初回接触',
        description: 'プロセス段階001の説明',
      },
      {
        stageId: 'stage_002',
        stageName: '提案',
        description: 'プロセス段階002の説明',
      },
      {
        stageId: 'stage_003',
        stageName: '交渉',
        description: 'プロセス段階003の説明',
      },
    ];

    const result = generateRequirementSpecifications(processStages);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          stageId: 'stage_001',
          stageName: '初回接触',
          requirementSpec: expect.any(String),
        }),
        expect.objectContaining({
          stageId: 'stage_002',
          stageName: '提案',
          requirementSpec: expect.any(String),
        }),
        expect.objectContaining({
          stageId: 'stage_003',
          stageName: '交渉',
          requirementSpec: expect.any(String),
        }),
      ])
    );

    expect(result).toHaveLength(3);

    const stage001Spec = result.find((spec) => spec.stageId === 'stage_001');
    const stage002Spec = result.find((spec) => spec.stageId === 'stage_002');
    const stage003Spec = result.find((spec) => spec.stageId === 'stage_003');

    expect(stage001Spec).toBeDefined();
    expect(stage002Spec).toBeDefined();
    expect(stage003Spec).toBeDefined();

    expect(stage001Spec?.requirementSpec).not.toBe(
      stage002Spec?.requirementSpec
    );
    expect(stage002Spec?.requirementSpec).not.toBe(
      stage003Spec?.requirementSpec
    );
    expect(stage001Spec?.requirementSpec).not.toBe(
      stage003Spec?.requirementSpec
    );
  });
});