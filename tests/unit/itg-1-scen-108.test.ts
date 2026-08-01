import { convertProcessStandardToSystemRequirements } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-108
  test("プロセス標準書が承認済み状態の場合、システム要件変換処理がエラーになる", async () => {
    const approvedProcessStandard = {
      processId: "PROC-A001",
      version: "1.0",
      approvalStatus: "approved",
      approvalDateTime: "2024-01-15T09:00:00Z",
      content: {
        stages: ["初回接触", "提案", "交渉", "成約"],
        kpiCriteria: { targetConversionRate: 0.3 }
      }
    };

    try {
      await convertProcessStandardToSystemRequirements(approvedProcessStandard);
      fail("Should have thrown an error for approved process standard");
    } catch (error) {
      expect(error).toMatchObject({
        statusCode: 409,
        errorCode: "ERR_APPROVED_PROCESS_CANNOT_CONVERT",
        message: expect.stringMatching(/承認済み/)
      });
    }
  });
});