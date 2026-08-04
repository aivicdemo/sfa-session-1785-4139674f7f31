import { evaluateDataQuality } from "../../src/logic/it-1-br-3-3-2-1";

describe("Purchase History Data Quality Evaluation", () => {
  test("SCEN-1461: Data quality score at threshold boundary (0.81) should be marked as acceptable for learning", () => {
    const testPurchaseHistoryData = {
      purchaseId: "PUR-20240115-001",
      customerId: "CUST-ABC123",
      productCategory: "Enterprise Software",
      purchaseAmount: 250000,
      purchaseDate: "2024-01-15T09:30:00Z",
      previousPurchaseInterval: 180,
      quantity: 5,
      completionStatus: "COMPLETED",
      customerIndustry: "Manufacturing",
      customerEmployeeCount: 500,
      paymentTerms: "NET30",
      contractDuration: 12,
      renewalProbability: 0.85,
      dataCompleteness: 0.95,
      dataConsistency: 0.88,
      dataAccuracy: 0.71,
      dataTimeliness: 0.80,
    };

    const result = evaluateDataQuality(testPurchaseHistoryData);

    expect(result.qualityScore).toBe(0.81);
    expect(result.status).toBe("ACCEPTABLE");
    expect(result.usableForLearning).toBe(true);
    expect(result.isRegisteredAsLearningCandidate).toBe(true);
  });
});