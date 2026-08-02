import { validateProposalContent } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-941: 提案日付が未来日のとき検証に成功する", () => {
    // Arrange
    const fixed_current_datetime = new Date("2024-01-15T10:00:00Z");
    const proposal_future_date = new Date("2024-01-20T00:00:00Z");

    const proposal_data = {
      proposal_date: proposal_future_date,
      customer_id: "CUST-001",
      product_id: "PROD-001",
      amount: 100000,
    };

    // Mock current time
    jest.useFakeTimers();
    jest.setSystemTime(fixed_current_datetime);

    // Act
    const validation_result = validateProposalContent(proposal_data);

    // Assert
    expect(validation_result.status).toBe("success");
    expect(validation_result.error_message).toBe("");
    expect(validation_result.validation_flag).toBe(true);

    // Cleanup
    jest.useRealTimers();
  });
});