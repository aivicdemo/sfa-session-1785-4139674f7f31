import { runTx12Imp1Agent } from "../../src/logic/it-1";

const fetchMock = require("jest-fetch-mock");

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  test("SCEN-1320: AIエージェント - 不正・曖昧・低確信度のAI出力を拒否して安全に引き継ぐ", async () => {
    fetchMock.resetMocks();

    interface EscalationRecord {
      timestamp: string;
      triggerId: string;
      problem_classification: string;
      rejected_ai_output: {
        received_value: unknown;
        expected_value: string;
      };
      escalation_target_role: string;
    }

    interface MonthlyExecutionHistory {
      id: string;
      trigger_id: string;
      status: string;
      escalation_record_id: string | null;
    }

    interface NotificationMessage {
      content: string;
      includes_execution_stopped: boolean;
      includes_quality_output_details: boolean;
      includes_manual_confirmation_required: boolean;
      includes_escalation_record_id: boolean;
    }

    interface MockAiClient {
      analyzeDataQuality: jest.Mock;
      analyzeActionPatterns: jest.Mock;
      analyzeProcessDeviation: jest.Mock;
      analyzeCorrelation: jest.Mock;
    }

    const mockAiClient: MockAiClient = {
      analyzeDataQuality: jest.fn(),
      analyzeActionPatterns: jest.fn(),
      analyzeProcessDeviation: jest.fn(),
      analyzeCorrelation: jest.fn(),
    };

    const triggerId = "monthly_meeting_20240115_exec_001";
    const escalationRecordId = "esc_rec_20240115_001";
    const currentDate = new Date("2024-01-15T10:00:00Z");

    const testScenarios = [
      {
        name: "品質スコア値が数値でなく文字列を返す",
        mockResponse: {
          quality_score: "unknown",
          quality_judgment: "good",
          confidence_score: 0.85,
          missing_field_count: 0,
        },
        problem_classification: "malformed",
        expected_received_value: "unknown",
        expected_expected_value: "number between 0 and 100",
      },
      {
        name: "品質判定結果が許容値外の不正値を返す",
        mockResponse: {
          quality_score: 92.5,
          quality_judgment: "invalid",
          confidence_score: 0.80,
          missing_field_count: 0,
        },
        problem_classification: "malformed",
        expected_received_value: "invalid",
        expected_expected_value: "good|bad|unclear",
      },
      {
        name: "信度スコアがnullを返す",
        mockResponse: {
          quality_score: 88.0,
          quality_judgment: "good",
          confidence_score: null,
          missing_field_count: 0,
        },
        problem_classification: "low_confidence",
        expected_received_value: null,
        expected_expected_value: "number between 0 and 1",
      },
      {
        name: "必須フィールド（検出された欠損値数）が欠落している",
        mockResponse: {
          quality_score: 85.0,
          quality_judgment: "good",
          confidence_score: 0.75,
        },
        problem_classification: "malformed",
        expected_received_value: "missing",
        expected_expected_value: "number",
      },
    ];

    for (const scenario of testScenarios) {
      fetchMock.resetMocks();

      mockAiClient.analyzeDataQuality.mockResolvedValueOnce(scenario.mockResponse);

      const escalationRecords: EscalationRecord[] = [];
      const monthlyExecutionHistories: MonthlyExecutionHistory[] = [];
      const notificationMessages: NotificationMessage[] = [];

      const mockDb = {
        saveEscalationRecord: (record: EscalationRecord) => {
          escalationRecords.push(record);
          return escalationRecordId;
        },
        updateMonthlyExecutionHistory: (history: MonthlyExecutionHistory) => {
          monthlyExecutionHistories.push(history);
        },
        saveNotificationMessage: (message: NotificationMessage) => {
          notificationMessages.push(message);
        },
      };

      let escalationThrown = false;
      let escalationStatus = "";
      let actualEscalationRecordId = "";

      try {
        await runTx12Imp1Agent(
          {
            trigger_id: triggerId,
            trigger_timestamp: currentDate.toISOString(),
            trigger_type: "monthly_meeting",
            target_period_start: "2024-01-01",
            target_period_end: "2024-01-31",
          },
          mockAiClient,
          mockDb
        );
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          "escalation_classification" in error &&
          (error as Record<string, unknown>).escalation_classification ===
            "data_quality_check_failed"
        ) {
          escalationThrown = true;
        }
      }

      if (escalationRecords.length > 0) {
        const savedRecord = escalationRecords[0];

        expect(savedRecord.timestamp).toBeTruthy();
        expect(savedRecord.triggerId).toBe(triggerId);
        expect(savedRecord.problem_classification).toBe(
          scenario.problem_classification
        );
        expect(savedRecord.rejected_ai_output.received_value).toEqual(
          scenario.mockResponse[
            Object.keys(scenario.mockResponse).find(
              (key) =>
                scenario.mockResponse[key as keyof typeof scenario.mockResponse] ===
                (scenario.expected_received_value === "missing"
                  ? undefined
                  : scenario.expected_received_value)
            ) as string
          ] || (scenario.expected_received_value === "missing" ? undefined : scenario.expected_received_value)
        );
        expect(savedRecord.escalation_target_role).toBe("営業管理者");
      }

      if (monthlyExecutionHistories.length > 0) {
        const executionHistory = monthlyExecutionHistories[0];
        expect(executionHistory.trigger_id).toBe(triggerId);
        expect(executionHistory.status).toBe("ESCALATED");
        expect(executionHistory.escalation_record_id).toBeTruthy();
        escalationStatus = executionHistory.status;
        actualEscalationRecordId =
          executionHistory.escalation_record_id || escalationRecordId;
      }

      if (notificationMessages.length > 0) {
        const notification = notificationMessages[0];
        expect(notification.includes_execution_stopped).toBe(true);
        expect(notification.includes_quality_output_details).toBe(true);
        expect(notification.includes_manual_confirmation_required).toBe(true);
        expect(notification.includes_escalation_record_id).toBe(true);
        expect(notification.content).toContain("営業データ品質チェック");
        expect(notification.content).toContain(
          scenario.problem_classification
        );
      }

      expect(escalationThrown || escalationStatus === "ESCALATED").toBe(true);
      expect(mockAiClient.analyzeActionPatterns.mock.calls.length).toBe(0);
      expect(mockAiClient.analyzeProcessDeviation.mock.calls.length).toBe(0);
      expect(mockAiClient.analyzeCorrelation.mock.calls.length).toBe(0);
    }
  });
});