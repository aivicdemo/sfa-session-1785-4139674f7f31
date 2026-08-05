import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type { Tx12Imp1AiClient } from "../../src/agents/tx-12-imp-1/ai-client";
import { runTx12Imp1Agent } from "../../src/agents/tx-12-imp-1/orchestrator";
import type {
  SalesDataQualityCheckResult,
  SalesDataRecord,
  QualityIssue,
} from "../../src/logic/it-1";
import {
  extractSalesData,
  validateDataQuality,
  detectDuplicates,
} from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード - 営業データ分析から乖離検出までの自律実行", () => {
  let mockAiClient: jest.Mocked<Tx12Imp1AiClient>;
  let auditLogs: Array<{
    timestamp: string;
    eventType: string;
    details: unknown;
  }>;

  beforeEach(() => {
    auditLogs = [];
    mockAiClient = {
      analyzeSalesData: jest.fn(),
      detectProcessDeviation: jest.fn(),
      generateReport: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1310
  test("should execute autonomous sales data quality check with 90% score and trigger escalation when baseline 95% not met", async () => {
    // Arrange: サンプルデータ準備 - 100件の営業成約記録
    // - 正常データ: 90件
    // - 欠損値: 5件 (顧客名フィールド)
    // - 形式エラー: 3件 (金額フィールドが文字列)
    // - 重複データ: 2件 (同一顧客の同一日付)

    const sampleSalesRecords: SalesDataRecord[] = [];

    // 正常データ 90件を作成
    for (let i = 1; i <= 90; i++) {
      sampleSalesRecords.push({
        recordId: `RECORD_${String(i).padStart(3, "0")}`,
        customerId: `CUST_${String((i % 50) + 1).padStart(3, "0")}`,
        customerName: `Customer_${i}`,
        amount: 100000 + i * 1000,
        amountType: "number",
        contactDate: "2024-01-15",
        proposalContent: `Proposal_${i}`,
        status: "completed",
      });
    }

    // 欠損値: 顧客名フィールド5件
    for (let i = 91; i <= 95; i++) {
      sampleSalesRecords.push({
        recordId: `RECORD_${String(i).padStart(3, "0")}`,
        customerId: `CUST_${String((i % 50) + 1).padStart(3, "0")}`,
        customerName: null as unknown as string,
        amount: 100000 + i * 1000,
        amountType: "number",
        contactDate: "2024-01-15",
        proposalContent: `Proposal_${i}`,
        status: "completed",
      });
    }

    // 形式エラー: 金額フィールドが文字列3件
    for (let i = 96; i <= 98; i++) {
      sampleSalesRecords.push({
        recordId: `RECORD_${String(i).padStart(3, "0")}`,
        customerId: `CUST_${String((i % 50) + 1).padStart(3, "0")}`,
        customerName: `Customer_${i}`,
        amount: `NOT_A_NUMBER_${i}` as unknown as number,
        amountType: "string",
        contactDate: "2024-01-15",
        proposalContent: `Proposal_${i}`,
        status: "completed",
      });
    }

    // 重複データ: 同一顧客の同一日付レコード2件
    const duplicateBase = {
      recordId: `RECORD_099`,
      customerId: `CUST_001`,
      customerName: `Customer_DUP_1`,
      amount: 150000,
      amountType: "number",
      contactDate: "2024-01-15",
      proposalContent: `Proposal_DUP`,
      status: "completed",
    };
    sampleSalesRecords.push(duplicateBase);
    sampleSalesRecords.push({
      ...duplicateBase,
      recordId: `RECORD_100`,
    });

    // Mock AI Client 設定
    mockAiClient.analyzeSalesData.mockResolvedValue({
      extractedCount: 100,
      extractedAt: "2024-01-15T11:00:00Z",
      records: sampleSalesRecords,
    });

    mockAiClient.detectProcessDeviation.mockResolvedValue({
      deviationDetected: false,
      deviationPercentage: 0,
    });

    mockAiClient.generateReport.mockResolvedValue({
      reportId: "REPORT_2024_01_15",
      generatedAt: "2024-01-15T11:30:00Z",
      qualityScore: 90,
      status: "escalation_required",
    });

    // Act: トリガーイベント（月次営業会議）を渡してエージェント実行
    const triggerEvent = {
      eventType: "monthly_sales_meeting" as const,
      triggeredAt: "2024-01-15T11:00:00Z",
    };

    // 品質チェック実行
    const qualityCheckResult = await validateDataQuality(sampleSalesRecords);

    // Assert: 品質チェック結果の検証

    // (1) 欠損値検出: 5件
    const missingValueIssues = qualityCheckResult.issues.filter(
      (issue: QualityIssue) => issue.type === "missing_value"
    );
    expect(missingValueIssues).toHaveLength(5);
    expect(missingValueIssues.every((issue: QualityIssue) => issue.fieldName === "customerName")).toBe(
      true
    );
    missingValueIssues.forEach((issue: QualityIssue) => {
      expect(issue.affectedRecordIds).toContain(
        expect.stringMatching(/^RECORD_09[1-5]$/)
      );
    });

    // (2) 形式エラー検出: 3件
    const formatErrorIssues = qualityCheckResult.issues.filter(
      (issue: QualityIssue) => issue.type === "format_error"
    );
    expect(formatErrorIssues).toHaveLength(3);
    expect(
      formatErrorIssues.every((issue: QualityIssue) => issue.fieldName === "amount")
    ).toBe(true);
    formatErrorIssues.forEach((issue: QualityIssue) => {
      expect(issue.affectedRecordIds).toContain(
        expect.stringMatching(/^RECORD_09[6-8]$/)
      );
    });

    // (3) 重複検出: 2件
    const duplicateIssues = qualityCheckResult.issues.filter(
      (issue: QualityIssue) => issue.type === "duplicate"
    );
    expect(duplicateIssues).toHaveLength(1);
    expect(duplicateIssues[0].affectedRecordIds).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^RECORD_0(99|100)$/),
      ])
    );

    // (4) 正常データ: 90件
    expect(qualityCheckResult.validRecordCount).toBe(90);

    // (5) 全体品質スコア: 90/100 (90%)
    expect(qualityCheckResult.qualityScore).toBe(90);
    expect(qualityCheckResult.qualityScorePercentage).toBe(0.9);

    // 品質スコアが95%基準値を下回ることを検証
    expect(qualityCheckResult.qualityScore).toBeLessThan(95);

    // Escalation条件が満たされていることを検証
    expect(qualityCheckResult.escalationRequired).toBe(true);
    expect(qualityCheckResult.escalationReason).toMatch(/品質スコア/);

    // 監査ログに問題が記録されていることを検証
    expect(qualityCheckResult.auditLog).toBeDefined();
    expect(qualityCheckResult.auditLog.length).toBeGreaterThan(0);

    const missingValueLog = qualityCheckResult.auditLog.find(
      (log) => log.eventType === "missing_value_detected"
    );
    expect(missingValueLog).toBeDefined();
    expect(missingValueLog?.details).toMatchObject({
      count: 5,
      fieldName: "customerName",
    });

    const formatErrorLog = qualityCheckResult.auditLog.find(
      (log) => log.eventType === "format_error_detected"
    );
    expect(formatErrorLog).toBeDefined();
    expect(formatErrorLog?.details).toMatchObject({
      count: 3,
      fieldName: "amount",
    });

    const duplicateLog = qualityCheckResult.auditLog.find(
      (log) => log.eventType === "duplicate_detected"
    );
    expect(duplicateLog).toBeDefined();
    expect(duplicateLog?.details).toMatchObject({
      count: 1,
    });

    // 各監査ログエントリに検出時刻が記録されていることを検証
    qualityCheckResult.auditLog.forEach((log) => {
      expect(log.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    });

    // Escalation状態を検証
    expect(qualityCheckResult.processState).toBe("quality_check_escalation");

    // 以降の自律処理が開始されていないことを検証
    expect(qualityCheckResult.nextAutonomousActionStarted).toBe(false);

    // AI Client への呼び出しを検証
    expect(mockAiClient.analyzeSalesData).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "monthly_sales_meeting",
      })
    );

    // 品質改善が必要な状態を確認
    expect(qualityCheckResult.requiresManualIntervention).toBe(true);
    expect(qualityCheckResult.interventionType).toBe(
      "data_quality_improvement"
    );
  });
});