import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-152
  test("定義された名寄せ基準ルール複数件のとき、全ての基準で重複判定が実行される", () => {
    const nameMatchingRules = [
      {
        rule_id: "rule_001",
        rule_name: "顧客名完全一致かつ郵便番号一致",
        customer_name_match_type: "exact",
        postal_code_match: true,
        phone_match: false,
        email_match: false,
      },
      {
        rule_id: "rule_002",
        rule_name: "顧客名前方一致かつ電話番号一致",
        customer_name_match_type: "prefix",
        postal_code_match: false,
        phone_match: true,
        email_match: false,
      },
      {
        rule_id: "rule_003",
        rule_name: "メールアドレス完全一致",
        customer_name_match_type: "none",
        postal_code_match: false,
        phone_match: false,
        email_match: true,
      },
    ];

    const customerA = {
      customer_id: "cust_001",
      customer_name: "山田太郎",
      postal_code: "100-0001",
      phone: "090-1234-5678",
      email: "yamada@example.com",
    };

    const customerB = {
      customer_id: "cust_002",
      customer_name: "山田太郎",
      postal_code: "100-0001",
      phone: "090-1234-5678",
      email: "yamada@example.com",
    };

    const result = detectDuplicateCustomers(
      [customerA, customerB],
      nameMatchingRules
    );

    expect(result).toEqual({
      duplicate_pairs: [
        {
          customer_pair_id: "pair_001",
          customer_a_id: "cust_001",
          customer_b_id: "cust_002",
          matching_rules: [
            {
              rule_id: "rule_001",
              rule_name: "顧客名完全一致かつ郵便番号一致",
              is_matched: true,
              matched_fields: ["customer_name", "postal_code"],
            },
            {
              rule_id: "rule_002",
              rule_name: "顧客名前方一致かつ電話番号一致",
              is_matched: true,
              matched_fields: ["customer_name", "phone"],
            },
            {
              rule_id: "rule_003",
              rule_name: "メールアドレス完全一致",
              is_matched: true,
              matched_fields: ["email"],
            },
          ],
          total_rules_applied: 3,
          rules_matched: 3,
          duplicate_judgment: true,
        },
      ],
      summary: {
        total_customer_pairs_checked: 1,
        duplicate_pairs_detected: 1,
        total_rules_applied: 3,
      },
    });
  });
});