import { runTx12Imp1Agent } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード - AIエージェント自律実行の冪等性", () => {
  // SCEN-1323
  test("同一リクエストID再実行時にレポート・通知の重複書き込みが防止される", async () => {
    // Setup: テスト用DBスタブ
    const mockDb = {
      reports: [] as Array<{
        reportId: string;
        generatedAt: string;
        dataQualityScore: number;
        recordCount: number;
        deviationDetected: boolean;
        correlationAnalysisResult: Record<string, unknown>;
      }>,
      notifications: [] as Array<{
        notificationId: string;
        recipientId: string;
        type: string;
        reportId: string;
        createdAt: string;
      }>,
      auditLog: [] as Array<{
        action: string;
        requestId: string;
        originalExecutionTime: string;
        retryExecutionTime: string;
        status: string;
      }>,
      salesData: [
        {
          dataRecordId: `record-${i}`,
          employeeId: `emp-${(i % 10).toString()}`,
          contactDate: new Date(2024, 0, 15 - (i % 15)).toISOString(),
          activityType: i % 3 === 0 ? "visit" : i % 3 === 1 ? "call" : "email",
          customerId: `cust-${(i % 50).toString()}`,
          proposalContent: `proposal-content-${i % 10}`,
          followUpScheduled:
            i % 2 === 0 ? new Date(2024, 0, 20).toISOString() : null,
          contractResult: i % 4 === 0 ? "won" : i % 4 === 1 ? "lost" : "pending",
        },
      ].concat(
        Array.from({ length: 499 }, (_, i) => ({
          dataRecordId: `record-${i + 1}`,
          employeeId: `emp-${((i + 1) % 10).toString()}`,
          contactDate: new Date(2024, 0, 15 - ((i + 1) % 15)).toISOString(),
          activityType:
            (i + 1) % 3 === 0
              ? "visit"
              : (i + 1) % 3 === 1
                ? "call"
                : "email",
          customerId: `cust-${((i + 1) % 50).toString()}`,
          proposalContent: `proposal-content-${(i + 1) % 10}`,
          followUpScheduled:
            (i + 1) % 2 === 0 ? new Date(2024, 0, 20).toISOString() : null,
          contractResult:
            (i + 1) % 4 === 0 ? "won" : (i + 1) % 4 === 1 ? "lost" : "pending",
        }))
      ),
    };

    // Mock the database query and insert functions
    const queryReportsByRequestId = async (requestId: string) => {
      return mockDb.reports.filter((r) => r.reportId.includes(requestId));
    };

    const insertReport = async (report: {
      reportId: string;
      generatedAt: string;
      dataQualityScore: number;
      recordCount: number;
      deviationDetected: boolean;
      correlationAnalysisResult: Record<string, unknown>;
    }) => {
      const existing = mockDb.reports.find((r) => r.reportId === report.reportId);
      if (!existing) {
        mockDb.reports.push(report);
      }
      return report;
    };

    const insertNotification = async (notification: {
      notificationId: string;
      recipientId: string;
      type: string;
      reportId: string;
      createdAt: string;
    }) => {
      const existing = mockDb.notifications.find(
        (n) => n.notificationId === notification.notificationId
      );
      if (!existing) {
        mockDb.notifications.push(notification);
      }
      return notification;
    };

    const insertAuditLog = async (log: {
      action: string;
      requestId: string;
      originalExecutionTime: string;
      retryExecutionTime: string;
      status: string;
    }) => {
      mockDb.auditLog.push(log);
    };

    // Trigger event for initial execution
    const triggerEvent1 = {
      requestId: "req-001",
      timestamp: "2024-01-15T09:00:00Z",
      eventType: "monthly_sales_meeting",
      managerId: "mgr-123",
    };

    // First execution
    const result1 = await runTx12Imp1Agent(
      triggerEvent1,
      mockDb.salesData,
      queryReportsByRequestId,
      insertReport,
      insertNotification,
      insertAuditLog
    );

    // Verify first execution results
    expect(result1.reportId).toBe("rpt-001");
    expect(result1.generatedAt).toBe("2024-01-15T09:45:00Z");
    expect(result1.dataQualityScore).toBe(0.98);
    expect(result1.recordCount).toBe(500);
    expect(result1.deviationDetected).toBe(true);
    expect(result1.correlationAnalysisResult).toEqual({
      averageContractRate: 0.25,
      processComplianceRate: 0.88,
      topDeviation: "follow_up_timing",
    });

    // Verify reports table has 1 entry
    expect(mockDb.reports.length).toBe(1);
    expect(mockDb.reports[0].reportId).toBe("rpt-001");

    // Verify notifications table has 1 entry
    expect(mockDb.notifications.length).toBe(1);
    expect(mockDb.notifications[0].notificationId).toBe("notif-001");
    expect(mockDb.notifications[0].recipientId).toBe("mgr-123");
    expect(mockDb.notifications[0].type).toBe("analysis_report_generated");
    expect(mockDb.notifications[0].reportId).toBe("rpt-001");

    // Second execution with same requestId (idempotent retry)
    const triggerEvent2 = {
      requestId: "req-001",
      timestamp: "2024-01-15T09:00:00Z",
      eventType: "monthly_sales_meeting",
      managerId: "mgr-123",
    };

    const result2 = await runTx12Imp1Agent(
      triggerEvent2,
      mockDb.salesData,
      queryReportsByRequestId,
      insertReport,
      insertNotification,
      insertAuditLog
    );

    // Verify second execution returns same report
    expect(result2.reportId).toBe("rpt-001");
    expect(result2.status).toBe("deduplicated");

    // Verify reports table still has only 1 entry
    expect(mockDb.reports.length).toBe(1);
    expect(mockDb.reports[0].reportId).toBe("rpt-001");

    // Verify notifications table still has only 1 entry
    expect(mockDb.notifications.length).toBe(1);
    expect(
      mockDb.notifications.filter((n) => n.reportId === "rpt-001").length
    ).toBe(1);

    // Verify audit log recorded deduplication
    expect(mockDb.auditLog.length).toBeGreaterThanOrEqual(1);
    const deduplicationLog = mockDb.auditLog.find(
      (log) =>
        log.action === "duplicate_request_detected" &&
        log.requestId === "req-001"
    );
    expect(deduplicationLog).toBeDefined();
    expect(deduplicationLog?.status).toBe("deduplicated");
    expect(deduplicationLog?.originalExecutionTime).toBe(
      "2024-01-15T09:45:00Z"
    );
    expect(deduplicationLog?.retryExecutionTime).toBe("2024-01-15T10:00:00Z");

    // Verify idempotency by checking that cached report ID matches
    expect(result2.reportId).toBe(result1.reportId);
  });
});