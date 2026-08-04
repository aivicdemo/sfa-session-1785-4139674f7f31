import { validatePurchaseHistoryDataQuality } from "../../src/logic/it-1-br-3-3-2-1";

describe("Purchase History Data Quality Validation with Partial Duplicate Detection", () => {
  test("SCEN-1512: partial duplicate records are identified and added to non-conformance items", () => {
    const purchaseHistoryDataSet = [
      {
        recordId: "rec_001",
        customerId: "cust_A",
        productId: "prod_X",
        purchaseTimestamp: "2024-01-15T10:00:00Z",
        quantity: 100,
        amount: 50000,
      },
      {
        recordId: "rec_002",
        customerId: "cust_A",
        productId: "prod_X",
        purchaseTimestamp: "2024-01-15T14:30:00Z",
        quantity: 150,
        amount: 75000,
      },
      {
        recordId: "rec_003",
        customerId: "cust_B",
        productId: "prod_Y",
        purchaseTimestamp: "2024-01-16T09:00:00Z",
        quantity: 200,
        amount: 100000,
      },
      {
        recordId: "rec_004",
        customerId: "cust_A",
        productId: "prod_X",
        purchaseTimestamp: "2024-01-15T16:45:00Z",
        quantity: 120,
        amount: 60000,
      },
    ];

    const result = validatePurchaseHistoryDataQuality({
      purchaseHistory: purchaseHistoryDataSet,
    });

    expect(result.qualityScore).toBe(65);
    expect(result.nonConformanceItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          classification: "重複レコード",
          recordIds: ["rec_001", "rec_002", "rec_004"],
          reason: "同一顧客・同一商品の複数購買レコード",
        }),
      ])
    );
    expect(result.isUsableForLearning).toBe(true);
  });
});