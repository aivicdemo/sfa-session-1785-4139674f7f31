import { describe, test, expect } from '@jest/globals';
import { convertProcessDefinitionToSystemRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-190
  test('プロセス段階の定義が無限ループ構造になっているとき、ロジックエラーが発生する', () => {
    const infiniteLoopProcessDefinition = {
      stage_A: {
        nextStage: 'stage_B',
      },
      stage_B: {
        nextStage: 'stage_C',
      },
      stage_C: {
        nextStage: 'stage_A',
      },
    };

    expect(() => {
      convertProcessDefinitionToSystemRequirements(infiniteLoopProcessDefinition);
    }).toThrow(/循環参照/);
  });
});