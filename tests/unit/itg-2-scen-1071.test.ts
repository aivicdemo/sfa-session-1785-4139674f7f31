import { defineBusinessSalesExampleCollectionPeriod } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業事例データ収集定義エンジン', () => {
  test('SCEN-1071: 収集対象期間が複数日で設定される', () => {
    // 開始日: 2024年1月15日, 終了日: 2024年1月20日 (6日間)
    const start_date = new Date('2024-01-15T00:00:00Z');
    const end_date = new Date('2024-01-20T23:59:59Z');

    const result = defineBusinessSalesExampleCollectionPeriod({
      start_date,
      end_date,
    });

    // 期待結果: 収集対象期間が正しく認識される
    expect(result.collection_period_start).toEqual(start_date);
    expect(result.collection_period_end).toEqual(end_date);

    // 期待結果: 期間内のデータ件数カウント (期間は6日間)
    // 計算: 2024年1月15日 ~ 2024年1月20日 = 6日間
    const expected_duration_days = 6;
    expect(result.duration_days).toBe(expected_duration_days);

    // 期待結果: 期間外データが除外されることを確認
    // テストデータセット内の事例データで期間判定を行う
    const within_period_examples = result.eligible_sales_examples;
    const outside_period_examples = result.excluded_sales_examples;

    // 期間内データのみが含まれていることを検証
    within_period_examples.forEach((example) => {
      const example_date = new Date(example.recorded_date);
      expect(example_date.getTime()).toBeGreaterThanOrEqual(
        start_date.getTime()
      );
      expect(example_date.getTime()).toBeLessThanOrEqual(end_date.getTime());
    });

    // 期間外データが除外されていることを検証
    outside_period_examples.forEach((example) => {
      const example_date = new Date(example.recorded_date);
      const is_before_start = example_date.getTime() < start_date.getTime();
      const is_after_end = example_date.getTime() > end_date.getTime();
      expect(is_before_start || is_after_end).toBe(true);
    });

    // 期待結果: 収集定義が有効な状態で返される
    expect(result.is_valid_collection_definition).toBe(true);
  });
});