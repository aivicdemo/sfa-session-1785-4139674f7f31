import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  test('SCEN-109: プロセス段階が0件の場合、空の要件仕様が生成される', () => {
    const emptyProcessStages: any[] = [];
    
    const result = convertProcessStandardToSystemRequirements(emptyProcessStages);
    
    expect(result.requirementIds).toEqual([]);
    expect(result.requirementDetails).toEqual({});
    expect(result.processStageCount).toBe(0);
    expect(result.generatedAt).toBeDefined();
    expect(typeof result.generatedAt).toBe('string');
  });
});