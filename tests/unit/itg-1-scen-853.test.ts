import { evaluateDetectionResultPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-853
  test('問題検出結果の重要度・根拠・対応必要性判定機能 - 検出結果リストが逆順で入力されたとき判定結果の順序が反転する', () => {
    const detection_result_1 = {
      detection_id: 3,
      content: '売上予測の乖離率が閾値超過',
      severity: 'high' as const,
      basis: '過去3ヶ月の売上実績と予測値の乖離度が95%を超過',
      action_required: true,
    };

    const detection_result_2 = {
      detection_id: 2,
      content: '営業プロセス完了率が低下',
      severity: 'medium' as const,
      basis: '標準プロセスの遵守率が70%に低下',
      action_required: true,
    };

    const detection_result_3 = {
      detection_id: 1,
      content: '顧客フォローアップ遅延',
      severity: 'low' as const,
      basis: 'フォローアップ実施待ち案件が5件存在',
      action_required: false,
    };

    const reversed_input_array = [detection_result_1, detection_result_2, detection_result_3];

    const judgment_results = evaluateDetectionResultPriority(reversed_input_array);

    expect(judgment_results).toHaveLength(3);
    expect(judgment_results[0].detection_id).toBe(3);
    expect(judgment_results[0].severity).toBe('high');
    expect(judgment_results[1].detection_id).toBe(2);
    expect(judgment_results[1].severity).toBe('medium');
    expect(judgment_results[2].detection_id).toBe(1);
    expect(judgment_results[2].severity).toBe('low');
  });
});