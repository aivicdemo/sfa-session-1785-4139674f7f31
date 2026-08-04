import { validateCustomerDataCompleteness } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 顧客データ完全性・妥当性判定", () => {
  // SCEN-706
  test("顧客規模が営業マスタの定義済み規模リストに含まれるとき、規模データは妥当と判定される", () => {
    // Arrange
    const definedCustomerScales = [
      "大企業",
      "中堅企業",
      "中小企業",
      "スタートアップ",
    ];

    const customerData = {
      customerId: "CUST_001",
      customerName: "テスト顧客",
      industry: "IT",
      customerScale: "中堅企業",
    };

    // Act
    const result = validateCustomerDataCompleteness(
      customerData,
      definedCustomerScales
    );

    // Assert
    expect(result.validationStatus).toBe("VALID");
    expect(result.errorMessage).toBeNull();
    expect(result.targetField).toBe("customerScale");
    expect(result.appliedRule).toBe("masterListValidation");
  });
});