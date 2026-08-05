import { runTx12Imp1Agent } from "../../src/logic/it-1";

const fetchMock = require("jest-fetch-mock");

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  test("SCEN-1319: 改善提案の実行に予算や人員配置の変更が伴う場合に副作用確定前に人へ引き継ぐ", async () => {
    fetchMock.resetMocks();

    // テストデータセット準備: 営業データ品質チェック合格、標準プロセス遵守率85%、成約相関分析完了
    const test_data_quality_score = 95;
    const test_process_compliance_rate = 85;
    const test_correlation_analysis_completed = true;
    const test_monthly_meeting_trigger_date = "2024-01-15T09:00:00Z";
    const test_executive_review_queue_id = "queue_executive_review_20240115";
    const test_audit_log_id = "audit_tx12_20240115_001";

    // AIエージェント orchestrator に渡す入力パラメータ
    const orchestrator_input = {
      trigger_type: "monthly_meeting",
      trigger_timestamp: test_monthly_meeting_trigger_date,
      target_month: "2024-01",
      sales_team_id: "team_001",
      require_human_review: true,
    };

    // Mock: 営業データ品質チェック（欠損値・形式エラー・重複検出）
    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "quality_check_completed",
        data_quality_score: test_data_quality_score,
        missing_fields_count: 0,
        format_errors_count: 0,
        duplicate_detections_count: 0,
        check_timestamp: "2024-01-15T09:05:00Z",
      }),
      { status: 200 }
    );

    // Mock: 営業担当者ごとの行動パターン分析
    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "behavior_pattern_analysis_completed",
        patterns_extracted: 5,
        contact_frequency_avg: 3.2,
        proposal_success_rate: 0.68,
        follow_up_interval_days_avg: 4.5,
        analysis_timestamp: "2024-01-15T09:15:00Z",
      }),
      { status: 200 }
    );

    // Mock: 営業プロセス標準書との乖離分析
    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "process_compliance_analysis_completed",
        compliance_rate: test_process_compliance_rate,
        deviation_points: [
          {
            step_name: "initial_contact",
            compliance_rate: 92,
            deviation_description: "初回接触頻度が標準を下回る",
          },
          {
            step_name: "proposal",
            compliance_rate: 78,
            deviation_description: "提案内容の品質がばらつき",
          },
        ],
        analysis_timestamp: "2024-01-15T09:25:00Z",
      }),
      { status: 200 }
    );

    // Mock: 成約実績との相関分析
    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "correlation_analysis_completed",
        correlation_coefficient: 0.76,
        success_patterns_identified: 3,
        high_correlation_factors: [
          "contact_frequency",
          "proposal_quality",
          "follow_up_timing",
        ],
        analysis_timestamp: "2024-01-15T09:35:00Z",
      }),
      { status: 200 }
    );

    // Mock: 分析結果統合フェーズ - 改善提案生成
    // ここで「予算・人員配置変更を伴う改善提案」を含むレスポンスを返却
    const improvement_proposals_with_escalation = {
      status: "analysis_complete_with_escalation",
      proposals: [
        {
          proposal_id: "prop_001",
          title: "営業チーム編成の人員配置変更と新規研修予算の確保",
          description:
            "標準プロセス遵守率85%を90%まで向上させるため、経験浅い営業3名を経験者とペアリングし、新規研修予算50万円を確保",
          impact_level: "high",
          required_budget: 500000,
          required_headcount_change: 3,
          requires_budget_approval: true,
          requires_headcount_approval: true,
          escalation_reason:
            "改善提案の実行に予算や人員配置の変更が伴う場合",
          estimated_roi: 1.8,
          implementation_timeline_weeks: 4,
        },
        {
          proposal_id: "prop_002",
          title: "提案品質向上トレーニング",
          description: "提案内容品質のばらつき（78%準拠率）を85%以上に改善",
          impact_level: "medium",
          required_budget: 0,
          required_headcount_change: 0,
          requires_budget_approval: false,
          requires_headcount_approval: false,
          escalation_reason: null,
          estimated_roi: 1.5,
          implementation_timeline_weeks: 2,
        },
      ],
      escalation_conditions: [
        {
          condition_type: "budget_or_headcount_change",
          triggered: true,
          proposal_ids: ["prop_001"],
          severity: "high",
        },
      ],
      analysis_timestamp: "2024-01-15T09:45:00Z",
      data_snapshot: {
        quality_score: test_data_quality_score,
        compliance_rate: test_process_compliance_rate,
        correlation_coefficient: 0.76,
      },
      calculation_logic_record: {
        compliance_gap_calculation:
          "(90 - 85) / 85 * 100 = 5.88% improvement needed",
        budget_estimation:
          "hourly_rate * weeks * days * hours + training_materials",
        headcount_change_justification: "3 junior_salespeople * 1 mentor_ratio",
        roi_calculation: "annual_revenue_increase / implementation_cost",
      },
    };

    fetchMock.mockResponseOnce(JSON.stringify(improvement_proposals_with_escalation), {
      status: 200,
    });

    // Mock: 引き継ぎパッケージ格納（営業管理者向けキュー）
    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "handoff_package_stored",
        handoff_queue_id: test_executive_review_queue_id,
        stored_timestamp: "2024-01-15T09:50:00Z",
        escalation_proposals_count: 1,
        awaiting_approval_status: "pending_executive_review",
      }),
      { status: 200 }
    );

    // Mock: Audit log 記録
    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "audit_event_recorded",
        audit_log_id: test_audit_log_id,
        event_type: "ESCALATION_TRIGGERED",
        event_description:
          "予算・人員配置変更を伴う改善提案の引き継ぎ実行",
        triggered_at: "2024-01-15T09:50:30Z",
        escalation_reason:
          "改善提案の実行に予算や人員配置の変更が伴う場合",
        handoff_queue_id: test_executive_review_queue_id,
        system_state_before_escalation: "analysis_complete",
        system_state_after_escalation: "awaiting_human_approval",
      }),
      { status: 200 }
    );

    // AIエージェント orchestrator を実行
    const agent_result = await runTx12Imp1Agent(orchestrator_input);

    // 期待値: 副作用確定前に人へ引き継いだことを確認

    // 1. escalation_conditions 配列に「予算・人員配置変更を伴う改善提案」フラグが立っていることを確認
    expect(agent_result.escalation_detected).toBe(true);
    expect(agent_result.escalation_conditions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          condition_type: "budget_or_headcount_change",
          triggered: true,
          severity: "high",
        }),
      ])
    );

    // 2. AIエージェントがレポート生成を一時停止し、人への引き継ぎ処理を実行したことを確認
    expect(agent_result.execution_state).toBe("awaiting_human_approval");
    expect(agent_result.report_generation_suspended).toBe(true);
    expect(agent_result.handoff_executed).toBe(true);

    // 3. 引き継ぎパッケージが営業管理者向けキューに格納されたことを確認
    expect(agent_result.handoff_package).toEqual({
      queue_id: test_executive_review_queue_id,
      escalation_proposals: expect.arrayContaining([
        expect.objectContaining({
          proposal_id: "prop_001",
          title: "営業チーム編成の人員配置変更と新規研修予算の確保",
          required_budget: 500000,
          required_headcount_change: 3,
        }),
      ]),
      data_snapshot: {
        quality_score: test_data_quality_score,
        compliance_rate: test_process_compliance_rate,
        correlation_coefficient: 0.76,
      },
      calculation_logic_record: expect.objectContaining({
        compliance_gap_calculation: expect.any(String),
        budget_estimation: expect.any(String),
        headcount_change_justification: expect.any(String),
        roi_calculation: expect.any(String),
      }),
      handoff_timestamp: "2024-01-15T09:50:00Z",
    });

    // 4. Audit log に引き継ぎ実行イベントが記録されていることを確認
    expect(agent_result.audit_log_events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event_type: "ESCALATION_TRIGGERED",
          event_description: "予算・人員配置変更を伴う改善提案の引き継ぎ実行",
          audit_log_id: test_audit_log_id,
          system_state_before_escalation: "analysis_complete",
          system_state_after_escalation: "awaiting_human_approval",
        }),
      ])
    );

    // 5. AIエージェントが営業部長承認待ち状態に遷移したことを確認
    expect(agent_result.approval_status).toBe("pending_executive_review");
    expect(agent_result.next_action_required).toBe(true);
    expect(agent_result.next_action_actor).toBe("executive_manager");

    // 6. レポート全体の営業管理者への提示が行われていないことを確認
    expect(agent_result.report_delivered_to_manager).toBe(false);
    expect(agent_result.report_generation_completed).toBe(false);

    // 7. Fetch 呼び出しが7回（データ品質チェック、行動パターン分析、乖離分析、相関分析、改善提案生成、引き継ぎパッケージ格納、Audit log記録）行われたことを確認
    expect(fetchMock.mock.calls.length).toBe(7);
  });
});