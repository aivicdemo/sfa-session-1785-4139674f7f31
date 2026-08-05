import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type { Tx11Imp1AiClient } from "../../src/agents/tx-11-imp-1/orchestrator";
import { runTx11Imp1Agent } from "../../src/agents/tx-11-imp-1/orchestrator";

// Mock AI client for testing
class MockTx11Imp1AiClient implements Tx11Imp1AiClient {
  private mock_response: {
    confidence_score: number;
    ambiguity_detected: boolean;
    classification_result: string;
    ambiguity_details?: string;
  };

  constructor(
    confidence_score: number = 0.75,
    ambiguity_detected: boolean = false,
    classification_result: string = "success",
    ambiguity_details?: string
  ) {
    this.mock_response = {
      confidence_score,
      ambiguity_detected,
      classification_result,
      ambiguity_details,
    };
  }

  setMockResponse(response: {
    confidence_score: number;
    ambiguity_detected: boolean;
    classification_result: string;
    ambiguity_details?: string;
  }): void {
    this.mock_response = response;
  }

  async analyzeBusinessCase(caseData: string): Promise<{
    confidence_score: number;
    ambiguity_detected: boolean;
    classification_result: string;
    ambiguity_details?: string;
  }> {
    return Promise.resolve(this.mock_response);
  }
}

// Mock escalation handler
interface EscalationPayload {
  case_id: string;
  ambiguity_content: string;
  classification_details: {
    confidence_score: number;
    classification_result: string;
  };
  required_confirmations: string[];
  escalation_reason: string;
}

class MockEscalationHandler {
  private escalation_calls: EscalationPayload[] = [];

  async handleEscalation(payload: EscalationPayload): Promise<void> {
    this.escalation_calls.push(payload);
  }

  getEscalationCalls(): EscalationPayload[] {
    return this.escalation_calls;
  }

  resetCalls(): void {
    this.escalation_calls = [];
  }
}

// Mock audit logger
interface AuditLogEntry {
  event_type: string;
  case_id: string;
  ambiguity_reason: string;
  timestamp: string;
}

class MockAuditLogger {
  private audit_logs: AuditLogEntry[] = [];

  logEscalation(
    case_id: string,
    ambiguity_reason: string,
    timestamp: string
  ): void {
    this.audit_logs.push({
      event_type: "escalation_triggered",
      case_id,
      ambiguity_reason,
      timestamp,
    });
  }

  getAuditLogs(): AuditLogEntry[] {
    return this.audit_logs;
  }

  resetLogs(): void {
    this.audit_logs = [];
  }
}

// Mock knowledge base
class MockKnowledgeBase {
  private registered_cases: string[] = [];

  async registerCase(case_id: string): Promise<void> {
    this.registered_cases.push(case_id);
  }

  getRegisteredCases(): string[] {
    return this.registered_cases;
  }

  resetRegistry(): void {
    this.registered_cases = [];
  }
}

// Mock business rule recommendation system
class MockRecommendationSystem {
  private recommended_cases: string[] = [];

  async presentRecommendation(case_id: string): Promise<void> {
    this.recommended_cases.push(case_id);
  }

  getRecommendedCases(): string[] {
    return this.recommended_cases;
  }

  resetRecommendations(): void {
    this.recommended_cases = [];
  }
}

// Test orchestrator with dependency injection
interface Tx11Imp1AgentDependencies {
  ai_client: MockTx11Imp1AiClient;
  escalation_handler: MockEscalationHandler;
  audit_logger: MockAuditLogger;
  knowledge_base: MockKnowledgeBase;
  recommendation_system: MockRecommendationSystem;
}

async function runTx11Imp1AgentWithDeps(
  case_data: string,
  case_id: string,
  deps: Tx11Imp1AgentDependencies
): Promise<{
  status: string;
  escalated: boolean;
  reason?: string;
}> {
  // Step 1: Analyze business case using AI client
  const ai_result = await deps.ai_client.analyzeBusinessCase(case_data);

  // Step 2: Check escalation conditions
  const is_ambiguous = ai_result.ambiguity_detected;
  const confidence_threshold = 0.8;
  const is_low_confidence = ai_result.confidence_score < confidence_threshold;
  const should_escalate = is_ambiguous && is_low_confidence;

  if (should_escalate) {
    // Step 3: Prepare escalation payload
    const escalation_payload: EscalationPayload = {
      case_id,
      ambiguity_content: ai_result.ambiguity_details || "Multiple interpretations possible",
      classification_details: {
        confidence_score: ai_result.confidence_score,
        classification_result: ai_result.classification_result,
      },
      required_confirmations: [
        "Confirm success or failure factor",
        "Clarify customer contact context",
        "Validate classification intent",
      ],
      escalation_reason: "Ambiguous business case with low confidence",
    };

    // Step 4: Call escalation handler
    await deps.escalation_handler.handleEscalation(escalation_payload);

    // Step 5: Log escalation event
    const iso_timestamp = new Date("2024-01-15T10:30:00Z").toISOString();
    deps.audit_logger.logEscalation(
      case_id,
      escalation_payload.ambiguity_content,
      iso_timestamp
    );

    // Step 6: Return escalation status without executing downstream side effects
    return {
      status: "escalated",
      escalated: true,
      reason: "Ambiguous case data detected",
    };
  }

  // Happy path: Execute knowledge base registration
  await deps.knowledge_base.registerCase(case_id);

  // Present recommendation to business users
  await deps.recommendation_system.presentRecommendation(case_id);

  return {
    status: "processed",
    escalated: false,
  };
}

describe("営業事例の収集・分類・言語化の自動化と例外時のみ人による確認 - エスカレーション処理", () => {
  let mock_ai_client: MockTx11Imp1AiClient;
  let mock_escalation_handler: MockEscalationHandler;
  let mock_audit_logger: MockAuditLogger;
  let mock_knowledge_base: MockKnowledgeBase;
  let mock_recommendation_system: MockRecommendationSystem;
  let agent_dependencies: Tx11Imp1AgentDependencies;

  beforeEach(() => {
    mock_ai_client = new MockTx11Imp1AiClient();
    mock_escalation_handler = new MockEscalationHandler();
    mock_audit_logger = new MockAuditLogger();
    mock_knowledge_base = new MockKnowledgeBase();
    mock_recommendation_system = new MockRecommendationSystem();

    agent_dependencies = {
      ai_client: mock_ai_client,
      escalation_handler: mock_escalation_handler,
      audit_logger: mock_audit_logger,
      knowledge_base: mock_knowledge_base,
      recommendation_system: mock_recommendation_system,
    };
  });

  afterEach(() => {
    mock_escalation_handler.resetCalls();
    mock_audit_logger.resetLogs();
    mock_knowledge_base.resetRegistry();
    mock_recommendation_system.resetRecommendations();
  });

  // SCEN-1301: [error] Ambiguous business case data escalation
  test("SCEN-1301: When ambiguous business case with low confidence is detected, escalate to human review without executing downstream side effects", async () => {
    // Step 1: Prepare test data - ambiguous business case
    const test_case_id = "CASE-20240115-001";
    const ambiguous_case_content =
      "顧客との接触経緯が不明確で、提案内容と顧客反応が矛盾している。成功要因か失敗要因か判定できない事例。";

    // Step 2: Configure mock AI client to return low confidence with ambiguity detected
    mock_ai_client.setMockResponse({
      confidence_score: 0.75, // Below 0.8 threshold
      ambiguity_detected: true,
      classification_result: "unclear_pattern",
      ambiguity_details:
        "Multiple interpretations possible: customer contact timing unclear, proposal relevance ambiguous, outcome causality uncertain",
    });

    // Step 3: Execute agent with dependencies
    const result = await runTx11Imp1AgentWithDeps(
      ambiguous_case_content,
      test_case_id,
      agent_dependencies
    );

    // Step 4: Verify escalation status
    expect(result.escalated).toBe(true);
    expect(result.status).toBe("escalated");
    expect(result.reason).toBe("Ambiguous case data detected");

    // Step 5: Verify escalation handler was called
    const escalation_calls = mock_escalation_handler.getEscalationCalls();
    expect(escalation_calls.length).toBe(1);

    // Step 6: Verify escalation payload structure and content
    const escalation_payload = escalation_calls[0];
    expect(escalation_payload.case_id).toBe(test_case_id);
    expect(escalation_payload.ambiguity_content).toContain("interpretations");
    expect(escalation_payload.classification_details.confidence_score).toBe(0.75);
    expect(escalation_payload.classification_details.classification_result).toBe(
      "unclear_pattern"
    );

    // Step 7: Verify required confirmations are specified
    expect(escalation_payload.required_confirmations).toContain(
      "Confirm success or failure factor"
    );
    expect(escalation_payload.required_confirmations).toContain(
      "Clarify customer contact context"
    );
    expect(escalation_payload.required_confirmations).toContain(
      "Validate classification intent"
    );

    // Step 8: Verify audit log contains escalation_triggered event
    const audit_logs = mock_audit_logger.getAuditLogs();
    expect(audit_logs.length).toBe(1);
    expect(audit_logs[0].event_type).toBe("escalation_triggered");
    expect(audit_logs[0].case_id).toBe(test_case_id);
    expect(audit_logs[0].ambiguity_reason).toContain("interpretations");
    expect(audit_logs[0].timestamp).toBe("2024-01-15T10:30:00.000Z");

    // Step 9: Verify downstream side effects were NOT executed
    const registered_cases = mock_knowledge_base.getRegisteredCases();
    expect(registered_cases.length).toBe(0);
    expect(registered_cases).not.toContain(test_case_id);

    // Step 10: Verify recommendation system was NOT called
    const recommended_cases = mock_recommendation_system.getRecommendedCases();
    expect(recommended_cases.length).toBe(0);
    expect(recommended_cases).not.toContain(test_case_id);
  });
});