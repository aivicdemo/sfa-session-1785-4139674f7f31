import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { analyzeCorrelationWithExecutionData } from "../../src/logic/it-1-br-2-1-1";

interface SalesPersonBehaviorPattern {
  sales_person_id: string;
  contact_frequency_monthly: number;
  proposal_product_a_count: number;
  proposal_product_b_count: number;
  followup_interval_days: number;
}

interface ContractResultData {
  contract_count: number;
  lost_count: number;
  contract_rate: number;
}

interface StandardProcessReference {
  standard_contact_frequency: number;
  standard_proposal_ratio_a: number;
  standard_proposal_ratio_b: number;
  standard_followup_interval_days: number;
}

interface CorrelationAnalysisResult {
  sales_person_id: string;
  contact_frequency_correlation: number;
  proposal_pattern_analysis: string;
  followup_interval_analysis: string;
  dataset_metadata: {
    target_sales_person_id: string;
    analysis_period_start: string;
    analysis_period_end: string;
    sample_count: number;
    missing_value_count: number;
  };
  calculation_logic: {
    correlation_method: string;
    contract_encoding: string;
  };
  success_pattern_insights: string;
  audit_log_id: string;
}

describe("営業プロセス標準書の妥当性検証と改善 - 成約実績との相関分析", () => {
  let mockAiClient: any;

  beforeEach(() => {
    mockAiClient = {
      analyzeCorrelation: jest.fn(),
      recordAuditLog: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1169: [normal] 成約実績との相関分析機能 - 単一の営業担当者の行動パターンデータから相関分析結果が生成される
  it("should generate correlation analysis result from single sales person behavior and contract data", async () => {
    // 行動パターンデータの準備
    const behavior_pattern: SalesPersonBehaviorPattern = {
      sales_person_id: "SALES_001",
      contact_frequency_monthly: 12,
      proposal_product_a_count: 5,
      proposal_product_b_count: 7,
      followup_interval_days: 3,
    };

    // 成約実績データの準備
    const contract_result: ContractResultData = {
      contract_count: 8,
      lost_count: 12,
      contract_rate: 0.4,
    };

    // 営業プロセス標準書との対比用データ
    const standard_process: StandardProcessReference = {
      standard_contact_frequency: 10,
      standard_proposal_ratio_a: 0.6,
      standard_proposal_ratio_b: 0.4,
      standard_followup_interval_days: 5,
    };

    // AIクライアントの戻り値設定
    // 相関係数：接触頻度と成約件数 = 0.78
    const expected_contact_correlation = 0.78;

    // フォローアップ間隔の成約確度上昇 = 5ポイント
    const followup_improvement = 5;

    // 分析期間のデータセット
    const dataset_period_start = "2024-01-01";
    const dataset_period_end = "2024-06-30";
    const sample_count = 20;
    const missing_value_count = 0;

    mockAiClient.analyzeCorrelation.mockResolvedValue({
      sales_person_id: "SALES_001",
      contact_frequency_correlation: expected_contact_correlation,
      proposal_pattern_analysis:
        "提案内容の標準比率との乖離が成約率に影響",
      followup_interval_analysis:
        "フォローアップ間隔3日が標準5日より短く、成約確度が平均より5ポイント高い",
      dataset_metadata: {
        target_sales_person_id: "SALES_001",
        analysis_period_start: dataset_period_start,
        analysis_period_end: dataset_period_end,
        sample_count: sample_count,
        missing_value_count: missing_value_count,
      },
      calculation_logic: {
        correlation_method: "ピアソンの相関係数",
        contract_encoding: "成約=1失注=0の二値変換",
      },
      success_pattern_insights:
        "製品A提案時の成約率が製品B提案時より15ポイント高い",
      audit_log_id: "AUDIT_LOG_202406001",
    });

    mockAiClient.recordAuditLog.mockResolvedValue({
      audit_log_id: "AUDIT_LOG_202406001",
      recorded: true,
    });

    // 相関分析処理を実行
    const result: CorrelationAnalysisResult =
      await analyzeCorrelationWithExecutionData(
        behavior_pattern,
        contract_result,
        standard_process,
        mockAiClient
      );

    // 期待結果の検証

    // (1) 接触頻度と成約件数の相関係数が0.78（強い正相関）
    expect(result.contact_frequency_correlation).toBe(0.78);

    // (2) 提案内容パターンと成約率の相関分析から乖離判定
    expect(result.proposal_pattern_analysis).toContain("乖離");

    // (3) フォローアップ間隔が短く成約確度が5ポイント高い
    expect(result.followup_interval_analysis).toContain("5ポイント");

    // (4a) 分析根拠データセット：対象者ID
    expect(result.dataset_metadata.target_sales_person_id).toBe("SALES_001");

    // (4b) 分析根拠データセット：分析期間
    expect(result.dataset_metadata.analysis_period_start).toBe("2024-01-01");
    expect(result.dataset_metadata.analysis_period_end).toBe("2024-06-30");

    // (4c) 分析根拠データセット：サンプル数
    expect(result.dataset_metadata.sample_count).toBe(20);

    // (4d) 分析根拠データセット：欠損数
    expect(result.dataset_metadata.missing_value_count).toBe(0);

    // (4e) 計算ロジック：相関係数算出方式
    expect(result.calculation_logic.correlation_method).toBe(
      "ピアソンの相関係数"
    );

    // (4f) 計算ロジック：成約エンコーディング
    expect(result.calculation_logic.contract_encoding).toBe(
      "成約=1失注=0の二値変換"
    );

    // (5) 成功パターン抽出情報が具体的知見を含む
    expect(result.success_pattern_insights).toContain("製品A提案時");
    expect(result.success_pattern_insights).toContain("15ポイント");

    // (6) Audit log記録の確認
    expect(result.audit_log_id).toBe("AUDIT_LOG_202406001");
    expect(mockAiClient.recordAuditLog).toHaveBeenCalled();

    // AIクライアント呼び出し検証
    expect(mockAiClient.analyzeCorrelation).toHaveBeenCalledWith(
      behavior_pattern,
      contract_result,
      standard_process
    );
  });
});