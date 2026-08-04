import { validateRecommendationDataCompleteness } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-722: 推奨生成前データ完全性判定機能 - 営業担当者IDが空のとき推奨生成不可と判定される", () => {
    const inputData = {
      salesPersonId: "",
      customerId: "CUST-00001",
      dealConditionId: "DEAL-00001",
      customerIndustry: "製造業",
      customerScale: "中堅企業",
    };

    const result = validateRecommendationDataCompleteness(inputData);

    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe("VALIDATION_ERROR_EMPTY_SALES_PERSON_ID");
    expect(result.error).toBeDefined();
    expect(result.error?.message).toMatch(/営業担当者ID/);
  });
});