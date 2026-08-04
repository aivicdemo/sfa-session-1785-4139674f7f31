import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("類似顧客マッチング処理", () => {
  test("SCEN-1531: 購買履歴データが欠けている場合、マッチング処理は継続され該当顧客群は空配列を返す", () => {
    const incompleteCustomer = {
      customer_id: "CUST001",
      customer_name: "Test Company",
      industry: "Manufacturing",
      employee_count: 150,
      purchase_history: [
        {
          purchase_id: "PUR001",
          purchase_date: "2024-01-15",
          product_category: "Software",
          purchase_amount: 50000,
        },
        {
          purchase_id: "PUR002",
          purchase_date: "2024-02-20",
          product_category: undefined,
          purchase_amount: undefined,
        },
      ],
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const processLogs: string[] = [];
    const originalLog = console.log;
    console.log = (message: string) => {
      processLogs.push(message);
    };

    try {
      const result = findSimilarPatterns(incompleteCustomer, mockAIEngine);

      expect(result).toEqual([]);
      expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
      expect(processLogs.some((log) => /購買履歴データの不足/.test(log))).toBe(
        true
      );
    } finally {
      console.log = originalLog;
    }
  });
});