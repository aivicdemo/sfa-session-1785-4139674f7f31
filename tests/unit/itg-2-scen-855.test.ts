import {
  detectDuplicateCustomers,
} from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-855: [normal] 顧客データ重複検出機能 - 重複候補顧客が複数件のとき、全件を対象に重複検出が実行される", () => {
    const customerA = {
      customer_id: "CUST-001",
      company_name: "株式会社テック",
      phone_number: "03-1234-5678",
      email: "contact@tech-corp.jp",
    };

    const customerB = {
      customer_id: "CUST-002",
      company_name: "株式会社テック",
      phone_number: "03-1234-5678",
      email: "info@tech-corp.jp",
    };

    const customerC = {
      customer_id: "CUST-003",
      company_name: "テック株式会社",
      phone_number: "03-1234-5678",
      email: "support@techcorp.jp",
    };

    const duplicateCandidates = [customerA, customerB, customerC];

    const result = detectDuplicateCustomers({
      duplicate_candidates: duplicateCandidates,
    });

    expect(result.processed_customer_count).toBe(3);
    expect(result.duplicate_pairs).toHaveLength(3);

    const pairIds = result.duplicate_pairs.map(
      (pair: { customer_id_1: string; customer_id_2: string }) =>
        `${pair.customer_id_1}-${pair.customer_id_2}`
    );
    expect(pairIds).toContain("CUST-001-CUST-002");
    expect(pairIds).toContain("CUST-001-CUST-003");
    expect(pairIds).toContain("CUST-002-CUST-003");

    expect(result.all_candidates_processed).toBe(true);
    expect(result.pairwise_comparison_completed).toBe(true);
  });
});