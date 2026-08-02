import { determineMergeJudgmentForDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-819
  test("重複候補の順序が A → B → C から C → B → A に逆順の場合、統合判定順序が正しく処理される", () => {
    // 重複候補レコード（A → B → C の順序）
    const duplicateCandidatesABC = [
      {
        customer_id: "A001",
        customer_name: "ABC Corporation",
        email: "contact@abc.com",
        phone: "090-1111-1111",
        address: "Tokyo",
        registered_at: new Date("2024-01-10T00:00:00Z"),
      },
      {
        customer_id: "B001",
        customer_name: "ABC Corp",
        email: "contact@abc.com",
        phone: "090-1111-1111",
        address: "Tokyo",
        registered_at: new Date("2024-01-15T00:00:00Z"),
      },
      {
        customer_id: "C001",
        customer_name: "ABC Co.",
        email: "contact@abc.com",
        phone: "090-1111-1111",
        address: "Tokyo",
        registered_at: new Date("2024-01-20T00:00:00Z"),
      },
    ];

    // 重複候補レコード（C → B → A の逆順）
    const duplicateCandidatesCBA = [
      {
        customer_id: "C001",
        customer_name: "ABC Co.",
        email: "contact@abc.com",
        phone: "090-1111-1111",
        address: "Tokyo",
        registered_at: new Date("2024-01-20T00:00:00Z"),
      },
      {
        customer_id: "B001",
        customer_name: "ABC Corp",
        email: "contact@abc.com",
        phone: "090-1111-1111",
        address: "Tokyo",
        registered_at: new Date("2024-01-15T00:00:00Z"),
      },
      {
        customer_id: "A001",
        customer_name: "ABC Corporation",
        email: "contact@abc.com",
        phone: "090-1111-1111",
        address: "Tokyo",
        registered_at: new Date("2024-01-10T00:00:00Z"),
      },
    ];

    // 統合判定ルール定義
    const mergeRules = {
      primary_key_field: "customer_id",
      matching_criteria: [
        {
          field: "email",
          similarity_threshold: 1.0,
          weight: 0.4,
        },
        {
          field: "phone",
          similarity_threshold: 1.0,
          weight: 0.4,
        },
        {
          field: "address",
          similarity_threshold: 0.8,
          weight: 0.2,
        },
      ],
      consolidation_strategy: "earliest_registration",
      exclude_judgment_flag: false,
    };

    // A → B → C の順序での統合判定実行
    const resultABC = determineMergeJudgmentForDuplicateCustomers(
      duplicateCandidatesABC,
      mergeRules
    );

    // C → B → A の逆順での統合判定実行
    const resultCBA = determineMergeJudgmentForDuplicateCustomers(
      duplicateCandidatesCBA,
      mergeRules
    );

    // 親レコード（マスタレコード）が同一であることを確認
    expect(resultABC.parent_customer_id).toBe(resultCBA.parent_customer_id);
    expect(resultABC.parent_customer_id).toBe("A001");

    // 統合対象レコードのセットが同一であることを確認
    const mergeTargetsABC = new Set(resultABC.merge_target_ids);
    const mergeTargetsCBA = new Set(resultCBA.merge_target_ids);
    expect(mergeTargetsABC.size).toBe(mergeTargetsCBA.size);
    expect(Array.from(mergeTargetsABC).sort()).toEqual(
      Array.from(mergeTargetsCBA).sort()
    );
    expect(Array.from(mergeTargetsABC).sort()).toEqual(["B001", "C001"]);

    // 除外判定フラグが同一であることを確認
    expect(resultABC.exclude_judgment_flag).toBe(
      resultCBA.exclude_judgment_flag
    );
    expect(resultABC.exclude_judgment_flag).toBe(false);

    // 統合後の顧客データ（正規化後のマスタレコード）が同一であることを確認
    expect(resultABC.consolidated_customer_data).toEqual(
      resultCBA.consolidated_customer_data
    );
    expect(resultABC.consolidated_customer_data.customer_id).toBe("A001");
    expect(resultABC.consolidated_customer_data.customer_name).toBe(
      "ABC Corporation"
    );
    expect(resultABC.consolidated_customer_data.email).toBe("contact@abc.com");
    expect(resultABC.consolidated_customer_data.phone).toBe("090-1111-1111");
    expect(resultABC.consolidated_customer_data.address).toBe("Tokyo");

    // マッピング関係（どのレコードが親/子として扱われるか）が同一であることを確認
    expect(resultABC.mapping_relationship).toEqual(
      resultCBA.mapping_relationship
    );
    expect(resultABC.mapping_relationship).toEqual({
      A001: { role: "parent", status: "active" },
      B001: { role: "child", status: "merged_to_A001" },
      C001: { role: "child", status: "merged_to_A001" },
    });

    // 統合判定の決定根拠が合理的であることを確認
    expect(resultABC.merge_judgment_reason).toBeDefined();
    expect(resultABC.merge_judgment_reason).toContain("earliest_registration");
  });
});