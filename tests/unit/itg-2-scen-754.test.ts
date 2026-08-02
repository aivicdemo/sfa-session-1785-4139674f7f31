import { generateSignalDetectionReasoning } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-754: [edge] 信号検出根拠生成機能 - 最終接触日が空のとき、根拠にその旨が記載される
  test("最終接触日が空の場合、根拠に未設定である旨が明記される", () => {
    const customer_with_null_contact_date = {
      customer_id: "CUST-001",
      customer_name: "Sample Customer Inc.",
      last_contact_date: null,
      purchase_cycle_days: 30,
      reaction_pattern: "responsive",
    };

    const result = generateSignalDetectionReasoning(
      customer_with_null_contact_date
    );

    expect(result).toEqual({
      signal_strength: "weak",
      reasonDetails: expect.stringContaining("最終接触日が未設定です"),
      detection_basis: expect.arrayContaining([
        expect.stringMatching(/最終接触日/),
      ]),
    });
    expect(result.reasonDetails).toMatch(/最終接触日が未設定です/);
  });
});