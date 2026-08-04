import { validatePurchaseHistoryDataQuality } from "../../src/logic/it-1-br-3-3-2-1";

describe("Purchase History Data Quality Validation", () => {
  test("SCEN-1516: [edge] Purchase period with same start and end date passes quality validation", () => {
    const startDate = "2026-08-01";
    const endDate = "2026-08-01";

    const purchaseHistoryData = {
      customerId: "C12345",
      productId: "P98765",
      purchasePeriod: {
        startDate: startDate,
        endDate: endDate,
      },
      purchaseAmount: 50000,
      purchaseFrequency: 1,
      productCategory: "Software",
    };

    const judgmentResult = validatePurchaseHistoryDataQuality(
      purchaseHistoryData
    );

    expect(judgmentResult.isValid).toBe(true);
    expect(judgmentResult.errorCode).toBeNull();
    expect(judgmentResult.qualityScore).toBeGreaterThanOrEqual(0);
    expect(judgmentResult.qualityScore).toBeLessThanOrEqual(100);
    expect(judgmentResult.periodValidation.startDate).toBe(startDate);
    expect(judgmentResult.periodValidation.endDate).toBe(endDate);
    expect(judgmentResult.periodValidation.startDate).toEqual(
      judgmentResult.periodValidation.endDate
    );
  });
});