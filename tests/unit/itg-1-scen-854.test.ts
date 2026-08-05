import { evaluateDetectionResultJudgment } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-854: 重複した検出結果を含むとき両方について判定が実行される', () => {
    // 初期化: 同一の検出結果を2件重複して含むテストデータを準備
    const duplicate_detection_result = {
      detection_id: 'det_001',
      detection_type: '顧客接触頻度不足',
      detection_datetime: '2024-01-15T10:30:00Z',
      affected_sales_rep_id: 'rep_123',
      affected_customer_id: 'cust_456',
      baseline_metric: 3,
      detected_metric: 1,
      lookback_days: 30,
    };

    const input_detection_results = [
      duplicate_detection_result,
      duplicate_detection_result,
    ];

    // 実行: 判定機能を呼び出す
    const judgment_results = evaluateDetectionResultJudgment(
      input_detection_results
    );

    // 検証1: 判定結果配列の要素数は2であることを確認
    expect(judgment_results).toHaveLength(2);

    // 検証2: 1番目の検出結果について、重要度・根拠・対応必要性の判定値が設定されていることを確認
    const first_judgment = judgment_results[0];
    expect(first_judgment).toBeDefined();
    expect(first_judgment.importance_level).toBe('高');
    expect(first_judgment.judgment_rationale).toBe(
      '過去30日間の顧客接触回数が基準値3回以下'
    );
    expect(first_judgment.response_necessity).toBe('要対応');

    // 検証3: 2番目の検出結果について、重要度・根拠・対応必要性の判定値が設定されていることを確認
    const second_judgment = judgment_results[1];
    expect(second_judgment).toBeDefined();
    expect(second_judgment.importance_level).toBe('高');
    expect(second_judgment.judgment_rationale).toBe(
      '過去30日間の顧客接触回数が基準値3回以下'
    );
    expect(second_judgment.response_necessity).toBe('要対応');

    // 検証4: 1番目と2番目の判定値が同一の値であることを確認
    expect(first_judgment.importance_level).toBe(
      second_judgment.importance_level
    );
    expect(first_judgment.judgment_rationale).toBe(
      second_judgment.judgment_rationale
    );
    expect(first_judgment.response_necessity).toBe(
      second_judgment.response_necessity
    );
  });
});