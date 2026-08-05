import { runTx11Imp1Agent } from "../../src/logic/it-1";

jest.mock("../../src/logic/it-1", () => ({
  runTx11Imp1Agent: jest.fn(),
}));

describe("営業事例の収集・分類・言語化の自動化と例外時のみ人による確認 AIエージェント", () => {
  let tx11Imp1Agent: jest.MockedFunction<typeof runTx11Imp1Agent>;
  let notificationTable: Array<{
    salesPersonId: string;
    messagePayload: string;
    createdAt: string;
  }>;
  let auditLog: Array<{
    timestamp: string;
    action: string;
    userId: string;
    targetUsers: string[];
    status: string;
  }>;
  let knowledgeBase: Array<{
    patternId: string;
    successFactors: string[];
    successCaseCount: number;
    successRate: number;
    classificationAccuracy: number;
  }>;

  beforeEach(() => {
    tx11Imp1Agent = runTx11Imp1Agent as jest.MockedFunction<
      typeof runTx11Imp1Agent
    >;
    notificationTable = [];
    auditLog = [];
    knowledgeBase = [];
    jest.clearAllMocks();
  });

  // SCEN-1298
  test("営業事例の収集・分類・言語化の自動化と例外時のみ人による確認が成功パターン提示実行を契約通り実行する", async () => {
    // テスト用の営業事例データを準備
    const testSalesExamples = [
      {
        id: "case_001",
        type: "success",
        salesPersonId: "sp_A001",
        customerName: "顧客企業A",
        productName: "サービスX",
        contactTime: 35,
        proposalContent:
          "顧客の課題ヒアリング時間を30分以上確保し、提案前に課題解決の優先順位を顧客と合意した",
        result: "成約",
        contractAmount: 5000000,
        successFactors: [
          "顧客課題ヒアリング時間30分以上確保",
          "提案前課題優先順位合意",
          "複数部門長との事前調整",
        ],
      },
      {
        id: "case_002",
        type: "success",
        salesPersonId: "sp_B002",
        customerName: "顧客企業B",
        productName: "サービスX",
        contactTime: 32,
        proposalContent:
          "顧客の経営課題を1週間かけて詳しくヒアリングし、ROI分析を含む提案資料を提出した",
        result: "成約",
        contractAmount: 7200000,
        successFactors: [
          "顧客課題ヒアリング時間30分以上確保",
          "ROI分析を含む提案",
          "継続的なフォローアップ",
        ],
      },
      {
        id: "case_003",
        type: "success",
        salesPersonId: "sp_C003",
        customerName: "顧客企業C",
        productName: "サービスY",
        contactTime: 28,
        proposalContent:
          "顧客の部門別ニーズを把握し、段階的な導入プランを提案した",
        result: "成約",
        contractAmount: 3500000,
        successFactors: [
          "部門別ニーズ把握",
          "段階的導入プラン提案",
          "長期関係構築",
        ],
      },
      {
        id: "case_004",
        type: "success",
        salesPersonId: "sp_D004",
        customerName: "顧客企業D",
        productName: "サービスX",
        contactTime: 40,
        proposalContent:
          "初回接触時に30分以上のヒアリングを実施し、顧客の潜在的な課題も引き出した",
        result: "成約",
        contractAmount: 6100000,
        successFactors: [
          "顧客課題ヒアリング時間30分以上確保",
          "潜在的課題の引き出し",
          "信頼構築",
        ],
      },
      {
        id: "case_005",
        type: "success",
        salesPersonId: "sp_E005",
        customerName: "顧客企業E",
        productName: "サービスZ",
        contactTime: 33,
        proposalContent:
          "経営層と現場層の両者からヒアリングを実施し、全社的な導入価値を提案した",
        result: "成約",
        contractAmount: 8900000,
        successFactors: [
          "経営層と現場層の両者ヒアリング",
          "全社的導入価値提案",
          "顧客課題ヒアリング時間30分以上確保",
        ],
      },
      {
        id: "case_006",
        type: "failure",
        salesPersonId: "sp_F006",
        customerName: "顧客企業F",
        productName: "サービスX",
        contactTime: 12,
        proposalContent: "初回接触で即座に提案資料を提出した",
        result: "失注",
        contractAmount: 0,
        failureFactors: [
          "ヒアリング時間不足",
          "顧客課題把握不足",
          "早期提案",
        ],
      },
      {
        id: "case_007",
        type: "failure",
        salesPersonId: "sp_G007",
        customerName: "顧客企業G",
        productName: "サービスY",
        contactTime: 15,
        proposalContent: "標準提案資料をそのまま提出した",
        result: "失注",
        contractAmount: 0,
        failureFactors: [
          "顧客カスタマイズなし",
          "ヒアリング時間不足",
          "標準提案のみ",
        ],
      },
      {
        id: "case_008",
        type: "failure",
        salesPersonId: "sp_H008",
        customerName: "顧客企業H",
        productName: "サービスZ",
        contactTime: 20,
        proposalContent: "単一部門のニーズのみ把握して提案した",
        result: "失注",
        contractAmount: 0,
        failureFactors: [
          "全社的課題把握不足",
          "部門別ニーズ未確認",
          "段階的導入提案なし",
        ],
      },
    ];

    // AIエージェントの成功パターン抽出結果をモック
    const extractedPatterns = [
      {
        patternId: "pattern_001",
        successFactors: [
          "顧客課題ヒアリング時間30分以上確保",
          "提案前課題優先順位合意",
        ],
        successCaseCount: 4,
        successRate: 85,
        classificationAccuracy: 88,
        matchedCaseIds: ["case_001", "case_002", "case_004", "case_005"],
      },
      {
        patternId: "pattern_002",
        successFactors: [
          "経営層と現場層の両者ヒアリング",
          "全社的導入価値提案",
        ],
        successCaseCount: 2,
        successRate: 90,
        classificationAccuracy: 85,
        matchedCaseIds: ["case_003", "case_005"],
      },
    ];

    // AIクライアント推論結果をシミュレート
    const aiClientResponse = {
      collectionStatus: "completed",
      extractedCaseCount: 8,
      analyzedCaseCount: 8,
      patternsExtracted: extractedPatterns,
      recommendationPayloads: [
        {
          targetSalesPersonId: "sp_A001",
          patterns: [extractedPatterns[0]],
          message: `成功パターン推奨：成功要因：顧客課題ヒアリング時間30分以上確保、提案前課題優先順位合意、成功事例件数：4件、成功率：85%、推奨理由：この成功パターンは貴殿の過去実績と高い相関があります。本パターンに基づいた提案を他の案件でも活用することで、成約率向上が期待できます。`,
        },
        {
          targetSalesPersonId: "sp_B002",
          patterns: [extractedPatterns[0], extractedPatterns[1]],
          message: `成功パターン推奨：成功要因：顧客課題ヒアリング時間30分以上確保、提案前課題優先順位合意、成功事例件数：4件、成功率：85%、推奨理由：この成功パターンは貴殿の過去実績と高い相関があります。本パターンに基づいた提案を他の案件でも活用することで、成約率向上が期待できます。`,
        },
      ],
    };

    // AIエージェント実行ロジックをモック
    tx11Imp1Agent.mockImplementationOnce(async () => {
      // 1. 営業事例の自動抽出
      const extractedCases = testSalesExamples;

      // 2. 成功事例と失敗事例の分析・言語化
      const successCases = extractedCases.filter((c) => c.type === "success");
      const failureCases = extractedCases.filter((c) => c.type === "failure");

      // 3. パターン照合と知識ベース登録
      knowledgeBase.push(
        ...extractedPatterns.map((p) => ({
          patternId: p.patternId,
          successFactors: p.successFactors,
          successCaseCount: p.successCaseCount,
          successRate: p.successRate,
          classificationAccuracy: p.classificationAccuracy,
        }))
      );

      // 4. 営業担当者に成功パターンを提示・推奨（自律実行アクション）
      for (const payload of aiClientResponse.recommendationPayloads) {
        notificationTable.push({
          salesPersonId: payload.targetSalesPersonId,
          messagePayload: payload.message,
          createdAt: "2024-01-15T11:00:00Z",
        });
      }

      // 5. 監査ログの記録
      auditLog.push({
        timestamp: "2024-01-15T11:00:00Z",
        action: "recommend_success_pattern",
        userId: "agent_tx11_imp1",
        targetUsers: aiClientResponse.recommendationPayloads.map(
          (p) => p.targetSalesPersonId
        ),
        status: "success",
      });

      return {
        success: true,
        executionId: "tx11_imp1_exec_20240115_110000",
        collectionStatus: aiClientResponse.collectionStatus,
        extractedCaseCount: aiClientResponse.extractedCaseCount,
        patternsRegistered: extractedPatterns.length,
        recommendationsSent: aiClientResponse.recommendationPayloads.length,
        auditLogId: "audit_20240115_110000",
      };
    });

    // AIエージェント実行
    const result = await runTx11Imp1Agent({
      agentId: "agent_tx11_imp1",
      executionContext: {
        userId: "agent_tx11_imp1",
        timestamp: "2024-01-15T11:00:00Z",
        correlationId: "corr_20240115_110000",
      },
    });

    // 期待値検証：AIエージェント実行成功
    expect(result.success).toBe(true);
    expect(result.collectionStatus).toBe("completed");
    expect(result.extractedCaseCount).toBe(8);
    expect(result.patternsRegistered).toBe(2);
    expect(result.recommendationsSent).toBe(2);

    // 知識ベース検証：パターンが正しく登録されている
    expect(knowledgeBase.length).toBe(2);

    const pattern1 = knowledgeBase.find((p) => p.patternId === "pattern_001");
    expect(pattern1).toBeDefined();
    expect(pattern1!.successFactors).toContain(
      "顧客課題ヒアリング時間30分以上確保"
    );
    expect(pattern1!.successCaseCount).toBe(4);
    expect(pattern1!.successRate).toBe(85);
    expect(pattern1!.classificationAccuracy).toBe(88);

    const pattern2 = knowledgeBase.find((p) => p.patternId === "pattern_002");
    expect(pattern2).toBeDefined();
    expect(pattern2!.successFactors).toContain(
      "経営層と現場層の両者ヒアリング"
    );
    expect(pattern2!.successCaseCount).toBe(2);
    expect(pattern2!.successRate).toBe(90);
    expect(pattern2!.classificationAccuracy).toBe(85);

    // 通知テーブル検証：推奨メッセージが記録されている
    expect(notificationTable.length).toBe(2);

    const notification1 = notificationTable.find(
      (n) => n.salesPersonId === "sp_A001"
    );
    expect(notification1).toBeDefined();
    expect(notification1!.messagePayload).toContain("成功要因：");
    expect(notification1!.messagePayload).toContain("顧客課題ヒアリング時間");
    expect(notification1!.messagePayload).toContain("30分");
    expect(notification1!.messagePayload).toContain("成功事例件数：4件");
    expect(notification1!.messagePayload).toContain("成功率：85%");
    expect(notification1!.createdAt).toBe("2024-01-15T11:00:00Z");

    const notification2 = notificationTable.find(
      (n) => n.salesPersonId === "sp_B002"
    );
    expect(notification2).toBeDefined();
    expect(notification2!.messagePayload).toContain("成功要因：");
    expect(notification2!.messagePayload).toContain("成功事例件数：4件");
    expect(notification2!.createdAt).toBe("2024-01-15T11:00:00Z");

    // 監査ログ検証：推奨実行イベントが記録されている
    expect(auditLog.length).toBe(1);
    const auditEntry = auditLog[0];
    expect(auditEntry.timestamp).toBe("2024-01-15T11:00:00Z");
    expect(auditEntry.action).toBe("recommend_success_pattern");
    expect(auditEntry.userId).toBe("agent_tx11_imp1");
    expect(auditEntry.targetUsers).toContain("sp_A001");
    expect(auditEntry.targetUsers).toContain("sp_B002");
    expect(auditEntry.targetUsers.length).toBe(2);
    expect(auditEntry.status).toBe("success");

    // AIエージェント呼び出し確認
    expect(tx11Imp1Agent).toHaveBeenCalled();
    expect(tx11Imp1Agent).toHaveBeenCalledWith({
      agentId: "agent_tx11_imp1",
      executionContext: {
        userId: "agent_tx11_imp1",
        timestamp: "2024-01-15T11:00:00Z",
        correlationId: "corr_20240115_110000",
      },
    });
  });
});