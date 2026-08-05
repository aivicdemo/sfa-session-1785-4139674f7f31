import { runTx11Imp1Agent } from "../../src/logic/it-1";

// Mock types and interfaces
interface AuditEvent {
  event_type: string;
  agent_id?: string;
  timestamp: string;
  status?: string;
  extracted_records_count?: number;
  analyzed_records?: number;
  confidence_scores?: Record<string, number>;
  matched_patterns?: number;
  new_patterns?: number;
  registered_records?: number;
  presented_patterns?: number;
  target_users_count?: number;
  final_status?: string;
  total_processed_records?: number;
}

interface SalesCase {
  case_id: string;
  case_type: "success" | "failure";
  salesperson_id: string;
  customer_id: string;
  product_id: string;
  amount: number;
  description: string;
  created_at: string;
}

interface AuditEventRepository {
  recordEvent(event: AuditEvent): Promise<void>;
  getEventsByAgent(agentId: string): Promise<AuditEvent[]>;
}

interface SalesSystemStub {
  extractCases(startDate: string, endDate: string): Promise<SalesCase[]>;
}

// Global test fixtures
let audit_event_repository: AuditEventRepository;
let sales_system_stub: SalesSystemStub;
let recorded_events: AuditEvent[];

beforeEach(() => {
  recorded_events = [];

  audit_event_repository = {
    recordEvent: async (event: AuditEvent) => {
      recorded_events.push(event);
    },
    getEventsByAgent: async (agentId: string) => {
      return recorded_events.filter((e) => e.agent_id === agentId);
    },
  };

  sales_system_stub = {
    extractCases: async (startDate: string, endDate: string) => {
      return [
        {
          case_id: "case_001",
          case_type: "success",
          salesperson_id: "sales_001",
          customer_id: "cust_001",
          product_id: "prod_001",
          amount: 500000,
          description:
            "顧客が経営課題を持つ中堅企業。初回接触から2週間で提案実施、商品説明を丁寧に行い、顧客の要件に100%適合することを確認。その後、1週間以内に成約。初回接触時の顧客ニーズ確認と、提案内容の正確性が成功要因。",
          created_at: "2024-01-10T09:00:00Z",
        },
        {
          case_id: "case_002",
          case_type: "failure",
          salesperson_id: "sales_002",
          customer_id: "cust_002",
          product_id: "prod_002",
          amount: 300000,
          description:
            "顧客からの問い合わせあり。初回接触は実施したが、提案まで3週間かかった。その間、顧客からのフォローアップ対応が不十分で、最終的に競合他社に選定されてしまった。失注要因は、顧客ニーズの把握不足と、フォローアップ頻度の低さが原因と判定。",
          created_at: "2024-01-15T14:30:00Z",
        },
      ];
    },
  };
});

describe("営業事例の収集・分類・言語化の自動化と例外時のみ人による確認", () => {
  // SCEN-1306
  test("[normal] AIエージェント開始から完了まで全プロセスが監査記録に時系列順に記録される", async () => {
    const agent_id = "tx_11_imp_1";
    const execution_start_time = "2024-02-01T10:00:00Z";
    const execution_end_time = "2024-02-01T10:05:00Z";

    // Execute AIエージェント
    await runTx11Imp1Agent(
      {
        agent_id,
        audit_event_repository,
        sales_system_stub,
        execution_timestamp: execution_start_time,
      },
      execution_end_time
    );

    // Retrieve all audit events
    const audit_events = await audit_event_repository.getEventsByAgent(
      agent_id
    );

    // Assert: Total event count should be 8
    expect(audit_events.length).toBe(8);

    // Assert: Event 1 - AGENT_START
    expect(audit_events[0].event_type).toBe("AGENT_START");
    expect(audit_events[0].agent_id).toBe("tx_11_imp_1");
    expect(audit_events[0].timestamp).toBe("2024-02-01T10:00:00Z");
    expect(audit_events[0].status).toBe("INITIATED");

    // Assert: Event 2 - DATA_EXTRACTION
    expect(audit_events[1].event_type).toBe("DATA_EXTRACTION");
    expect(audit_events[1].extracted_records_count).toBe(2);
    expect(audit_events[1].status).toBe("COMPLETED");

    // Assert: Event 3 - CLASSIFICATION_ANALYSIS
    expect(audit_events[2].event_type).toBe("CLASSIFICATION_ANALYSIS");
    expect(audit_events[2].analyzed_records).toBe(2);
    expect(audit_events[2].confidence_scores).toBeDefined();
    expect(typeof audit_events[2].confidence_scores).toBe("object");
    expect(Object.keys(audit_events[2].confidence_scores!).length).toBeGreaterThanOrEqual(
      1
    );

    // Assert: Event 4 - PATTERN_MATCHING
    expect(audit_events[3].event_type).toBe("PATTERN_MATCHING");
    expect(audit_events[3].matched_patterns).toBe(1);
    expect(audit_events[3].new_patterns).toBe(0);

    // Assert: Event 5 - KNOWLEDGE_BASE_REGISTRATION
    expect(audit_events[4].event_type).toBe(
      "KNOWLEDGE_BASE_REGISTRATION"
    );
    expect(audit_events[4].registered_records).toBe(2);
    expect(audit_events[4].status).toBe("COMPLETED");

    // Assert: Event 6 - RECOMMENDATION_PRESENTATION
    expect(audit_events[5].event_type).toBe("RECOMMENDATION_PRESENTATION");
    expect(audit_events[5].presented_patterns).toBe(1);
    expect(audit_events[5].target_users_count).toBeGreaterThanOrEqual(1);

    // Assert: Event 7 - AGENT_COMPLETION
    expect(audit_events[6].event_type).toBe("AGENT_COMPLETION");
    expect(audit_events[6].agent_id).toBe("tx_11_imp_1");
    expect(audit_events[6].final_status).toBe("SUCCESS");
    expect(audit_events[6].total_processed_records).toBe(2);
    expect(audit_events[6].timestamp).toBe("2024-02-01T10:05:00Z");

    // Assert: Chronological order verification
    const event_timestamps = audit_events.map((e) => new Date(e.timestamp).getTime());
    for (let i = 1; i < event_timestamps.length; i++) {
      expect(event_timestamps[i]).toBeGreaterThanOrEqual(event_timestamps[i - 1]);
    }
  });
});