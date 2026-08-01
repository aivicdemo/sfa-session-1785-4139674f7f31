import { evaluateProblemSeverityAndActionNecessity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-584
  test('[edge] 問題検出結果の重要度・対応必要性判定機能 - 検出結果が0件の場合は空の判定結果が返される', () => {
    const empty_detection_results = [];

    const judgment_result = evaluateProblemSeverityAndActionNecessity(empty_detection_results);

    expect(judgment_result).toEqual({});
    expect(Object.keys(judgment_result).length).toBe(0);
  });
});