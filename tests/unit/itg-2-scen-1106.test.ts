import { detectDuplicateCustomersWithQualityCheck } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1106
  test("品質検証結果で不合格の顧客が重複候補に含まれるとき、その旨が判定結果に反映される", () => {
    const input = {
      duplicate_group_id: "DUP-GROUP-001",
      candidates: [
        {
          customer_id: "CUST-001",
          quality_validation_status: "不合格",
        },
        {
          customer_id: "CUST-002",
          quality_validation_status: "合格",
        },
      ],
    };

    const result = detectDuplicateCustomersWithQualityCheck(input);

    expect(result.duplicate_group_id).toBe("DUP-GROUP-001");
    expect(result.candidates).toEqual([
      {
        customer_id: "CUST-001",
        quality_validation_status: "不合格",
      },
      {
        customer_id: "CUST-002",
        quality_validation_status: "合格",
      },
    ]);
    expect(result.has_quality_issue_warning).toBe(true);
    expect(result.warning_message).toBe(
      "グループ内に品質検証で不合格の顧客が含まれています"
    );
  });
});