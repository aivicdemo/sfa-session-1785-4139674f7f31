import { detectAndJudgeDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出と統合判定機能', () => {
  test('SCEN-416: 業務上の最大規模重複候補(1000組)に対して統合判定が実行される', () => {
    // 準備: 1000組の顧客データ重複候補セットを作成
    const duplicateCandidates = Array.from({ length: 1000 }, (_, index) => ({
      candidate_id: `DUP_${String(index + 1).padStart(4, '0')}`,
      customer_id_a: `CUST_A_${String(index + 1).padStart(4, '0')}`,
      customer_id_b: `CUST_B_${String(index + 1).padStart(4, '0')}`,
      customer_name_a: `Customer A ${index + 1}`,
      customer_name_b: `Customer A ${index + 1}`,
      email_a: `customer_a_${index + 1}@example.com`,
      email_b: `customer_a_${index + 1}@example.com`,
      phone_a: `090-${String(Math.floor(index / 100)).padStart(4, '0')}-${String(index % 100).padStart(4, '0')}`,
      phone_b: `090-${String(Math.floor(index / 100)).padStart(4, '0')}-${String(index % 100).padStart(4, '0')}`,
      address_a: `Tokyo Pref, Shibuya Ward, Block ${index + 1}`,
      address_b: `Tokyo Pref, Shibuya Ward, Block ${index + 1}`,
      similarity_score: 0.65 + ((index % 31) * 0.001),
      detected_at: new Date('2024-06-15T10:00:00Z'),
      created_at: new Date('2024-06-15T10:00:00Z'),
    }));

    const start_time = Date.now();

    // 実行: 統合判定機能を実行
    const result = detectAndJudgeDuplicateCustomers({
      duplicate_candidates: duplicateCandidates,
      judgment_threshold_merge: 0.85,
      judgment_threshold_review: 0.70,
    });

    const end_time = Date.now();
    const processing_time_ms = end_time - start_time;
    const processing_time_sec = processing_time_ms / 1000;

    // 検証: 処理が60秒以内に完了
    expect(processing_time_sec).toBeLessThan(60);

    // 検証: 結果レコード数が1000件
    expect(result.judgment_results).toHaveLength(1000);

    // 検証: 各結果が『統合対象』『要確認』『非統合』のいずれかの判定結果を保有
    result.judgment_results.forEach((judgment_record) => {
      expect(['統合対象', '要確認', '非統合']).toContain(judgment_record.judgment_status);
    });

    // 検証: エラーログが0件
    expect(result.error_logs).toHaveLength(0);

    // 検証: 処理状態ログが存在し、完了状態を示している
    expect(result.process_status_log).toBeDefined();
    expect(result.process_status_log.status).toBe('completed');
    expect(result.process_status_log.total_processed).toBe(1000);
    expect(result.process_status_log.failed_count).toBe(0);

    // 検証: 判定結果の統計が正確に計算されている
    const merge_count = result.judgment_results.filter(
      (r) => r.judgment_status === '統合対象'
    ).length;
    const review_count = result.judgment_results.filter(
      (r) => r.judgment_status === '要確認'
    ).length;
    const no_merge_count = result.judgment_results.filter(
      (r) => r.judgment_status === '非統合'
    ).length;

    expect(merge_count + review_count + no_merge_count).toBe(1000);
    expect(result.judgment_summary).toEqual({
      total_candidates: 1000,
      merge_target_count: merge_count,
      review_required_count: review_count,
      no_merge_count: no_merge_count,
    });

    // 検証: 各判定レコードが必須フィールドを保有
    result.judgment_results.forEach((record) => {
      expect(record.candidate_id).toBeDefined();
      expect(record.customer_id_a).toBeDefined();
      expect(record.customer_id_b).toBeDefined();
      expect(record.judgment_status).toBeDefined();
      expect(record.similarity_score).toBeDefined();
      expect(record.judgment_reason).toBeDefined();
      expect(record.judged_at).toBeDefined();
    });
  });
});