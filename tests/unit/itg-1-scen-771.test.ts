import { analyzeSelectionMetricsForBehaviorPattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-771
  test('行動パターン分析対象指標の自動選定機能 - 営業プロセス定義が空の場合、指標選定エラーが発生する', () => {
    const emptyProcessDefinitions: any[] = [];
    const result = analyzeSelectionMetricsForBehaviorPattern({
      processDefinitions: emptyProcessDefinitions,
      contractResults: [],
    });

    expect(result).toEqual({
      success: false,
      errorCode: 'PROCESS_DEFINITION_EMPTY',
      errorMessage: '営業プロセス定義が設定されていないため、指標の自動選定ができません',
      metrics: [],
    });

    expect(result.metrics).toEqual([]);
    expect(result.errorCode).toBe('PROCESS_DEFINITION_EMPTY');
  });
});