import { generateSignalDetectionRationale } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-765
  test("信号検出根拠生成機能 - 最終接触日と購買周期は揃うが反応パターンが0件のとき、根拠に2要素のみが記載される", () => {
    const customer_id = "CUST-001";
    const last_contact_date = new Date("2024-01-15T00:00:00Z");
    const purchase_cycle_days = 30;
    const reaction_patterns: unknown[] = [];

    const rationale = generateSignalDetectionRationale({
      customer_id,
      last_contact_date,
      purchase_cycle_days,
      reaction_patterns,
    });

    expect(rationale.elements).toHaveLength(2);
    expect(rationale.elements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          element_type: "last_contact_date",
        }),
        expect.objectContaining({
          element_type: "purchase_cycle",
        }),
      ])
    );
    expect(rationale.elements).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          element_type: "reaction_pattern",
        }),
      ])
    );
  });
});