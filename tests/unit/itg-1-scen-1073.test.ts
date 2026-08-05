import {
  selectBehaviorAnalysisIndicators,
} from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  test('SCEN-1073: 営業プロセス定義に標準化されたステージが存在しない場合にエラーが発生する', () => {
    const salesProcessDefinitionWithoutStandardStages = {
      id: 'process_def_001',
      name: '営業プロセス定義',
      description: '営業プロセスの定義',
      stages: [],
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z'),
    };

    const analysisParams = {
      processDefinitionId: 'process_def_001',
      targetMonth: '2024-01',
      analysisType: 'behavior_pattern' as const,
    };

    expect(() =>
      selectBehaviorAnalysisIndicators(
        salesProcessDefinitionWithoutStandardStages,
        analysisParams
      )
    ).toThrow(/STAGE_NOT_STANDARDIZED/);
  });
});