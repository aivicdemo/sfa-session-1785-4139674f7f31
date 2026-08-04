import { validateCustomerDataCompleteness } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-708: 商談予定日が本日と同じ日のとき、日付データは妥当と判定される", () => {
    const today = new Date("2026-08-01T00:00:00Z");
    const mockNow = today.getTime();

    const originalDateNow = Date.now;
    Date.now = jest.fn(() => mockNow);

    try {
      const customerData = {
        customerId: "CUST_001",
        customerName: "テスト顧客",
        industry: "製造業",
        scale: "大企業",
        dealScheduledDate: "2026-08-01",
      };

      const result = validateCustomerDataCompleteness(customerData);

      expect(result.isValid).toBe(true);
      expect(result.dateValidationStatus).toBe("VALID_DATE");
      expect(result.errors).toEqual([]);
      expect(result.errorMessage).toBeUndefined();
    } finally {
      Date.now = originalDateNow;
    }
  });
});