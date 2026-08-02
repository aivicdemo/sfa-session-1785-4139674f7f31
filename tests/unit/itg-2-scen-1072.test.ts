import { defineBusinessCaseCollectionSettings } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業事例データ収集定義エンジン', () => {
  // SCEN-1072
  test('最小収集件数が複数件で設定される場合、最後に設定された値が有効な設定値として保持される', () => {
    const collection_definition_id = 'DEF-001';
    const collection_period_start = '2024-01-01T00:00:00Z';
    const collection_period_end = '2024-12-31T23:59:59Z';
    const data_items = ['customer_id', 'sales_amount', 'success_factor'];

    // 最小収集件数を2で設定
    const settings_with_min_2 = {
      collection_definition_id,
      collection_period_start,
      collection_period_end,
      minimum_collection_count: 2,
      data_items
    };

    const result_after_first_setting = defineBusinessCaseCollectionSettings(settings_with_min_2);

    expect(result_after_first_setting).toEqual({
      collection_definition_id,
      collection_period_start,
      collection_period_end,
      minimum_collection_count: 2,
      data_items,
      is_active: true,
      last_updated_at: expect.any(String)
    });

    // 最小収集件数を5に上書き設定
    const settings_with_min_5 = {
      collection_definition_id,
      collection_period_start,
      collection_period_end,
      minimum_collection_count: 5,
      data_items
    };

    const result_after_second_setting = defineBusinessCaseCollectionSettings(settings_with_min_5);

    // 最後に設定された値（5）が有効な設定値として保持される
    expect(result_after_second_setting.minimum_collection_count).toBe(5);
    expect(result_after_second_setting.is_active).toBe(true);
    expect(result_after_second_setting.collection_definition_id).toBe(collection_definition_id);
  });
});