import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("顧客企業の購買タイミング最適化 - 類似顧客マッチング", () => {
  test("SCEN-1602: 購買履歴が空文字列のとき、一致度が0として計算される", () => {
    // Arrange
    const targetCustomer = {
      customerId: "CUST-001",
      industry: "製造業",
      scale: "大企業",
      purchaseHistory: "",
      lastPurchaseDate: "2024-01-15T10:00:00Z",
    };

    const referenceCustomers = [
      {
        customerId: "CUST-REF-001",
        industry: "製造業",
        scale: "大企業",
        purchaseHistory: "製品A,製品B,製品C",
        lastPurchaseDate: "2024-01-10T09:30:00Z",
        successFlag: true,
      },
      {
        customerId: "CUST-REF-002",
        industry: "製造業",
        scale: "中堅企業",
        purchaseHistory: "製品A,製品D",
        lastPurchaseDate: "2023-12-20T14:15:00Z",
        successFlag: true,
      },
      {
        customerId: "CUST-REF-003",
        industry: "流通業",
        scale: "大企業",
        purchaseHistory: "製品E,製品F,製品G,製品H",
        lastPurchaseDate: "2024-01-12T11:45:00Z",
        successFlag: false,
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          customerId: "CUST-REF-001",
          matchScore: 0,
          reasonForScore: "購買履歴が空文字列のため一致度計算対象外",
        },
        {
          customerId: "CUST-REF-002",
          matchScore: 0,
          reasonForScore: "購買履歴が空文字列のため一致度計算対象外",
        },
        {
          customerId: "CUST-REF-003",
          matchScore: 0,
          reasonForScore: "購買履歴が空文字列のため一致度計算対象外",
        },
      ]),
    };

    // Act
    const result = findSimilarPatterns(
      targetCustomer,
      referenceCustomers,
      mockAIEngine
    );

    // Assert
    expect(result).toEqual([
      {
        customerId: "CUST-REF-001",
        matchScore: 0,
        reasonForScore: "購買履歴が空文字列のため一致度計算対象外",
      },
      {
        customerId: "CUST-REF-002",
        matchScore: 0,
        reasonForScore: "購買履歴が空文字列のため一致度計算対象外",
      },
      {
        customerId: "CUST-REF-003",
        matchScore: 0,
        reasonForScore: "購買履歴が空文字列のため一致度計算対象外",
      },
    ]);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      targetCustomer,
      referenceCustomers
    );

    const allMatchScoresAreZero = result.every(
      (record) => record.matchScore === 0
    );
    expect(allMatchScoresAreZero).toBe(true);
  });
});