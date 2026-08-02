import { initializeSalesExampleCollectionEngine, createSalesExampleCollectionDefinition } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業事例データ収集定義エンジン', () => {
  // SCEN-1060
  test('営業部長による開催決定時に最小収集件数がデフォルト値1で自動設定される', () => {
    // Initialize engine
    initializeSalesExampleCollectionEngine();

    // Create collection definition with period and classification, but no min_collection_count
    const definitionInput = {
      user_id: 'user_001',
      user_role: '営業部長',
      collection_start_date: '2024-01-01',
      collection_end_date: '2024-03-31',
      classification_type: '大型案件',
      min_collection_count: undefined,
      decision_status: '開催決定',
    };

    const result = createSalesExampleCollectionDefinition(definitionInput);

    // Verify min_collection_count is auto-set to 1
    expect(result.min_collection_count).toBe(1);
    expect(result.collection_start_date).toBe('2024-01-01');
    expect(result.collection_end_date).toBe('2024-03-31');
    expect(result.classification_type).toBe('大型案件');
    expect(result.decision_status).toBe('開催決定');
    expect(result.persisted_to_db).toBe(true);
  });
});