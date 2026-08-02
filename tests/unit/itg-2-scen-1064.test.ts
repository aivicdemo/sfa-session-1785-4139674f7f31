import { validateSalesExampleDataCollectionDefinition } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業事例データ品質検証エンジン', () => {
  // SCEN-1064
  test('必須データ項目が指定されていない場合、エラーが発生する', () => {
    const invalid_definition_empty_fields = {
      definition_id: 'DEF_001',
      definition_name: '営業事例定義',
      description: 'テスト用営業事例定義',
      data_source_id: 'DS_001',
      required_data_items: [],
      collection_start_date: new Date('2024-01-15T10:00:00Z'),
      collection_end_date: new Date('2024-01-31T10:00:00Z'),
      created_by: 'USER_001',
      created_at: new Date('2024-01-10T09:00:00Z'),
    };

    expect(() =>
      validateSalesExampleDataCollectionDefinition(invalid_definition_empty_fields)
    ).toThrow(/必須データ項目/);
  });
});