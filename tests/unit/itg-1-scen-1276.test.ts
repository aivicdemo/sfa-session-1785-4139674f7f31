import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { runTx10Imp1Agent } from "../../src/agents/tx-10-imp-1/orchestrator";

interface Tx10Imp1AiClient {
  validateRequiredFields(payload: {
    inputData: SalesDataInput;
    promptId: string;
  }): Promise<{
    isComplete: boolean;
    missingFields: string[];
    validationScore: number;
  }>;
}

interface SalesDataInput {
  customerId: string;
  customerName: string;
  proposalAmount: number;
  proposalContent: string;
  salesRepresentativeId: string;
  inputDateTime: string;
}

interface AuditLogEntry {
  actionName: string;
  status: string;
  timestamp: string;
  payload?: Record<string, unknown>;
}

class FakeTx10Imp1AiClient implements Tx10Imp1AiClient {
  private callHistory: Array<{
    method: string;
    payload: Record<string, unknown>;
    timestamp: string;
  }> = [];

  async validateRequiredFields(payload: {
    inputData: SalesDataInput;
    promptId: string;
  }): Promise<{
    isComplete: boolean;
    missingFields: string[];
    validationScore: number;
  }> {
    this.callHistory.push({
      method: "validateRequiredFields",
      payload: payload as unknown as Record<string, unknown>,
      timestamp: new Date().toISOString(),
    });

    return {
      isComplete: true,
      missingFields: [],
      validationScore: 1.0,
    };
  }

  getCallHistory(): Array<{
    method: string;
    payload: Record<string, unknown>;
    timestamp: string;
  }> {
    return this.callHistory;
  }

  resetCallHistory(): void {
    this.callHistory = [];
  }
}

class MockAuditLog {
  private entries: AuditLogEntry[] = [];

  recordAction(entry: AuditLogEntry): void {
    this.entries.push({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
    });
  }

  getEntries(): AuditLogEntry[] {
    return this.entries;
  }

  resetEntries(): void {
    this.entries = [];
  }
}

describe("営業データ入力から問題検出・通知までの自律実行 - AIエージェント", () => {
  // SCEN-1276: [normal] 営業データ入力から問題検出・通知までの自律実行 AIエージェント - 「営業データ入力から問題検出・通知までの自律実行」が自律処理「営業データ入力内容を受け取り、必須項目の完全性を検証する」を契約どおり実行する
  test("SCEN-1276: should execute autonomous action for required fields validation on sales data input", async () => {
    const fakeAiClient = new FakeTx10Imp1AiClient();
    const auditLog = new MockAuditLog();

    const salesDataInput: SalesDataInput = {
      customerId: "CUST-2024-001",
      customerName: "株式会社テストカンパニー",
      proposalAmount: 500000,
      proposalContent: "システム導入提案",
      salesRepresentativeId: "SR-2024-0001",
      inputDateTime: "2024-01-15T10:30:00Z",
    };

    const agentExecutionResult = await runTx10Imp1Agent({
      salesDataInput,
      aiClient: fakeAiClient,
      auditLog,
    });

    // (1) フェイクAIクライアントのメソッドが1回呼び出され、入力営業データとプロンプトIDが正確に渡される
    const callHistory = fakeAiClient.getCallHistory();
    expect(callHistory).toHaveLength(1);
    expect(callHistory[0].method).toBe("validateRequiredFields");
    expect(callHistory[0].payload.inputData).toEqual(salesDataInput);
    expect(callHistory[0].payload.promptId).toBe(
      "validate_required_fields_tx10_imp1"
    );

    // (2) 検証結果（必須項目の完全性スコア、不足項目リスト、完全性判定フラグ）が正常に取得される
    expect(agentExecutionResult.validationResult).toBeDefined();
    expect(agentExecutionResult.validationResult.isComplete).toBe(true);
    expect(agentExecutionResult.validationResult.missingFields).toEqual([]);
    expect(agentExecutionResult.validationResult.validationScore).toBe(1.0);

    // (3) 監査ログに『必須項目完全性検証 実行完了』というレコードがタイムスタンプ付きで記録される
    const auditEntries = auditLog.getEntries();
    const validationAuditEntry = auditEntries.find(
      (entry) => entry.actionName === "必須項目完全性検証"
    );
    expect(validationAuditEntry).toBeDefined();
    expect(validationAuditEntry?.status).toBe("実行完了");
    expect(validationAuditEntry?.timestamp).toBeTruthy();
    expect(validationAuditEntry?.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );

    // (4) エージェントの内部状態が次アクション実行可能な状態に遷移する
    expect(agentExecutionResult.state).toBe("READY_FOR_NEXT_ACTION");
    expect(agentExecutionResult.nextActionName).toBe("データ重複・矛盾チェック");
  });
});