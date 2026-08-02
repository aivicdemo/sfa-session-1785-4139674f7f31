import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-266: 統合判定履歴が0件のとき、過去の統合判定が参照されない', () => {
    // 統合判定履歴が0件の初期状態
    const consolidation_history: any[] = [];

    // 現在入力されたデータ（重複の可能性がある顧客データ）
    const customer_data = [
      {
        customer_id: 'CUST001',
        customer_name: '株式会社A',
        phone_number: '03-1234-5678',
        email: 'contact@a-corp.jp',
        registration_date: '2024-01-15'
      },
      {
        customer_id: 'CUST002',
        customer_name: '株式会社A',
        phone_number: '03-1234-5678',
        email: 'contact@a-corp.jp',
        registration_date: '2024-01-20'
      }
    ];

    // 重複検出関数を実行
    // consolidation_history パラメータが空配列を受け取ることで、
    // 過去の統合判定を参照しない状態を確認
    const duplicate_detection_result = detectDuplicateCustomers({
      customer_records: customer_data,
      consolidation_history: consolidation_history,
      duplicate_detection_threshold: 0.95
    });

    // 期待結果：
    // 1. 重複検出は新規入力データのみに基づいて実行される
    // 2. consolidation_history が空（0件）であるため、過去判定の影響を受けない
    // 3. 現在のデータから重複候補が検出される（同名・同電話・同メール）
    expect(duplicate_detection_result.detected_duplicates).toEqual([
      {
        primary_customer_id: 'CUST001',
        duplicate_customer_id: 'CUST002',
        similarity_score: 1.0,
        match_fields: ['customer_name', 'phone_number', 'email'],
        consolidation_recommended: true,
        based_on_historical_consolidation: false
      }
    ]);

    // 統合判定履歴が0件の状態が保たれていることを確認
    expect(consolidation_history.length).toBe(0);

    // 重複検出結果が現在のデータのみに基づいていることを確認
    // （過去の統合判定に基づく pre-merged state が適用されていない）
    expect(duplicate_detection_result.analysis_metadata).toEqual({
      input_records_count: 2,
      historical_consolidations_referenced: 0,
      duplicates_detected_count: 1,
      processing_timestamp: expect.any(String),
      data_quality_score: 1.0
    });
  });
});