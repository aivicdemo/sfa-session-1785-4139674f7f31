import { detectDuplicateCustomers, calculateConsolidationJudgment } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と統合判定", () => {
  // SCEN-341: [normal] 顧客データ重複・不整合検出エンジン - 重複候補となる顧客データが複数件の場合、統合判定が実行される
  test("should execute consolidation judgment when multiple duplicate candidates are detected", () => {
    // 準備: 顧客データベースに3件のレコードを準備
    const recordA = {
      customer_id: "A001",
      customer_name: "田中太郎",
      phone_number: "090-1234-5678",
      address: "東京都渋谷区",
    };

    const recordB = {
      customer_id: "B001",
      customer_name: "田中太郎",
      phone_number: "090-1234-5678",
      address: "東京都渋谷区渋谷1-1-1",
    };

    const recordC = {
      customer_id: "C001",
      customer_name: "田中太郎",
      phone_number: "090-1234-5679",
      address: "東京都渋谷区",
    };

    const customer_records = [recordA, recordB, recordC];

    // 手順1: 重複検出エンジンを実行
    const duplicate_candidates = detectDuplicateCustomers(customer_records);

    // 手順2: エンジンが重複候補として3件すべてを抽出したことを確認
    expect(duplicate_candidates).toHaveLength(3);
    expect(duplicate_candidates.map((r) => r.customer_id)).toEqual([
      "A001",
      "B001",
      "C001",
    ]);

    // 手順3: 統合判定エンジンに対して、この3件の重複候補グループを入力
    const consolidation_result = calculateConsolidationJudgment(
      duplicate_candidates
    );

    // 期待結果の検証:
    // 判定ステータス『統合対象』
    expect(consolidation_result.judgment_status).toBe("統合対象");

    // レコードAとB間の一致度スコア『0.95』（住所の微細な差異を許容）
    expect(consolidation_result.match_score_ab).toBe(0.95);

    // レコードAとC間の一致度スコア『0.78』（電話番号が異なるため）
    expect(consolidation_result.match_score_ac).toBe(0.78);

    // 推奨統合アクション『レコードAを主キーとしてレコードB、Cを統合』
    expect(consolidation_result.recommended_action).toBe(
      "レコードAを主キーとしてレコードB、Cを統合"
    );

    // 統合前確認フラグ『true』
    expect(consolidation_result.requires_manual_confirmation).toBe(true);

    // 統合判定エンジンが重複度スコア計算、属性一致度分析、正規化値比較の全プロセスを実行したことを検証
    expect(consolidation_result.has_run_duplicate_score_calculation).toBe(
      true
    );
    expect(consolidation_result.has_run_attribute_match_analysis).toBe(true);
    expect(consolidation_result.has_run_normalized_value_comparison).toBe(true);
  });
});