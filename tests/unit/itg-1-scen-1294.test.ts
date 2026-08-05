import { runTx11Imp1Agent } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-1294
  test("[normal] 営業事例の収集・分類・言語化の自動化と例外時のみ人による確認 AIエージェント - 営業システムから事例データを自動抽出する", async () => {
    const mock_ai_client = {
      extractCasesFromSystem: jest.fn().mockResolvedValue({
        status: "success",
        cases: [
          {
            caseId: "CASE001",
            salesPersonId: "SP001",
            dealAmount: 5000000,
            dealStage: "契約完了",
            successFactors: ["顧客ニーズの深掘り", "提案資料の質"],
            failureFactors: [],
            dealDate: "2024-01-15",
            dealDescription:
              "大型システム導入案件。初回提案から成約まで3ヶ月。",
          },
          {
            caseId: "CASE002",
            salesPersonId: "SP002",
            dealAmount: 2500000,
            dealStage: "契約完了",
            successFactors: ["複数回接触", "経営層への提案"],
            failureFactors: [],
            dealDate: "2024-01-18",
            dealDescription:
              "中堅企業向けコンサルティング。意思決定者の関与が重要だった。",
          },
          {
            caseId: "CASE003",
            salesPersonId: "SP003",
            dealAmount: 1800000,
            dealStage: "契約完了",
            successFactors: ["競合対策", "長期関係構築"],
            failureFactors: [],
            dealDate: "2024-01-20",
            dealDescription:
              "更新案件。既存顧客との信頼関係を活用した提案。",
          },
        ],
      }),
    };

    const request_input = {
      orchestrator_id: "TX11IMP1ORK001",
      execution_timestamp: new Date("2024-01-25T09:00:00Z"),
      ai_client: mock_ai_client,
      system_api_config: {
        endpoint: "https://sales-system.example.com/api",
        auth_token: "test_token_tx11",
      },
    };

    const result = await runTx11Imp1Agent(request_input);

    expect(result).toBeDefined();
    expect(result.status).toBe("success");
    expect(result.action_executed).toBe(
      "営業システムから事例データを自動抽出する"
    );
    expect(result.record_count).toBe(3);

    const extracted_cases = result.extracted_data;
    expect(extracted_cases).toHaveLength(3);

    expect(extracted_cases[0]).toEqual({
      caseId: "CASE001",
      salesPersonId: "SP001",
      dealAmount: 5000000,
      dealStage: "契約完了",
      successFactors: ["顧客ニーズの深掘り", "提案資料の質"],
      failureFactors: [],
      dealDate: "2024-01-15",
      dealDescription:
        "大型システム導入案件。初回提案から成約まで3ヶ月。",
    });

    expect(extracted_cases[1]).toEqual({
      caseId: "CASE002",
      salesPersonId: "SP002",
      dealAmount: 2500000,
      dealStage: "契約完了",
      successFactors: ["複数回接触", "経営層への提案"],
      failureFactors: [],
      dealDate: "2024-01-18",
      dealDescription:
        "中堅企業向けコンサルティング。意思決定者の関与が重要だった。",
    });

    expect(extracted_cases[2]).toEqual({
      caseId: "CASE003",
      salesPersonId: "SP003",
      dealAmount: 1800000,
      dealStage: "契約完了",
      successFactors: ["競合対策", "長期関係構築"],
      failureFactors: [],
      dealDate: "2024-01-20",
      dealDescription:
        "更新案件。既存顧客との信頼関係を活用した提案。",
    });

    expect(result.execution_log).toBeDefined();
    expect(result.execution_log).toContain(
      "Action: 営業システムから事例データを自動抽出する"
    );
    expect(result.execution_log).toContain("Status: SUCCESS");
    expect(result.execution_log).toContain("RecordCount: 3");

    expect(mock_ai_client.extractCasesFromSystem).toHaveBeenCalledTimes(1);
    expect(mock_ai_client.extractCasesFromSystem).toHaveBeenCalledWith({
      system_api_endpoint: "https://sales-system.example.com/api",
      auth_token: "test_token_tx11",
      prompt_template: "case-extraction",
    });

    expect(result.intermediate_storage_saved).toBe(true);
    expect(result.intermediate_storage_key).toBeDefined();
  });
});