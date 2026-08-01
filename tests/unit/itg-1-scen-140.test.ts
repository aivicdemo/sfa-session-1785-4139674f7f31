import { generateActionPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-140
  test("商談記録が0件のとき、標準プロセス遵守度スコアが0として計算される", () => {
    const salesPersonId = "EMP001";
    const dealRecords: Array<{
      salesPersonId: string;
      dealId: string;
      processStep: string;
      timestamp: string;
    }> = [];

    const report = generateActionPatternAnalysisReport({
      salesPersonId,
      dealRecords,
    });

    expect(report.standardProcessComplianceScore).toBe(0);
  });
});