import { determineDuplicateAndMerge } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1105
  test("[normal] 正規化前後で判定スコアが異なるとき、正規化後のスコアで最終判定される", () => {
    const customerA_before = {
      customer_id: "CUST_001",
      name: "田中 太郎",
      email: "tanaka.taro@example.com",
      phone: "090-1234-5678",
    };

    const customerB_before = {
      customer_id: "CUST_002",
      name: "田中太郎",
      email: "tanaka.taro@example.com",
      phone: "0901234-5678",
    };

    const customerA_after = {
      customer_id: "CUST_001",
      name: "田中太郎",
      email: "tanaka.taro@example.com",
      phone: "09012345678",
    };

    const customerB_after = {
      customer_id: "CUST_002",
      name: "田中太郎",
      email: "tanaka.taro@example.com",
      phone: "09012345678",
    };

    const input = {
      customer_pair: {
        customer_a: customerA_after,
        customer_b: customerB_after,
      },
      pre_normalization_score: 0.65,
      post_normalization_score: 0.98,
      normalization_rules_applied: [
        "remove_whitespace",
        "normalize_phone_format",
      ],
      threshold_for_merge: 0.9,
    };

    const result = determineDuplicateAndMerge(input);

    expect(result).toEqual({
      is_duplicate: true,
      final_score: 0.98,
      score_used_for_judgment: "post_normalization_score",
      should_merge: true,
      merge_candidate_id: "CUST_001",
      merge_target_id: "CUST_002",
      reason: "正規化後のスコア0.98がマージ閾値0.9を超過",
    });

    expect(result.is_duplicate).toBe(true);
    expect(result.final_score).toBe(0.98);
    expect(result.should_merge).toBe(true);
    expect(result.score_used_for_judgment).toBe("post_normalization_score");
  });
});