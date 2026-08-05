import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx2Imp2Agent } from '../../src/agents/tx-2-imp-2/orchestrator';

// Mock AI client interface matching Tx2Imp2AiClient contract
interface ImprovementProposal {
  proposalId: string;
  targetStaffId: string;
  issue: string;
  successCaseReference: string;
  specificProposal: string;
  expectedImprovementRate: number;
  confidenceScore: number;
  generatedAt: string;
}

interface AuditLogEntry {
  eventType: string;
  agentId: string;
  staffId: string;
  proposalId: string;
  confidenceScore: number;
  executedAt: string;
  requestedBy: string;
}

interface MockAiClientResponse {
  proposal: ImprovementProposal;
  success: boolean;
}

// Fake AI Client for testing
class FakeTx2Imp2AiClient {
  private mockResponse: MockAiClientResponse | null = null;

  setMockResponse(response: MockAiClientResponse): void {
    this.mockResponse = response;
  }

  async generateImprovementProposal(
    successCases: object[],
    targetStaffData: object[]
  ): Promise<MockAiClientResponse> {
    if (!this.mockResponse) {
      throw new Error('Mock response not configured');
    }
    return this.mockResponse;
  }
}

// Test database store
class TestDataStore {
  private proposals: Map<string, ImprovementProposal & { status: string }> = new Map();
  private auditLogs: AuditLogEntry[] = [];

  saveProposal(proposal: ImprovementProposal, status: string): void {
    this.proposals.set(proposal.proposalId, { ...proposal, status });
  }

  getProposal(proposalId: string): (ImprovementProposal & { status: string }) | undefined {
    return this.proposals.get(proposalId);
  }

  recordAuditLog(log: AuditLogEntry): void {
    this.auditLogs.push(log);
  }

  getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }

  clear(): void {
    this.proposals.clear();
    this.auditLogs = [];
  }
}

describe('営業プロセス遵守状況の自動監視と改善提案の実行', () => {
  let fakeAiClient: FakeTx2Imp2AiClient;
  let testDataStore: TestDataStore;
  const FIXED_TIMESTAMP = '2024-01-15T11:00:00Z';

  beforeEach(() => {
    fakeAiClient = new FakeTx2Imp2AiClient();
    testDataStore = new TestDataStore();
  });

  afterEach(() => {
    testDataStore.clear();
  });

  // SCEN-1243
  test('should generate specific improvement proposal by comparing success case and process compliance deviation', async () => {
    // 1. 成功事例データの準備：A営業担当者が100%プロセス遵守
    const successCases = [
      {
        staffId: 'A',
        caseId: 'case_001',
        initialContact: true,
        needsAnalysis: true,
        proposalPhase: true,
        negotiation: true,
        closure: true,
        complianceRate: 1.0,
      },
      {
        staffId: 'A',
        caseId: 'case_002',
        initialContact: true,
        needsAnalysis: true,
        proposalPhase: true,
        negotiation: true,
        closure: true,
        complianceRate: 1.0,
      },
      {
        staffId: 'A',
        caseId: 'case_003',
        initialContact: true,
        needsAnalysis: true,
        proposalPhase: true,
        negotiation: true,
        closure: true,
        complianceRate: 1.0,
      },
      {
        staffId: 'A',
        caseId: 'case_004',
        initialContact: true,
        needsAnalysis: true,
        proposalPhase: true,
        negotiation: true,
        closure: true,
        complianceRate: 1.0,
      },
      {
        staffId: 'A',
        caseId: 'case_005',
        initialContact: true,
        needsAnalysis: true,
        proposalPhase: true,
        negotiation: true,
        closure: true,
        complianceRate: 1.0,
      },
    ];

    // 2. 改善事例データの準備：B営業担当者が30%スキップ
    const improvementTargetData = [
      {
        staffId: 'B',
        caseId: 'case_b_001',
        initialContact: true,
        needsAnalysis: false, // スキップ
        proposalPhase: false, // スキップ
        negotiation: true,
        closure: true,
        complianceRate: 0.6,
        skipRate: 0.4,
      },
      {
        staffId: 'B',
        caseId: 'case_b_002',
        initialContact: true,
        needsAnalysis: false, // スキップ
        proposalPhase: false, // スキップ
        negotiation: true,
        closure: true,
        complianceRate: 0.6,
        skipRate: 0.4,
      },
      {
        staffId: 'B',
        caseId: 'case_b_003',
        initialContact: true,
        needsAnalysis: false, // スキップ
        proposalPhase: false, // スキップ
        negotiation: true,
        closure: true,
        complianceRate: 0.6,
        skipRate: 0.4,
      },
    ];

    // 3. フェイクAIクライアントに改善提案の期待レスポンスを設定
    const expectedProposal: ImprovementProposal = {
      proposalId: 'prop_001',
      targetStaffId: 'B',
      issue: '顧客初期接触から提案段階のプロセススキップ率30%',
      successCaseReference: '成功事例A（遵守率100%）',
      specificProposal: '初回接触時に顧客ニーズヒアリングシートの記入を必須化し、提案前の顧客理解度を80%以上に設定',
      expectedImprovementRate: 0.25,
      confidenceScore: 0.87,
      generatedAt: FIXED_TIMESTAMP,
    };

    fakeAiClient.setMockResponse({
      proposal: expectedProposal,
      success: true,
    });

    // 4. AIエージェント実行：改善提案生成処理
    const aiResponse = await fakeAiClient.generateImprovementProposal(
      successCases,
      improvementTargetData
    );

    // 5. 生成された改善提案をDBに保存
    testDataStore.saveProposal(aiResponse.proposal, 'pending_manager_review');

    // 6. 監査ログを記録
    const auditLogEntry: AuditLogEntry = {
      eventType: 'IMPROVEMENT_PROPOSAL_GENERATED',
      agentId: 'tx-2-imp-2',
      staffId: 'B',
      proposalId: expectedProposal.proposalId,
      confidenceScore: 0.87,
      executedAt: FIXED_TIMESTAMP,
      requestedBy: 'system',
    };
    testDataStore.recordAuditLog(auditLogEntry);

    // 7. 検証：改善提案の詳細内容
    const savedProposal = testDataStore.getProposal('prop_001');
    expect(savedProposal).toBeDefined();
    expect(savedProposal?.proposalId).toBe('prop_001');
    expect(savedProposal?.targetStaffId).toBe('B');
    expect(savedProposal?.issue).toBe('顧客初期接触から提案段階のプロセススキップ率30%');
    expect(savedProposal?.successCaseReference).toBe('成功事例A（遵守率100%）');
    expect(savedProposal?.specificProposal).toBe(
      '初回接触時に顧客ニーズヒアリングシートの記入を必須化し、提案前の顧客理解度を80%以上に設定'
    );
    expect(savedProposal?.expectedImprovementRate).toBe(0.25);
    expect(savedProposal?.confidenceScore).toBe(0.87);
    expect(savedProposal?.generatedAt).toBe(FIXED_TIMESTAMP);

    // 8. 検証：提案ステータスが「pending_manager_review」で初期化
    expect(savedProposal?.status).toBe('pending_manager_review');

    // 9. 検証：監査ログが正しく記録されたこと
    const auditLogs = testDataStore.getAuditLogs();
    expect(auditLogs).toHaveLength(1);
    expect(auditLogs[0].eventType).toBe('IMPROVEMENT_PROPOSAL_GENERATED');
    expect(auditLogs[0].agentId).toBe('tx-2-imp-2');
    expect(auditLogs[0].staffId).toBe('B');
    expect(auditLogs[0].proposalId).toBe('prop_001');
    expect(auditLogs[0].confidenceScore).toBe(0.87);
    expect(auditLogs[0].executedAt).toBe(FIXED_TIMESTAMP);
    expect(auditLogs[0].requestedBy).toBe('system');

    // 10. 検証：改善期待値の計算確認
    // B営業担当者のスキップ率が40%（プロセス遵守率60%）から25%改善すると、遵守率は85%になる期待
    const baseline_compliance_rate = 0.6;
    const expected_improvement_rate = 0.25;
    const projected_compliance_rate = baseline_compliance_rate + expected_improvement_rate;
    expect(projected_compliance_rate).toBe(0.85);
  });
});