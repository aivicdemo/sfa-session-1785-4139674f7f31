import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

// Mock types for AI client and dependencies
interface HealthCheckResult {
  status: "healthy" | "degraded" | "critical";
  timestamp: string;
  component_status: Record<string, string>;
}

interface DataQualityResult {
  quality_score: number;
  timestamp: string;
  issues: Array<{ category: string; count: number }>;
}

interface InferenceAccuracyResult {
  accuracy_score: number;
  timestamp: string;
  inference_count: number;
}

interface DiagnosisRecord {
  diagnosis_id: string;
  health_check_result: HealthCheckResult;
  data_quality_result: DataQualityResult;
  inference_accuracy_result: InferenceAccuracyResult;
  aggregated_anomalies: Array<{
    category: string;
    severity: "low" | "medium" | "high";
    priority: number;
  }>;
  priority_level: "low" | "medium" | "high";
  report_generated_at: string;
  idempotent_flag: string;
  created_at: string;
  updated_at: string;
}

interface NotificationRecord {
  notification_id: string;
  diagnosis_id: string;
  anomaly_classification: string;
  priority: string;
  execution_timestamp: string;
  sent_at: string;
}

interface AuditLogRecord {
  log_id: string;
  diagnosis_id: string;
  action: string;
  status: "SUCCESS" | "IDEMPOTENT" | "ERROR";
  execution_sequence: number;
  recorded_at: string;
}

interface Tx3Imp1AiClient {
  executeDiagnosis(params: {
    diagnosis_id: string;
    trigger_type: string;
  }): Promise<{
    health_check: HealthCheckResult;
    data_quality: DataQualityResult;
    inference_accuracy: InferenceAccuracyResult;
  }>;
}

// Mock Database
class MockDatabase {
  private diagnosis_records: Map<string, DiagnosisRecord> = new Map();
  private notification_records: Array<NotificationRecord> = [];
  private audit_logs: Array<AuditLogRecord> = [];
  private next_execution_sequence: Map<string, number> = new Map();

  saveDiagnosisRecord(record: DiagnosisRecord): void {
    if (this.diagnosis_records.has(record.diagnosis_id)) {
      const existing = this.diagnosis_records.get(record.diagnosis_id)!;
      record.idempotent_flag = "DUPLICATE";
      record.updated_at = new Date("2024-01-15T11:10:00Z").toISOString();
      this.diagnosis_records.set(record.diagnosis_id, record);
    } else {
      record.idempotent_flag = "ORIGINAL";
      this.diagnosis_records.set(record.diagnosis_id, record);
    }
  }

  getDiagnosisRecord(diagnosis_id: string): DiagnosisRecord | undefined {
    return this.diagnosis_records.get(diagnosis_id);
  }

  getDiagnosisRecordCount(): number {
    return this.diagnosis_records.size;
  }

  saveNotification(record: NotificationRecord): void {
    this.notification_records.push(record);
  }

  getNotificationCount(): number {
    return this.notification_records.length;
  }

  getNotificationsByDiagnosisId(
    diagnosis_id: string
  ): Array<NotificationRecord> {
    return this.notification_records.filter(
      (n) => n.diagnosis_id === diagnosis_id
    );
  }

  saveAuditLog(record: AuditLogRecord): void {
    this.audit_logs.push(record);
  }

  getAuditLogsByDiagnosisId(
    diagnosis_id: string
  ): Array<AuditLogRecord> {
    return this.audit_logs.filter((log) => log.diagnosis_id === diagnosis_id);
  }

  getAuditLogCount(): number {
    return this.audit_logs.length;
  }

  getAllAuditLogs(): Array<AuditLogRecord> {
    return this.audit_logs;
  }

  getNextExecutionSequence(diagnosis_id: string): number {
    const current = this.next_execution_sequence.get(diagnosis_id) || 0;
    const next = current + 1;
    this.next_execution_sequence.set(diagnosis_id, next);
    return next;
  }

  reset(): void {
    this.diagnosis_records.clear();
    this.notification_records = [];
    this.audit_logs = [];
    this.next_execution_sequence.clear();
  }
}

// Mock API Clients
class MockHealthCheckApi {
  async execute(): Promise<HealthCheckResult> {
    return {
      status: "healthy",
      timestamp: "2024-01-15T11:00:00Z",
      component_status: {
        database: "online",
        api_gateway: "online",
        ai_service: "online",
      },
    };
  }
}

class MockDataQualityApi {
  async execute(): Promise<DataQualityResult> {
    return {
      quality_score: 92,
      timestamp: "2024-01-15T11:01:00Z",
      issues: [
        { category: "missing_values", count: 5 },
        { category: "duplicate_records", count: 2 },
      ],
    };
  }
}

class MockInferenceAccuracyApi {
  async execute(): Promise<InferenceAccuracyResult> {
    return {
      accuracy_score: 96,
      timestamp: "2024-01-15T11:02:00Z",
      inference_count: 1250,
    };
  }
}

// Mock Notification System
class MockNotificationSystem {
  private sent_notifications: Array<{
    diagnosis_id: string;
    anomaly_classification: string;
    priority: string;
    execution_timestamp: string;
  }> = [];

  async sendNotification(
    diagnosis_id: string,
    anomaly_classification: string,
    priority: string,
    execution_timestamp: string
  ): Promise<void> {
    this.sent_notifications.push({
      diagnosis_id,
      anomaly_classification,
      priority,
      execution_timestamp,
    });
  }

  getSentNotifications(): Array<{
    diagnosis_id: string;
    anomaly_classification: string;
    priority: string;
    execution_timestamp: string;
  }> {
    return this.sent_notifications;
  }

  reset(): void {
    this.sent_notifications = [];
  }
}

// Mock AI Client
class MockTx3Imp1AiClient implements Tx3Imp1AiClient {
  async executeDiagnosis(params: {
    diagnosis_id: string;
    trigger_type: string;
  }): Promise<{
    health_check: HealthCheckResult;
    data_quality: DataQualityResult;
    inference_accuracy: InferenceAccuracyResult;
  }> {
    const health_check: HealthCheckResult = {
      status: "healthy",
      timestamp: "2024-01-15T11:00:00Z",
      component_status: {
        database: "online",
        api_gateway: "online",
        ai_service: "online",
      },
    };

    const data_quality: DataQualityResult = {
      quality_score: 92,
      timestamp: "2024-01-15T11:01:00Z",
      issues: [
        { category: "missing_values", count: 5 },
        { category: "duplicate_records", count: 2 },
      ],
    };

    const inference_accuracy: InferenceAccuracyResult = {
      accuracy_score: 96,
      timestamp: "2024-01-15T11:02:00Z",
      inference_count: 1250,
    };

    return {
      health_check,
      data_quality,
      inference_accuracy,
    };
  }
}

// Main Agent Function
async function runTx3Imp1Agent(
  diagnosis_trigger_id: string,
  ai_client: Tx3Imp1AiClient,
  db: MockDatabase,
  notification_system: MockNotificationSystem
): Promise<DiagnosisRecord> {
  const diagnosis_id = diagnosis_trigger_id;

  // Check if diagnosis already exists (idempotency check)
  const existing_diagnosis = db.getDiagnosisRecord(diagnosis_id);

  let execution_status: "SUCCESS" | "IDEMPOTENT";
  let execution_sequence: number;

  execution_sequence = db.getNextExecutionSequence(diagnosis_id);

  if (existing_diagnosis && existing_diagnosis.idempotent_flag === "ORIGINAL") {
    // Second and subsequent executions: skip diagnosis execution and skip notification
    execution_status = "IDEMPOTENT";

    const audit_log: AuditLogRecord = {
      log_id: `LOG-${diagnosis_id}-${execution_sequence}`,
      diagnosis_id,
      action: "DIAGNOSIS_RETRY_SKIPPED",
      status: "IDEMPOTENT",
      execution_sequence,
      recorded_at: new Date("2024-01-15T11:10:00Z").toISOString(),
    };
    db.saveAuditLog(audit_log);

    return existing_diagnosis;
  }

  // First execution: execute diagnosis steps
  execution_status = "SUCCESS";

  // Step 1: System Health Check
  const health_check_result = await ai_client.executeDiagnosis({
    diagnosis_id,
    trigger_type: "periodic",
  });

  // Step 2: Data Quality Analysis
  const data_quality_result = health_check_result.data_quality;

  // Step 3: Inference Accuracy Evaluation
  const inference_accuracy_result = health_check_result.inference_accuracy;

  // Step 4: Results Integration and Aggregation
  const aggregated_anomalies = [
    {
      category: "data_quality",
      severity: "medium" as const,
      priority: 2,
    },
    {
      category: "inference_degradation",
      severity: "low" as const,
      priority: 3,
    },
  ];

  let priority_level: "low" | "medium" | "high";
  if (aggregated_anomalies.some((a) => a.severity === "high")) {
    priority_level = "high";
  } else if (aggregated_anomalies.some((a) => a.severity === "medium")) {
    priority_level = "medium";
  } else {
    priority_level = "low";
  }

  // Step 5: Priority Determination
  // Step 6: Report Generation
  const diagnosis_record: DiagnosisRecord = {
    diagnosis_id,
    health_check_result: health_check_result.health_check,
    data_quality_result,
    inference_accuracy_result,
    aggregated_anomalies,
    priority_level,
    report_generated_at: new Date("2024-01-15T11:03:00Z").toISOString(),
    idempotent_flag: "ORIGINAL",
    created_at: new Date("2024-01-15T11:00:00Z").toISOString(),
    updated_at: new Date("2024-01-15T11:00:00Z").toISOString(),
  };

  // Save diagnosis record
  db.saveDiagnosisRecord(diagnosis_record);

  // Send notification (only on first execution)
  const anomaly_classification = aggregated_anomalies
    .map((a) => a.category)
    .join(",");
  const notification_record: NotificationRecord = {
    notification_id: `NOTIF-${diagnosis_id}-001`,
    diagnosis_id,
    anomaly_classification,
    priority: priority_level,
    execution_timestamp: new Date("2024-01-15T11:03:00Z").toISOString(),
    sent_at: new Date("2024-01-15T11:03:30Z").toISOString(),
  };
  db.saveNotification(notification_record);
  await notification_system.sendNotification(
    diagnosis_id,
    anomaly_classification,
    priority_level,
    new Date("2024-01-15T11:03:00Z").toISOString()
  );

  // Save audit log for first execution
  const audit_log: AuditLogRecord = {
    log_id: `LOG-${diagnosis_id}-${execution_sequence}`,
    diagnosis_id,
    action: "DIAGNOSIS_EXECUTED",
    status: "SUCCESS",
    execution_sequence,
    recorded_at: new Date("2024-01-15T11:03:00Z").toISOString(),
  };
  db.saveAuditLog(audit_log);

  return diagnosis_record;
}

describe("営業プロセス実行状況の監査ダッシュボード - ヘルスチェック統合診断のべき等性", () => {
  // SCEN-1272
  it("should prevent duplicate writes, notifications, and audit logs when re-executing with the same diagnosis trigger ID", async () => {
    const diagnosis_trigger_id = "DIAG-20240115-001";
    const mock_db = new MockDatabase();
    const mock_notification_system = new MockNotificationSystem();
    const mock_ai_client = new MockTx3Imp1AiClient();

    // First execution
    const first_result = await runTx3Imp1Agent(
      diagnosis_trigger_id,
      mock_ai_client,
      mock_db,
      mock_notification_system
    );

    // Verify first execution results
    expect(first_result.diagnosis_id).toBe("DIAG-20240115-001");
    expect(first_result.idempotent_flag).toBe("ORIGINAL");
    expect(first_result.health_check_result.status).toBe("healthy");
    expect(first_result.data_quality_result.quality_score).toBe(92);
    expect(first_result.inference_accuracy_result.accuracy_score).toBe(96);
    expect(first_result.priority_level).toBe("medium");
    expect(first_result.aggregated_anomalies.length).toBe(2);

    // Verify first execution database state
    expect(mock_db.getDiagnosisRecordCount()).toBe(1);
    const first_diagnosis = mock_db.getDiagnosisRecord("DIAG-20240115-001");
    expect(first_diagnosis).toBeDefined();
    expect(first_diagnosis!.idempotent_flag).toBe("ORIGINAL");

    // Verify first execution notification
    expect(mock_db.getNotificationCount()).toBe(1);
    const first_notifications = mock_db.getNotificationsByDiagnosisId(
      diagnosis_trigger_id
    );
    expect(first_notifications.length).toBe(1);
    expect(first_notifications[0].priority).toBe("medium");
    expect(first_notifications[0].anomaly_classification).toMatch(
      /data_quality/
    );
    expect(first_notifications[0].diagnosis_id).toBe("DIAG-20240115-001");

    // Verify first execution audit log
    const first_audit_logs = mock_db.getAuditLogsByDiagnosisId(
      diagnosis_trigger_id
    );
    expect(first_audit_logs.length).toBe(1);
    expect(first_audit_logs[0].action).toBe("DIAGNOSIS_EXECUTED");
    expect(first_audit_logs[0].status).toBe("SUCCESS");
    expect(first_audit_logs[0].execution_sequence).toBe(1);

    // Second execution (immediate retry)
    const second_result = await runTx3Imp1Agent(
      diagnosis_trigger_id,
      mock_ai_client,
      mock_db,
      mock_notification_system
    );

    // Verify second execution returns existing record
    expect(second_result.diagnosis_id).toBe("DIAG-20240115-001");

    // Verify no duplicate database records created
    expect(mock_db.getDiagnosisRecordCount()).toBe(1);
    const second_diagnosis = mock_db.getDiagnosisRecord("DIAG-20240115-001");
    expect(second_diagnosis).toBeDefined();

    // Verify no duplicate notifications sent
    expect(mock_db.getNotificationCount()).toBe(1);
    const second_notifications = mock_db.getNotificationsByDiagnosisId(
      diagnosis_trigger_id
    );
    expect(second_notifications.length).toBe(1);

    // Verify second execution audit log records idempotent status
    const second_audit_logs = mock_db.getAuditLogsByDiagnosisId(
      diagnosis_trigger_id
    );
    expect(second_audit_logs.length).toBe(2);
    expect(second_audit_logs[1].action).toBe("DIAGNOSIS_RETRY_SKIPPED");
    expect(second_audit_logs[1].status).toBe("IDEMPOTENT");
    expect(second_audit_logs[1].execution_sequence).toBe(2);

    // Third through fifth executions
    for (let i = 3; i <= 5; i++) {
      const retry_result = await runTx3Imp1Agent(
        diagnosis_trigger_id,
        mock_ai_client,
        mock_db,
        mock_notification_system
      );

      // Verify no additional database records
      expect(mock_db.getDiagnosisRecordCount()).toBe(1);

      // Verify no additional notifications
      expect(mock_db.getNotificationCount()).toBe(1);

      // Verify audit log entry for each execution
      const all_audit_logs = mock_db.getAuditLogsByDiagnosisId(
        diagnosis_trigger_id
      );
      expect(all_audit_logs.length).toBe(i);
      expect(all_audit_logs[i - 1].action).toBe("DIAGNOSIS_RETRY_SKIPPED");
      expect(all_audit_logs[i - 1].status).toBe("IDEMPOTENT");
      expect(all_audit_logs[i - 1].execution_sequence).toBe(i);
    }

    // Final verification after 5 total executions
    expect(mock_db.getDiagnosisRecordCount()).toBe(1);
    expect(mock_db.getNotificationCount()).toBe(1);

    const final_audit_logs = mock_db.getAuditLogsByDiagnosisId(
      diagnosis_trigger_id
    );
    expect(final_audit_logs.length).toBe(5);

    // Verify first log is SUCCESS, rest are IDEMPOTENT
    expect(final_audit_logs[0].action).toBe("DIAGNOSIS_EXECUTED");
    expect(final_audit_logs[0].status).toBe("SUCCESS");
    for (let i = 1; i < 5; i++) {
      expect(final_audit_logs[i].action).toBe("DIAGNOSIS_RETRY_SKIPPED");
      expect(final_audit_logs[i].status).toBe("IDEMPOTENT");
      expect(final_audit_logs[i].execution_sequence).toBe(i + 1);
    }

    // Verify all audit logs reference same diagnosis_id
    for (const log of final_audit_logs) {
      expect(log.diagnosis_id).toBe("DIAG-20240115-001");
    }

    // Verify final diagnosis record state
    const final_diagnosis = mock_db.getDiagnosisRecord("DIAG-20240115-001");
    expect(final_diagnosis!.idempotent_flag).toBe("ORIGINAL");
    expect(final_diagnosis!.priority_level).toBe("medium");
    expect(final_diagnosis!.aggregated_anomalies).toHaveLength(2);
  });
});