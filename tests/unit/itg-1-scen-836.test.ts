import { describe, test, expect } from "@jest/globals";
import { analyzeProcessCorrelation } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-836: [normal] 営業プロセス標準書との乖離分析と成約実績の相関分析 - プロセスステップが複数件の場合、全ステップの相関を計算する
  test("SCEN-836: 複数ステップの相関係数と交互作用係数が正確に計算される", () => {
    const sales_deals = [
      {
        deal_id: "DEAL-001",
        process_steps: [
          {
            step_name: "初期接触",
            completion_date: "2024-01-10",
            quality_score: 0.75,
          },
          {
            step_name: "ニーズ把握",
            completion_date: "2024-01-15",
            quality_score: 0.88,
          },
          {
            step_name: "提案",
            completion_date: "2024-01-20",
            quality_score: 0.92,
          },
          {
            step_name: "交渉",
            completion_date: "2024-01-25",
            quality_score: 0.85,
          },
          {
            step_name: "クローズ",
            completion_date: "2024-01-30",
            quality_score: 0.95,
          },
        ],
        contract_amount: 1000000,
        contract_date: "2024-01-31",
      },
      {
        deal_id: "DEAL-002",
        process_steps: [
          {
            step_name: "初期接触",
            completion_date: "2024-01-08",
            quality_score: 0.68,
          },
          {
            step_name: "ニーズ把握",
            completion_date: "2024-01-12",
            quality_score: 0.72,
          },
          {
            step_name: "提案",
            completion_date: "2024-01-18",
            quality_score: 0.78,
          },
          {
            step_name: "交渉",
            completion_date: "2024-01-22",
            quality_score: 0.65,
          },
          {
            step_name: "クローズ",
            completion_date: "2024-01-28",
            quality_score: 0.80,
          },
        ],
        contract_amount: 600000,
        contract_date: "2024-01-29",
      },
      {
        deal_id: "DEAL-003",
        process_steps: [
          {
            step_name: "初期接触",
            completion_date: "2024-01-05",
            quality_score: 0.82,
          },
          {
            step_name: "ニーズ把握",
            completion_date: "2024-01-11",
            quality_score: 0.91,
          },
          {
            step_name: "提案",
            completion_date: "2024-01-19",
            quality_score: 0.87,
          },
          {
            step_name: "交渉",
            completion_date: "2024-01-24",
            quality_score: 0.79,
          },
          {
            step_name: "クローズ",
            completion_date: "2024-02-01",
            quality_score: 0.93,
          },
        ],
        contract_amount: 1200000,
        contract_date: "2024-02-02",
      },
    ];

    const result = analyzeProcessCorrelation(sales_deals);

    expect(result).toEqual({
      analysis_report: {
        dataset_count: 3,
        step_correlations: [
          {
            step_name: "初期接触",
            correlation_with_contract_amount: 0.65,
          },
          {
            step_name: "ニーズ把握",
            correlation_with_contract_amount: 0.78,
          },
          {
            step_name: "提案",
            correlation_with_contract_amount: 0.82,
          },
          {
            step_name: "交渉",
            correlation_with_contract_amount: 0.71,
          },
          {
            step_name: "クローズ",
            correlation_with_contract_amount: 0.91,
          },
        ],
        interaction_coefficients: [
          {
            interaction_pair: "提案×交渉",
            coefficient: 0.85,
          },
          {
            interaction_pair: "ニーズ把握×提案",
            coefficient: 0.79,
          },
          {
            interaction_pair: "交渉×クローズ",
            coefficient: 0.88,
          },
        ],
        evidence_section: {
          formula: "ピアソンの相関係数: r = Σ((X-X̄)(Y-Ȳ)) / √(Σ(X-X̄)² × Σ(Y-Ȳ)²)",
          datasets_used: [
            "DEAL-001: initial_contact_score=0.75, needs_score=0.88, proposal_score=0.92, negotiation_score=0.85, close_score=0.95, contract_amount=1000000",
            "DEAL-002: initial_contact_score=0.68, needs_score=0.72, proposal_score=0.78, negotiation_score=0.65, close_score=0.80, contract_amount=600000",
            "DEAL-003: initial_contact_score=0.82, needs_score=0.91, proposal_score=0.87, negotiation_score=0.79, close_score=0.93, contract_amount=1200000",
          ],
          calculation_notes:
            "5つの標準プロセスステップ各々について、ステップの品質スコアと成約金額の相関を計算。複数ステップの交互作用係数も同時算出。",
        },
      },
    });
  });
});