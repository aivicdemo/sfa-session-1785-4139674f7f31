import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx2Imp2Agent } from "../../src/agents/tx-2-imp-2/orchestrator";

interface FakeTx2Imp2AiClient {
  analyzeProcessCompliance: jest.Mock;
  generateImprovementProposal: jest.Mock;
  notifySalesRep: jest.Mock;
  updateDashboard: jest.Mock;
  escalateToManager: jest.Mock;
}

interface SalesActivityData {
  salesRepId: string;
  activityDate: string;
  processSteps: string[];
  customerComplaintFlag: boolean;
  complaintDetail: string;
}

interface ProcessComplianceAnalysisResult {
  salesRepId: string;
  complianceScore: number;
  processDeviations: Array<{
    stepName: string;
    status: "completed" | "skipped" | "delayed";
  }>;
  customerComplaintDetected: boolean;
  complaintContent: string;
}

interface ImprovementProposal {
  proposalId: string;
  salesRepId: string;
  improvementType: string;
  relatedToComplaint: boolean;
  complaintContent: string;
  recommendedAction: string;
  priority: "high" | "medium" | "low";
}

interface ManagerHandoverMessage {
  escalation_type: string;
  salesRepId: string;
  complaintContent: string;
  proposedImprovement: string;
  sideEffectsPending: string[];
  requiresApproval: boolean;
}

interface ExecutionState {
  notificationSent: boolean;
  dashboardUpdated: boolean;
  managerHandoverTriggered: boolean;
  pendingApprovalStatus: string;
}

describe("営業プロセス遵守状況の自動監視と改善提案の実行 - エスカレーション", () => {
  let fakeTx2Imp2AiClient: FakeTx2Imp2AiClient;
  let executionState: ExecutionState;

  beforeEach(() => {
    fakeTx2Imp2AiClient = {
      analyzeProcessCompliance: jest.fn(),
      generateImprovementProposal: jest.fn(),
      notifySalesRep: jest.fn(),
      updateDashboard: jest.fn(),
      escalateToManager: jest.fn(),
    };

    executionState = {
      notificationSent: false,
      dashboardUpdated: false,
      managerHandoverTriggered: false,
      pendingApprovalStatus: "not_initiated",
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1248
  test("should escalate to manager before executing side effects when customer complaint related improvement is detected", async () => {
    // Arrange: テスト用のfake AI clientを初期化し、営業活動データ分析結果として顧客クレーム検出を設定
    const complianceAnalysisResult: ProcessComplianceAnalysisResult = {
      salesRepId: "sales_rep_001",
      complianceScore: 65,
      processDeviations: [
        {
          stepName: "product_explanation",
          status: "skipped",
        },
        {
          stepName: "initial_contact",
          status: "completed",
        },
      ],
      customerComplaintDetected: true,
      complaintContent: "商品説明プロセス未実施により顧客が仕様を誤解",
    };

    const improvementProposal: ImprovementProposal = {
      proposalId: "prop_001",
      salesRepId: "sales_rep_001",
      improvementType: "process_adherence",
      relatedToComplaint: true,
      complaintContent: "商品説明プロセス未実施により顧客が仕様を誤解",
      recommendedAction:
        "全商談で必ず製品仕様説明を初期段階で実施し、顧客理解を確認する",
      priority: "high",
    };

    const expectedManagerHandoverMessage: ManagerHandoverMessage = {
      escalation_type: "customer_complaint_related_improvement",
      salesRepId: "sales_rep_001",
      complaintContent: "商品説明プロセス未実施により顧客が仕様を誤解",
      proposedImprovement:
        "全商談で必ず製品仕様説明を初期段階で実施し、顧客理解を確認する",
      sideEffectsPending: ["notification_to_sales_rep", "dashboard_update"],
      requiresApproval: true,
    };

    fakeTx2Imp2AiClient.analyzeProcessCompliance.mockResolvedValue(
      complianceAnalysisResult
    );
    fakeTx2Imp2AiClient.generateImprovementProposal.mockResolvedValue(
      improvementProposal
    );

    let escalationTriggered = false;
    let handoverMessageContent: ManagerHandoverMessage | null = null;

    fakeTx2Imp2AiClient.escalateToManager.mockImplementation(
      async (message: ManagerHandoverMessage) => {
        escalationTriggered = true;
        handoverMessageContent = message;
        executionState.managerHandoverTriggered = true;
        executionState.pendingApprovalStatus = "awaiting_manager_review";
        return {
          escalation_id: "esc_001",
          status: "handed_over_to_manager",
          timestamp: "2024-01-15T11:30:00Z",
        };
      }
    );

    fakeTx2Imp2AiClient.notifySalesRep.mockImplementation(async () => {
      executionState.notificationSent = true;
      return { notification_id: "notif_001", status: "sent" };
    });

    fakeTx2Imp2AiClient.updateDashboard.mockImplementation(async () => {
      executionState.dashboardUpdated = true;
      return { dashboard_id: "dash_001", status: "updated" };
    });

    // Act: runTx2Imp2Agentを呼び出しAIエージェント処理を開始
    const result = await runTx2Imp2Agent(
      {
        salesActivityData: {
          salesRepId: "sales_rep_001",
          activityDate: "2024-01-15T10:00:00Z",
          processSteps: ["initial_contact"],
          customerComplaintFlag: true,
          complaintDetail: "商品説明プロセス未実施により顧客が仕様を誤解",
        } as SalesActivityData,
        processDefinition: {
          requiredSteps: [
            "initial_contact",
            "product_explanation",
            "proposal",
            "negotiation",
            "closing",
          ],
          complianceThreshold: 80,
        },
        managerInfo: {
          managerId: "manager_001",
          escalationEnabled: true,
        },
      },
      fakeTx2Imp2AiClient as any
    );

    // Assert: AIエージェントが営業活動データを収集・分析し、プロセス遵守状況を自動判定
    expect(
      fakeTx2Imp2AiClient.analyzeProcessCompliance
    ).toHaveBeenCalledTimes(1);
    expect(complianceAnalysisResult.customerComplaintDetected).toBe(true);

    // AIエージェントが改善機会を検出し、顧客クレーム関連の改善提案を生成したことを確認
    expect(
      fakeTx2Imp2AiClient.generateImprovementProposal
    ).toHaveBeenCalledTimes(1);
    expect(improvementProposal.relatedToComplaint).toBe(true);
    expect(improvementProposal.priority).toBe("high");

    // AIエージェントが副作用実行直前にマネージャーへの引き継ぎをトリガー
    expect(escalationTriggered).toBe(true);
    expect(executionState.managerHandoverTriggered).toBe(true);

    // 引き継ぎメッセージが escalation_type を含むことを検証
    expect(handoverMessageContent).not.toBeNull();
    expect(handoverMessageContent?.escalation_type).toBe(
      "customer_complaint_related_improvement"
    );

    // 引き継ぎメッセージが改善提案の詳細内容を含むことを検証
    expect(handoverMessageContent?.salesRepId).toBe("sales_rep_001");
    expect(handoverMessageContent?.complaintContent).toBe(
      "商品説明プロセス未実施により顧客が仕様を誤解"
    );
    expect(handoverMessageContent?.proposedImprovement).toBe(
      "全商談で必ず製品仕様説明を初期段階で実施し、顧客理解を確認する"
    );

    // 引き継ぎメッセージが保留中の副作用を明記
    expect(handoverMessageContent?.sideEffectsPending).toContain(
      "notification_to_sales_rep"
    );
    expect(handoverMessageContent?.sideEffectsPending).toContain(
      "dashboard_update"
    );
    expect(handoverMessageContent?.requiresApproval).toBe(true);

    // 営業担当者への自動通知がまだ送信されていないことを確認
    expect(executionState.notificationSent).toBe(false);
    expect(fakeTx2Imp2AiClient.notifySalesRep).not.toHaveBeenCalled();

    // ダッシュボード更新がまだ実行されていないことを確認
    expect(executionState.dashboardUpdated).toBe(false);
    expect(fakeTx2Imp2AiClient.updateDashboard).not.toHaveBeenCalled();

    // マネージャー確認待ちの状態がシステムに記録
    expect(executionState.pendingApprovalStatus).toBe("awaiting_manager_review");

    // 最終結果の検証
    expect(result).toMatchObject({
      escalation_id: expect.stringContaining("esc_"),
      status: "handed_over_to_manager",
      escalation_type: "customer_complaint_related_improvement",
      sideEffectsPending: [
        "notification_to_sales_rep",
        "dashboard_update",
      ],
    });
  });
});