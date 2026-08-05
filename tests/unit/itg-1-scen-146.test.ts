import { generateSalesActivityAnalysisReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者行動パターン分析レポート生成機能", () => {
  // SCEN-146
  test("成約実績データへのアクセスが失敗したときレポート生成が中止される", async () => {
    const fetchMock = require("jest-fetch-mock");
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    // 成約実績データベースへのアクセスを失敗状態に設定
    fetchMock.mockRejectOnce(new Error("DB_CONNECTION_FAILED"));

    const target_period_start = "2024-01-01";
    const target_period_end = "2024-03-31";
    const sales_staff_id = "USER_123";

    try {
      await generateSalesActivityAnalysisReport({
        target_period_start,
        target_period_end,
        sales_staff_id,
      });
      fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.status_code).toBe(500);
      expect(error.error_message).toMatch(/成約実績データの取得に失敗しました/);
      expect(error.error_code).toBe("DATA_FETCH_ERROR");
    }

    fetchMock.disableMocks();
  });
});