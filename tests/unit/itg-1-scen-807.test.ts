import { describe, test, expect } from "@jest/globals";
import { analyzeBusinessActivityPattern } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-807
  test("営業プロセスのステップ数が0の場合、エラーを発生させる", () => {
    const input = {
      salesRepId: "REP001",
      analysisStartDate: "2024-01-01T00:00:00Z",
      analysisEndDate: "2024-01-31T23:59:59Z",
      processStepCount: 0,
      dealRecords: [
        {
          dealId: "DEAL001",
          customerId: "CUST001",
          dealAmount: 1000000,
          dealStatus: "completed",
          processStep: 1,
          contactDate: "2024-01-15T10:00:00Z",
        },
      ],
      successDealCount: 1,
      totalDealCount: 1,
    };

    const error = expect(() => analyzeBusinessActivityPattern(input)).toThrow(
      /営業プロセスのステップ数/
    );

    try {
      analyzeBusinessActivityPattern(input);
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.message).toBe(
        "営業プロセスのステップ数は1以上である必要があります"
      );
      expect(err.code).toBe("ERR_INVALID_PROCESS_STEPS");
    }
  });
});