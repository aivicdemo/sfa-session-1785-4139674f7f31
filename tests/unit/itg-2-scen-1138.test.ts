import { determineIntegration } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-1138: 重複スコアが閾値未満である場合、統合判定が不合格となる", () => {
    // Arrange
    const customer_1 = {
      customer_id: "CUST-001",
      customer_name: "Sample Corp A",
      postal_code: "100-0001",
      address: "Tokyo",
      phone_number: "03-1234-5678",
    };

    const customer_2 = {
      customer_id: "CUST-002",
      customer_name: "Sample Corp A",
      postal_code: "100-0001",
      address: "Tokyo",
      phone_number: "03-1234-5678",
    };

    const integration_threshold = 80;
    const calculated_duplicate_score = 65;

    // Act
    const result = determineIntegration(
      customer_1,
      customer_2,
      calculated_duplicate_score,
      integration_threshold
    );

    // Assert
    expect(result.status).toBe("NG");
    expect(result.reason).toContain("65");
    expect(result.reason).toContain("80");
    expect(result.reason).toMatch(/統合/);
  });
});