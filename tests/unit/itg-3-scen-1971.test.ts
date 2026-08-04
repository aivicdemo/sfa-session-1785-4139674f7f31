import { describe, test, expect, beforeEach } from "@jest/globals";
import { generateMultiProposalPersuasionReport } from "../../src/logic/it-1-br-3-1-1-1";

interface ProposalInput {
  proposal_id: string;
  customer_id: string;
  proposal_content: string;
  evaluation_score: number;
  customer_constraints: {
    budget_limit: number;
    schedule_constraint: string;
    product_category_allowed: string[];
  };
  alignment_result: {
    feasibility_score: number;
    risk_factors: string[];
  };
}

interface AIRecommendationEngineStub {
  evaluatePatternRelevance: (proposalData: ProposalInput) => Promise<{
    relevance_score: number;
    reasoning: string;
  }>;
}

interface FileStorageAdapterStub {
  uploadRecommendationReport: (
    reportContent: string,
    metadata: Record<string, unknown>
  ) => Promise<{ s3_key: string }>;
  generateDownloadUrl: (s3Key: string) => Promise<{
    download_url: string;
    expires_at: string;
  }>;
}

describe("AIエージェント推奨根拠の可視化機能 - 経営層向け説得資料自動生成", () => {
  let aiEngineStub: AIRecommendationEngineStub;
  let fileStorageStub: FileStorageAdapterStub;
  let testProposals: ProposalInput[];

  beforeEach(() => {
    // AIRecommendationEngineのスタブ設定
    aiEngineStub = {
      evaluatePatternRelevance: async (proposalData: ProposalInput) => {
        if (proposalData.proposal_id === "PROP-001") {
          return {
            relevance_score: 0.85,
            reasoning:
              "顧客の予算制約内で実装可能な提案。過去の同規模顧客での成功率95%。",
          };
        } else if (proposalData.proposal_id === "PROP-002") {
          return {
            relevance_score: 0.72,
            reasoning:
              "スケジュール制約が厳しいが、提案内容は顧客ニーズに合致。リスク要因要対応。",
          };
        } else if (proposalData.proposal_id === "PROP-003") {
          return {
            relevance_score: 0.65,
            reasoning:
              "提案内容の一部が顧客の許可対象外カテゴリに該当。修正提案で対応可能。",
          };
        }
        return { relevance_score: 0.5, reasoning: "未評価" };
      },
    };

    // FileStorageAdapterのスタブ設定
    fileStorageStub = {
      uploadRecommendationReport: async (
        reportContent: string,
        metadata: Record<string, unknown>
      ) => {
        return {
          s3_key: `reports/${metadata.report_id}/persuasion_report.pdf`,
        };
      },
      generateDownloadUrl: async (s3Key: string) => {
        const expirationTime = new Date("2024-01-15T11:00:00Z");
        expirationTime.setHours(expirationTime.getHours() + 24);
        return {
          download_url: `https://s3.example.com/download?key=${s3Key}&token=abc123`,
          expires_at: expirationTime.toISOString(),
        };
      },
    };

    // テストデータ：照合評価完了済みの複数提案
    testProposals = [
      {
        proposal_id: "PROP-001",
        customer_id: "CUST-2024-001",
        proposal_content:
          "クラウドERP導入プラン：12ヶ月導入、運用研修含む、総額500万円",
        evaluation_score: 0.85,
        customer_constraints: {
          budget_limit: 600,
          schedule_constraint: "2024年Q1末までに本稼働",
          product_category_allowed: ["ERP", "クラウド", "SaaS"],
        },
        alignment_result: {
          feasibility_score: 0.88,
          risk_factors: ["初期学習コスト"],
        },
      },
      {
        proposal_id: "PROP-002",
        customer_id: "CUST-2024-001",
        proposal_content:
          "データ分析基盤構築：データウェアハウス+BIツール、6ヶ月実装、総額280万円",
        evaluation_score: 0.72,
        customer_constraints: {
          budget_limit: 600,
          schedule_constraint: "2024年Q2末までに本稼働",
          product_category_allowed: ["データ分析", "BI", "DWH"],
        },
        alignment_result: {
          feasibility_score: 0.70,
          risk_factors: ["スケジュール逼迫", "既存システム連携調整"],
        },
      },
      {
        proposal_id: "PROP-003",
        customer_id: "CUST-2024-001",
        proposal_content:
          "業務自動化RPA導入：3業務自動化、3ヶ月導入、総額150万円",
        evaluation_score: 0.65,
        customer_constraints: {
          budget_limit: 600,
          schedule_constraint: "2024年Q3末までに本稼働",
          product_category_allowed: ["自動化", "RPA"],
        },
        alignment_result: {
          feasibility_score: 0.62,
          risk_factors: ["対象業務の例外処理多数", "ユーザー抵抗感"],
        },
      },
    ];
  });

  // SCEN-1971
  test("照合評価完了済みの複数提案について統合説得資料が生成され、各提案の妥当性スコア・根拠・リスク判定を含む1つのPDFレポートが返却される", async () => {
    const reportGenerationStartTime = new Date("2024-01-15T10:55:00Z");
    const createdByUserId = "USR-2024-0001";

    const result = await generateMultiProposalPersuasionReport(
      testProposals,
      aiEngineStub,
      fileStorageStub,
      {
        created_by: createdByUserId,
        generation_timestamp: reportGenerationStartTime,
      }
    );

    // 結果が返却されていることを確認
    expect(result).toBeDefined();
    expect(result).toHaveProperty("download_url");
    expect(result).toHaveProperty("report_id");
    expect(result).toHaveProperty("metadata");

    // レポートメタデータの検証
    expect(result.metadata).toHaveProperty("proposal_count");
    expect(result.metadata.proposal_count).toBe(3);

    expect(result.metadata).toHaveProperty("file_name");
    expect(result.metadata.file_name).toMatch(/persuasion_report\.pdf$/);

    expect(result.metadata).toHaveProperty("created_by");
    expect(result.metadata.created_by).toBe(createdByUserId);

    expect(result.metadata).toHaveProperty("generation_timestamp");
    expect(result.metadata.generation_timestamp).toBe(
      reportGenerationStartTime.toISOString()
    );

    // ダウンロードURLの有効期限検証（24時間以内）
    expect(result).toHaveProperty("expires_at");
    const expiresAtTime = new Date(result.expires_at);
    const expirationDiff =
      (expiresAtTime.getTime() - reportGenerationStartTime.getTime()) / 1000 /
      3600;
    expect(expirationDiff).toBeLessThanOrEqual(24);
    expect(expirationDiff).toBeGreaterThan(23.9);

    // 各提案の妥当性スコア（数値0.0～1.0）の検証
    expect(result.proposals).toHaveLength(3);

    const prop1Result = result.proposals[0];
    expect(prop1Result.proposal_id).toBe("PROP-001");
    expect(prop1Result.relevance_score).toBe(0.85);
    expect(prop1Result.relevance_score).toBeGreaterThanOrEqual(0.7);
    expect(prop1Result.score_label).toBe("高い適合度");

    const prop2Result = result.proposals[1];
    expect(prop2Result.proposal_id).toBe("PROP-002");
    expect(prop2Result.relevance_score).toBe(0.72);
    expect(prop2Result.relevance_score).toBeGreaterThanOrEqual(0.7);
    expect(prop2Result.score_label).toBe("中程度の適合度");

    const prop3Result = result.proposals[2];
    expect(prop3Result.proposal_id).toBe("PROP-003");
    expect(prop3Result.relevance_score).toBe(0.65);
    expect(prop3Result.relevance_score).toBeLessThan(0.7);
    expect(prop3Result.score_label).toBe("要検討・修正推奨");

    // 各提案セクションに根拠説明が含まれていることを確認
    expect(prop1Result.reasoning).toContain("成功率95%");
    expect(prop2Result.reasoning).toContain("リスク要因要対応");
    expect(prop3Result.reasoning).toContain("修正提案で対応可能");

    // リスク・制約条件への適合性判定が含まれていることを確認
    expect(prop1Result.alignment_assessment).toBeDefined();
    expect(prop1Result.alignment_assessment.feasibility_score).toBe(0.88);
    expect(prop1Result.alignment_assessment.risk_factors).toContain(
      "初期学習コスト"
    );

    expect(prop2Result.alignment_assessment).toBeDefined();
    expect(prop2Result.alignment_assessment.feasibility_score).toBe(0.70);
    expect(prop2Result.alignment_assessment.risk_factors).toContain(
      "スケジュール逼迫"
    );

    expect(prop3Result.alignment_assessment).toBeDefined();
    expect(prop3Result.alignment_assessment.feasibility_score).toBe(0.62);
    expect(prop3Result.alignment_assessment.risk_factors).toContain(
      "対象業務の例外処理多数"
    );

    // 複数提案の比較表データが含まれていることを確認
    expect(result.comparison_table).toBeDefined();
    expect(result.comparison_table).toHaveLength(3);

    expect(result.comparison_table[0]).toEqual({
      proposal_id: "PROP-001",
      score: 0.85,
      budget: 500,
      timeline: "Q1末本稼働",
      feasibility: 0.88,
    });

    expect(result.comparison_table[1]).toEqual({
      proposal_id: "PROP-002",
      score: 0.72,
      budget: 280,
      timeline: "Q2末本稼働",
      feasibility: 0.70,
    });

    expect(result.comparison_table[2]).toEqual({
      proposal_id: "PROP-003",
      score: 0.65,
      budget: 150,
      timeline: "Q3末本稼働",
      feasibility: 0.62,
    });

    // S3アップロードが実行されたことを確認（呼び出し履歴確認）
    expect(result.metadata).toHaveProperty("s3_key");
    expect(result.metadata.s3_key).toMatch(/reports\/.*\/persuasion_report\.pdf$/);

    // 生成時間が30秒以内であることを確認（スタブなので実測値ではなく、メタデータに記録される設計）
    expect(result.metadata).toHaveProperty("generation_time_seconds");
    expect(result.metadata.generation_time_seconds).toBeLessThanOrEqual(30);
  });
});