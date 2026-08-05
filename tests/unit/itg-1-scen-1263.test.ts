import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  test("SCEN-1263: ヘルスチェック・データ品質・推論精度の統合診断と異常集約の自律実行", async () => {
    // 注入済みフェイクAIクライアントの初期化
    const fake_ai_client = {
      async callHealthCheckDiagnosis(input: {
        timestamp: string;
      }): Promise<HealthCheckDiagnosisResult> {
        return {
          status: "degraded",
          cpu_utilization: 85,
          memory_utilization: 78,
          disk_utilization: 72,
          system_up_time_hours: 720,
          last_error_timestamp: "2024-01-15T09:30:00Z",
          error_message: "Database connection timeout",
        };
      },

      async callDataQualityAnalysis(input: {
        timestamp: string;
      }): Promise<DataQualityAnalysisResult> {
        return {
          quality_score: 68,
          completeness_score: 72,
          accuracy_score: 65,
          consistency_score: 70,
          issues_detected: [
            {
              field_name: "customer_id",
              issue_type: "missing_value",
              count: 42,
              severity: "high",
            },
            {
              field_name: "sales_amount",
              issue_type: "format_error",
              count: 18,
              severity: "medium",
            },
          ],
        };
      },

      async callInferenceAccuracyEvaluation(input: {
        timestamp: string;
      }): Promise<InferenceAccuracyEvaluationResult> {
        return {
          overall_accuracy: 87,
          baseline_accuracy: 95,
          accuracy_change_percent: -8,
          model_predictions_count: 1250,
          correct_predictions_count: 1087,
          evaluation_period_days: 7,
        };
      },

      async callIntegratedAnalysis(input: {
        health_check_result: HealthCheckDiagnosisResult;
        data_quality_result: DataQualityAnalysisResult;
        inference_accuracy_result: InferenceAccuracyEvaluationResult;
        anomaly_rules: AnomalyRule[];
        priority_rules: PriorityRule[];
      }): Promise<IntegratedAnalysisResult> {
        const anomalies: AnomalyClassification[] = [];

        // システムヘルスチェック関連の異常分類
        if (input.health_check_result.cpu_utilization > 80) {
          anomalies.push({
            category: "system_health",
            type: "high_cpu_utilization",
            severity: 8,
            description: "CPU utilization exceeds 80% threshold",
            impact_scope: "All system operations",
            root_cause_hypothesis: "Database query optimization needed",
            affected_components: ["database_service", "api_gateway"],
          });
        }

        // データ品質関連の異常分類
        if (input.data_quality_result.quality_score < 70) {
          anomalies.push({
            category: "data_quality",
            type: "low_quality_score",
            severity: 7,
            description: "Data quality score 68 is below threshold 70",
            impact_scope: "Sales process analysis accuracy",
            root_cause_hypothesis:
              "Missing customer_id values in recent data load",
            affected_components: ["customer_data", "sales_data"],
          });
        }

        // 推論精度関連の異常分類
        if (
          input.inference_accuracy_result.accuracy_change_percent < -7
        ) {
          anomalies.push({
            category: "inference_accuracy",
            type: "accuracy_degradation",
            severity: 6,
            description:
              "Model accuracy dropped 8% from baseline 95% to 87%",
            impact_scope: "AI agent recommendations reliability",
            root_cause_hypothesis: "Training data distribution shift",
            affected_components: ["ml_model", "inference_engine"],
          });
        }

        // 優先度判定ルール適用
        const sorted_anomalies = anomalies.sort(
          (a, b) => b.severity - a.severity
        );

        const highest_severity =
          sorted_anomalies.length > 0 ? sorted_anomalies[0].severity : 0;
        let priority_level: "high" | "medium" | "low";
        if (highest_severity >= 8) {
          priority_level = "high";
        } else if (highest_severity >= 6) {
          priority_level = "medium";
        } else {
          priority_level = "low";
        }

        const multi_domain_detected = new Set(
          anomalies.map((a) => a.category)
        ).size > 1;

        return {
          anomalies_classified: sorted_anomalies,
          priority_level,
          is_multi_domain: multi_domain_detected,
          aggregation_timestamp: "2024-01-15T10:00:00Z",
        };
      },

      async callReportGeneration(input: {
        integrated_analysis: IntegratedAnalysisResult;
        report_template: string;
      }): Promise<DiagnosisReport> {
        const anomaly_category =
          input.integrated_analysis.is_multi_domain
            ? "multi_domain"
            : input.integrated_analysis.anomalies_classified.length > 0
              ? (input.integrated_analysis.anomalies_classified[0]
                  .category as AnomalyCategoryType)
              : "system_health";

        const severity =
          input.integrated_analysis.anomalies_classified.length > 0
            ? input.integrated_analysis.anomalies_classified[0].severity
            : 3;

        const recommended_actions = input.integrated_analysis.anomalies_classified
          .slice(0, 3)
          .map((anomaly) => {
            if (anomaly.category === "system_health") {
              return "Increase database connection pool and optimize slow queries";
            } else if (anomaly.category === "data_quality") {
              return "Implement validation rules to prevent missing customer_id entries in ETL pipeline";
            } else {
              return "Retrain model with recent data and validate accuracy metrics";
            }
          });

        return {
          priority_level: input.integrated_analysis.priority_level,
          anomaly_category,
          severity,
          impact_scope:
            input.integrated_analysis.anomalies_classified.length > 0
              ? input.integrated_analysis.anomalies_classified[0]
                  .impact_scope
              : "No anomalies detected",
          root_cause_description:
            input.integrated_analysis.anomalies_classified.length > 0
              ? input.integrated_analysis.anomalies_classified[0]
                  .root_cause_hypothesis
              : "System operating normally",
          recommended_actions,
          generated_at: "2024-01-15T10:00:30Z",
          requires_human_review:
            input.integrated_analysis.priority_level === "high",
        };
      },
    };

    // 異常判定ルール定義
    const anomaly_rules: AnomalyRule[] = [
      {
        rule_id: "cpu_utilization",
        threshold: 80,
        operator: ">",
        category: "system_health",
        severity_weight: 8,
      },
      {
        rule_id: "data_quality_score",
        threshold: 70,
        operator: "<",
        category: "data_quality",
        severity_weight: 7,
      },
      {
        rule_id: "inference_accuracy_change",
        threshold: -7,
        operator: "<",
        category: "inference_accuracy",
        severity_weight: 6,
      },
    ];

    // 優先度ルール定義
    const priority_rules: PriorityRule[] = [
      {
        priority_id: "critical_system_down",
        condition: "system_status === 'down'",
        priority_level: "high",
        require_escalation: true,
      },
      {
        priority_id: "high_severity_multi_domain",
        condition: "max_severity >= 8 && domain_count > 1",
        priority_level: "high",
        require_escalation: true,
      },
      {
        priority_id: "medium_severity_data_quality",
        condition: "category === 'data_quality' && severity >= 6",
        priority_level: "medium",
        require_escalation: false,
      },
    ];

    // トリガー条件: 定期スケジュール検知をシミュレート
    const trigger_timestamp = "2024-01-15T10:00:00Z";

    // ステップ1: 3つの診断を並列実行
    const health_check_result =
      await fake_ai_client.callHealthCheckDiagnosis({
        timestamp: trigger_timestamp,
      });
    const data_quality_result =
      await fake_ai_client.callDataQualityAnalysis({
        timestamp: trigger_timestamp,
      });
    const inference_accuracy_result =
      await fake_ai_client.callInferenceAccuracyEvaluation({
        timestamp: trigger_timestamp,
      });

    // ステップ2: 統合分析実行
    const integrated_analysis_result =
      await fake_ai_client.callIntegratedAnalysis({
        health_check_result,
        data_quality_result,
        inference_accuracy_result,
        anomaly_rules,
        priority_rules,
      });

    // ステップ3: 報告書生成
    const diagnosis_report = await fake_ai_client.callReportGeneration({
      integrated_analysis: integrated_analysis_result,
      report_template: "standard_diagnostic_report",
    });

    // 検証: 報告書の構造を確認
    expect(diagnosis_report).toHaveProperty("priority_level");
    expect(diagnosis_report).toHaveProperty("anomaly_category");
    expect(diagnosis_report).toHaveProperty("severity");
    expect(diagnosis_report).toHaveProperty("impact_scope");
    expect(diagnosis_report).toHaveProperty("root_cause_description");
    expect(diagnosis_report).toHaveProperty("recommended_actions");
    expect(diagnosis_report).toHaveProperty("generated_at");
    expect(diagnosis_report).toHaveProperty("requires_human_review");

    // 検証: 優先度レベルが正しく設定されている
    expect(diagnosis_report.priority_level).toBe("high");

    // 検証: 異常カテゴリが複数ドメイン検出を反映
    expect(diagnosis_report.anomaly_category).toBe("multi_domain");

    // 検証: 重大度が最高の異常の重大度を反映（8）
    expect(diagnosis_report.severity).toBe(8);

    // 検証: 推奨アクションが配列で存在
    expect(Array.isArray(diagnosis_report.recommended_actions)).toBe(true);
    expect(diagnosis_report.recommended_actions.length).toBeGreaterThan(0);
    expect(typeof diagnosis_report.recommended_actions[0]).toBe("string");
    expect(
      diagnosis_report.recommended_actions[0].length
    ).toBeGreaterThan(0);

    // 検証: タイムスタンプがISO8601形式
    expect(diagnosis_report.generated_at).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );

    // 検証: 高優先度異常はhuman_reviewが必須
    expect(diagnosis_report.requires_human_review).toBe(true);

    // 検証: 統合分析で複数ドメインの異常が検出されたことを確認
    expect(integrated_analysis_result.is_multi_domain).toBe(true);

    // 検証: 複数の異常が優先度順にソートされている
    expect(integrated_analysis_result.anomalies_classified.length).toBe(3);
    expect(
      integrated_analysis_result.anomalies_classified[0].severity
    ).toBeGreaterThanOrEqual(
      integrated_analysis_result.anomalies_classified[1].severity
    );
    expect(
      integrated_analysis_result.anomalies_classified[1].severity
    ).toBeGreaterThanOrEqual(
      integrated_analysis_result.anomalies_classified[2].severity
    );

    // 検証: データ品質スコア68%が低品質異常として分類
    const data_quality_anomaly =
      integrated_analysis_result.anomalies_classified.find(
        (a) => a.category === "data_quality"
      );
    expect(data_quality_anomaly).toBeDefined();
    expect(data_quality_anomaly?.severity).toBe(7);
    expect(data_quality_anomaly?.type).toBe("low_quality_score");

    // 検証: 推論精度が8%低下したことが中優先度異常として分類
    const accuracy_anomaly =
      integrated_analysis_result.anomalies_classified.find(
        (a) => a.category === "inference_accuracy"
      );
    expect(accuracy_anomaly).toBeDefined();
    expect(accuracy_anomaly?.severity).toBe(6);
    expect(accuracy_anomaly?.type).toBe("accuracy_degradation");

    // 検証: CPU高利用が高優先度異常として分類
    const system_anomaly =
      integrated_analysis_result.anomalies_classified.find(
        (a) => a.category === "system_health"
      );
    expect(system_anomaly).toBeDefined();
    expect(system_anomaly?.severity).toBe(8);
    expect(system_anomaly?.type).toBe("high_cpu_utilization");

    // 検証: 推奨アクションが実装可能な内容
    expect(diagnosis_report.recommended_actions[0]).toMatch(
      /database|connection|query/i
    );

    // 検証: 影響範囲が具体的に説明されている
    expect(diagnosis_report.impact_scope.length).toBeGreaterThan(0);
    expect(diagnosis_report.impact_scope).toMatch(/[A-Za-z]/);

    // 検証: 根本原因仮説が記述されている
    expect(diagnosis_report.root_cause_description.length).toBeGreaterThan(0);
  });
});

// 型定義
interface HealthCheckDiagnosisResult {
  status: string;
  cpu_utilization: number;
  memory_utilization: number;
  disk_utilization: number;
  system_up_time_hours: number;
  last_error_timestamp: string;
  error_message: string;
}

interface DataQualityAnalysisResult {
  quality_score: number;
  completeness_score: number;
  accuracy_score: number;
  consistency_score: number;
  issues_detected: Array<{
    field_name: string;
    issue_type: string;
    count: number;
    severity: string;
  }>;
}

interface InferenceAccuracyEvaluationResult {
  overall_accuracy: number;
  baseline_accuracy: number;
  accuracy_change_percent: number;
  model_predictions_count: number;
  correct_predictions_count: number;
  evaluation_period_days: number;
}

interface AnomalyClassification {
  category: string;
  type: string;
  severity: number;
  description: string;
  impact_scope: string;
  root_cause_hypothesis: string;
  affected_components: string[];
}

interface IntegratedAnalysisResult {
  anomalies_classified: AnomalyClassification[];
  priority_level: "high" | "medium" | "low";
  is_multi_domain: boolean;
  aggregation_timestamp: string;
}

type AnomalyCategoryType =
  | "system_health"
  | "data_quality"
  | "inference_accuracy"
  | "multi_domain";

interface DiagnosisReport {
  priority_level: "high" | "medium" | "low";
  anomaly_category: AnomalyCategoryType;
  severity: number;
  impact_scope: string;
  root_cause_description: string;
  recommended_actions: string[];
  generated_at: string;
  requires_human_review: boolean;
}

interface AnomalyRule {
  rule_id: string;
  threshold: number;
  operator: string;
  category: string;
  severity_weight: number;
}

interface PriorityRule {
  priority_id: string;
  condition: string;
  priority_level: string;
  require_escalation: boolean;
}