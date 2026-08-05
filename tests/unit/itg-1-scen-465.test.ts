import { describe, test, expect } from "@jest/globals";
import {
  generateMonthlyAuditDashboard,
  AuditDashboardRequest,
  AuditDashboardResponse,
  SalesExecutiveMetrics,
} from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-465: [normal] 営業プロセス監査・分析管理システム - 営業部長が月次営業会議で参照する際、複数営業担当者の行動パターン・成約実績・標準プロセス乖離度が一覧で正常に可視化される
  test("should display multiple sales executives behavior patterns, contract results, and process deviation in dashboard format", () => {
    const request: AuditDashboardRequest = {
      targetMonth: "2024-01-01",
      selectedSalesExecutiveIds: ["exec_001", "exec_002", "exec_003"],
      userRole: "sales_director",
      userId: "director_001",
    };

    const response: AuditDashboardResponse =
      generateMonthlyAuditDashboard(request);

    expect(response).toBeDefined();
    expect(response.status).toBe("success");
    expect(response.dashboardData).toBeDefined();
    expect(Array.isArray(response.dashboardData.rows)).toBe(true);
    expect(response.dashboardData.rows.length).toBe(3);

    // 営業担当者A
    const rowA: SalesExecutiveMetrics = response.dashboardData.rows[0];
    expect(rowA.salesExecutiveId).toBe("exec_001");
    expect(rowA.behaviorPatterns.visitCount).toBe(15);
    expect(rowA.behaviorPatterns.phoneCallCount).toBe(28);
    expect(rowA.behaviorPatterns.emailCount).toBe(12);
    expect(rowA.behaviorPatterns.proposalCount).toBe(15);
    expect(rowA.contractResults.contractCount).toBe(3);
    expect(rowA.contractResults.contractAmount).toBe(4500000);
    expect(rowA.contractResults.contractRate).toBe(20);
    expect(rowA.processDeviation.complianceRate).toBe(85);
    expect(rowA.processDeviation.deviationLevel).toBe("moderate");

    // 営業担当者B
    const rowB: SalesExecutiveMetrics = response.dashboardData.rows[1];
    expect(rowB.salesExecutiveId).toBe("exec_002");
    expect(rowB.behaviorPatterns.visitCount).toBe(18);
    expect(rowB.behaviorPatterns.phoneCallCount).toBe(35);
    expect(rowB.behaviorPatterns.emailCount).toBe(18);
    expect(rowB.behaviorPatterns.proposalCount).toBe(18);
    expect(rowB.contractResults.contractCount).toBe(4);
    expect(rowB.contractResults.contractAmount).toBe(5800000);
    expect(rowB.contractResults.contractRate).toBe(22);
    expect(rowB.processDeviation.complianceRate).toBe(78);
    expect(rowB.processDeviation.deviationLevel).toBe("high");

    // 営業担当者C
    const rowC: SalesExecutiveMetrics = response.dashboardData.rows[2];
    expect(rowC.salesExecutiveId).toBe("exec_003");
    expect(rowC.behaviorPatterns.visitCount).toBe(12);
    expect(rowC.behaviorPatterns.phoneCallCount).toBe(22);
    expect(rowC.behaviorPatterns.emailCount).toBe(8);
    expect(rowC.behaviorPatterns.proposalCount).toBe(12);
    expect(rowC.contractResults.contractCount).toBe(2);
    expect(rowC.contractResults.contractAmount).toBe(3200000);
    expect(rowC.contractResults.contractRate).toBe(17);
    expect(rowC.processDeviation.complianceRate).toBe(92);
    expect(rowC.processDeviation.deviationLevel).toBe("low");

    // ダッシュボード全体構造検証
    expect(response.dashboardData.displayFormat).toBe("table");
    expect(response.dashboardData.columns).toContain("visitCount");
    expect(response.dashboardData.columns).toContain("phoneCallCount");
    expect(response.dashboardData.columns).toContain("emailCount");
    expect(response.dashboardData.columns).toContain("contractCount");
    expect(response.dashboardData.columns).toContain("contractAmount");
    expect(response.dashboardData.columns).toContain("contractRate");
    expect(response.dashboardData.columns).toContain("complianceRate");
    expect(response.dashboardData.columns).toContain("deviationLevel");

    // メタデータ検証
    expect(response.dashboardData.targetMonth).toBe("2024-01-01");
    expect(response.dashboardData.generatedAt).toBeDefined();
    expect(typeof response.dashboardData.generatedAt).toBe("string");
  });
});