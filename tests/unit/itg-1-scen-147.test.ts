import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type { SalesPersonBehaviorAnalysisReportRequest, SalesPersonBehaviorAnalysisReportResponse } from "../../src/logic/it-1-br-2-1-1";
import { generateSalesPersonBehaviorAnalysisReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-147: [error] 営業担当者行動パターン分析レポート生成機能 - 行動パターン分析結果テーブルが利用不可のときレポート生成が中止される
  test("行動パターン分析結果テーブルが利用不可の場合、レポート生成が中止されDB_TABLE_UNAVAILABLEエラーが返される", async () => {
    const request: SalesPersonBehaviorAnalysisReportRequest = {
      salesPersonId: "EMP-001",
      analysisStartDate: "2024-01-01",
      analysisEndDate: "2024-03-31",
      requestedAt: "2024-04-15T10:30:00Z",
    };

    const mockBehaviorAnalysisRepository = {
      getBehaviorPatternsByPersonAndPeriod: jest.fn().mockRejectedValue(
        new Error("DB_TABLE_UNAVAILABLE")
      ),
    };

    const response: SalesPersonBehaviorAnalysisReportResponse =
      await generateSalesPersonBehaviorAnalysisReport(
        request,
        mockBehaviorAnalysisRepository
      );

    expect(response.status).toBe("failed");
    expect(response.errorCode).toBe("DB_TABLE_UNAVAILABLE");
    expect(response.notificationMessage).toBe(
      "行動パターン分析結果テーブルが利用不可のため、レポート生成を中止しました。後ほど再度お試しください。"
    );
    expect(response.reportData).toBeUndefined();
    expect(mockBehaviorAnalysisRepository.getBehaviorPatternsByPersonAndPeriod).toHaveBeenCalledWith(
      "EMP-001",
      "2024-01-01",
      "2024-03-31"
    );
  });
});