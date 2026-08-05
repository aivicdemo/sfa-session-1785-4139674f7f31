import { runTx2Imp2Agent } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  test('SCEN-1240: [normal] 営業プロセス遵守状況の自動監視と改善提案の実行 AIエージェント - 通常案件を人の都度承認なしで最後まで完了する', async () => {
    // 前置条件: 通常案件（プロセス遵守率が基準値以上、重大な逸脱なし）をスタブに登録
    const normal_case_id = 'CASE_20250115_001';
    const sales_rep_a_id = 'REP_A_001';
    const sales_rep_b_id = 'REP_B_001';
    const sales_rep_c_id = 'REP_C_001';
    const manager_id = 'MGR_001';
    const reference_date = new Date('2025-01-15T10:00:00Z');

    // スタブの営業活動データセット
    const stub_sales_activity_data = {
      case_id: normal_case_id,
      sales_reps: [
        {
          rep_id: sales_rep_a_id,
          rep_name: '営業担当者A',
          total_activities: 20,
          process_compliance_activities: 18,
          first_contact_done: true,
          proposal_submitted: true,
          follow_up_completed: true,
          compliance_score: 0.90,
        },
        {
          rep_id: sales_rep_b_id,
          rep_name: '営業担当者B',
          total_activities: 18,
          process_compliance_activities: 15,
          first_contact_done: true,
          proposal_submitted: true,
          follow_up_completed: true,
          compliance_score: 0.83,
        },
        {
          rep_id: sales_rep_c_id,
          rep_name: '営業担当者C',
          total_activities: 22,
          process_compliance_activities: 19,
          first_contact_done: true,
          proposal_submitted: true,
          follow_up_completed: true,
          compliance_score: 0.86,
        },
      ],
      baseline_compliance_rate: 0.85,
      has_critical_deviation: false,
      has_customer_complaint: false,
      has_contract_loss: false,
    };

    // スタブの成功事例データセット
    const stub_success_cases = [
      {
        case_id: 'SUCCESS_001',
        first_contact_items_count: 3,
        proposal_content: 'ニーズヒアリング + 提案資料提示 + タイムラインの共有',
        follow_up_interval_days: 3,
        contract_result: true,
      },
      {
        case_id: 'SUCCESS_002',
        first_contact_items_count: 4,
        proposal_content: 'ニーズヒアリング（詳細） + 競合比較 + ROI試算 + 実装計画',
        follow_up_interval_days: 5,
        contract_result: true,
      },
    ];

    // スタブの通知キュー、ダッシュボード更新イベント、マネージャー報告キュー
    const stub_notification_queue: any[] = [];
    const stub_dashboard_events: any[] = [];
    const stub_manager_report_queue: any[] = [];
    const stub_audit_log: any[] = [];

    // AIエージェント推論精度シミュレーション
    const expected_inference_confidence = 0.96;

    // runTx2Imp2Agent を実行
    const result = await runTx2Imp2Agent({
      case_id: normal_case_id,
      sales_activity_data: stub_sales_activity_data,
      success_cases: stub_success_cases,
      baseline_compliance_rate: 0.85,
      inference_confidence_threshold: 0.90,
      notification_queue: stub_notification_queue,
      dashboard_events: stub_dashboard_events,
      manager_report_queue: stub_manager_report_queue,
      audit_log: stub_audit_log,
      reference_timestamp: reference_date,
      manager_id: manager_id,
    });

    // ===== 検証開始 =====

    // 1. ステップ1: 営業活動データ収集・分析ステップを確認
    expect(result.step_1_activity_collection.completed).toBe(true);
    expect(result.step_1_activity_collection.reps_analyzed).toBe(3);
    expect(result.step_1_activity_collection.reps_analyzed).toEqual(
      stub_sales_activity_data.sales_reps.length
    );

    // 2. ステップ2: プロセス遵守状況の自動判定
    // 全担当者の遵守率が基準値以上（85%以上）か確認
    const compliance_results = result.step_2_compliance_judgement.compliance_results;
    expect(compliance_results).toHaveLength(3);

    const rep_a_compliance = compliance_results.find(
      (c: any) => c.rep_id === sales_rep_a_id
    );
    expect(rep_a_compliance.compliance_rate).toBe(0.90);
    expect(rep_a_compliance.meets_baseline).toBe(true);

    const rep_b_compliance = compliance_results.find(
      (c: any) => c.rep_id === sales_rep_b_id
    );
    expect(rep_b_compliance.compliance_rate).toBe(0.83);
    expect(rep_b_compliance.meets_baseline).toBe(false); // 基準値以下

    const rep_c_compliance = compliance_results.find(
      (c: any) => c.rep_id === sales_rep_c_id
    );
    expect(rep_c_compliance.compliance_rate).toBe(0.86);
    expect(rep_c_compliance.meets_baseline).toBe(true);

    // 全体遵守率: (0.90 + 0.83 + 0.86) / 3 = 0.863
    const team_overall_compliance = (0.90 + 0.83 + 0.86) / 3;
    expect(result.step_2_compliance_judgement.team_overall_compliance_rate).toBeCloseTo(
      team_overall_compliance,
      2
    );
    expect(result.step_2_compliance_judgement.no_critical_deviation).toBe(true);

    // 3. ステップ3: 改善機会検出
    // 軽微な改善機会のみが抽出されることを確認
    const improvement_opportunities =
      result.step_3_improvement_detection.opportunities;
    expect(improvement_opportunities).toHaveLength(1); // REP_B_001 のみ改善対象
    expect(improvement_opportunities[0].rep_id).toBe(sales_rep_b_id);
    expect(improvement_opportunities[0].severity).toBe('minor');
    expect(improvement_opportunities[0].deviation_percentage).toBeCloseTo(2, 1); // 85% - 83%

    // 4. ステップ4: 改善提案生成
    const generated_proposals = result.step_4_proposal_generation.proposals;
    expect(generated_proposals).toHaveLength(1);

    const proposal_for_rep_b = generated_proposals[0];
    expect(proposal_for_rep_b.rep_id).toBe(sales_rep_b_id);
    expect(proposal_for_rep_b.proposal_content).toContain(
      '初回接触時に顧客ニーズヒアリングを3項目以上実施'
    );
    expect(proposal_for_rep_b.proposal_content).toContain('提案資料提示');
    expect(proposal_for_rep_b.proposal_content).toContain('実装計画');

    // 5. ステップ5: 営業担当者への通知
    const notifications_sent = result.step_5_notification.notifications_sent;
    expect(notifications_sent).toBe(1); // REP_B_001 のみ
    expect(stub_notification_queue).toHaveLength(1);

    const notification_message = stub_notification_queue[0];
    expect(notification_message.recipient_rep_id).toBe(sales_rep_b_id);
    expect(notification_message.message_type).toBe('improvement_proposal');
    expect(notification_message.proposal_summary).toContain(
      '初回接触時に顧客ニーズヒアリングを3項目以上実施'
    );
    expect(notification_message.status).toBe('unconfirmed');

    // 6. ステップ6: 実行状況追跡
    const response_tracking = result.step_6_response_tracking;
    expect(response_tracking.tracking_initialized).toBe(true);
    expect(response_tracking.tracked_proposals).toBe(1);
    expect(response_tracking.initial_response_status).toBe('unconfirmed');

    // 7. ステップ7: ダッシュボード可視化
    const dashboard_update = result.step_7_dashboard_visualization;
    expect(dashboard_update.updated).toBe(true);
    expect(stub_dashboard_events).toHaveLength(1);

    const dashboard_event = stub_dashboard_events[0];
    expect(dashboard_event.event_type).toBe('process_compliance_update');
    expect(dashboard_event.team_compliance_rate).toBeCloseTo(
      team_overall_compliance,
      2
    );
    expect(dashboard_event.reps_analyzed).toBe(3);
    expect(dashboard_event.improvement_proposals_generated).toBe(1);
    expect(dashboard_event.timestamp).toEqual(reference_date);

    // ダッシュボードデータの詳細確認
    expect(dashboard_event.rep_analysis).toHaveLength(3);
    const rep_a_dashboard = dashboard_event.rep_analysis.find(
      (d: any) => d.rep_id === sales_rep_a_id
    );
    expect(rep_a_dashboard.compliance_rate).toBe(0.90);
    expect(rep_a_dashboard.status).toBe('compliant');

    // 8. ステップ8: マネージャー報告
    const manager_report = result.step_8_manager_report;
    expect(manager_report.report_generated).toBe(true);
    expect(stub_manager_report_queue).toHaveLength(1);

    const manager_msg = stub_manager_report_queue[0];
    expect(manager_msg.recipient_manager_id).toBe(manager_id);
    expect(manager_msg.case_id).toBe(normal_case_id);
    expect(manager_msg.processing_result).toBe('auto_completed');
    expect(manager_msg.processing_result_reason).toBe(
      'normal_case_within_baseline_compliance'
    );

    // マネージャー報告に改善提案サマリーが含まれることを確認
    expect(manager_msg.improvement_summary).toBeDefined();
    expect(manager_msg.improvement_summary.total_proposals).toBe(1);
    expect(manager_msg.improvement_summary.proposals[0].rep_name).toBe(
      '営業担当者B'
    );

    // マネージャー報告に推論精度が含まれることを確認
    expect(manager_msg.inference_confidence).toBeGreaterThanOrEqual(0.95);
    expect(manager_msg.inference_confidence).toBeLessThanOrEqual(1.0);

    // 9. エスカレーション条件が全て満たされていないことを確認
    const escalation_check = result.escalation_check;
    expect(escalation_check.has_critical_deviation).toBe(false);
    expect(escalation_check.has_execution_difficulty).toBe(false);
    expect(escalation_check.has_customer_complaint).toBe(false);
    expect(escalation_check.has_low_inference_confidence).toBe(false);
    expect(escalation_check.should_escalate).toBe(false);

    // 10. 関数が正常終了ステータスを返すことを確認
    expect(result.status).toBe('completed');
    expect(result.case_id).toBe(normal_case_id);
    expect(result.processed_at).toEqual(reference_date);
    expect(result.result_type).toBe('auto_completed');

    // 11. 監査ログに全ステップが時系列で記録されることを確認
    expect(stub_audit_log).toHaveLength(8); // 8 ステップ

    const audit_step_1 = stub_audit_log[0];
    expect(audit_step_1.step_number).toBe(1);
    expect(audit_step_1.step_name).toBe('activity_collection');
    expect(audit_step_1.status).toBe('completed');
    expect(audit_step_1.timestamp).toBeDefined();

    const audit_step_2 = stub_audit_log[1];
    expect(audit_step_2.step_number).toBe(2);
    expect(audit_step_2.step_name).toBe('compliance_judgement');
    expect(audit_step_2.status).toBe('completed');

    const audit_step_3 = stub_audit_log[2];
    expect(audit_step_3.step_number).toBe(3);
    expect(audit_step_3.step_name).toBe('improvement_detection');
    expect(audit_step_3.status).toBe('completed');

    const audit_step_4 = stub_audit_log[3];
    expect(audit_step_4.step_number).toBe(4);
    expect(audit_step_4.step_name).toBe('proposal_generation');
    expect(audit_step_4.status).toBe('completed');

    const audit_step_5 = stub_audit_log[4];
    expect(audit_step_5.step_number).toBe(5);
    expect(audit_step_5.step_name).toBe('notification');
    expect(audit_step_5.status).toBe('completed');

    const audit_step_6 = stub_audit_log[5];
    expect(audit_step_6.step_number).toBe(6);
    expect(audit_step_6.step_name).toBe('response_tracking');
    expect(audit_step_6.status).toBe('completed');

    const audit_step_7 = stub_audit_log[6];
    expect(audit_step_7.step_number).toBe(7);
    expect(audit_step_7.step_name).toBe('dashboard_visualization');
    expect(audit_step_7.status).toBe('completed');

    const audit_step_8 = stub_audit_log[7];
    expect(audit_step_8.step_number).toBe(8);
    expect(audit_step_8.step_name).toBe('manager_report');
    expect(audit_step_8.status).toBe('completed');

    // 監査ログに推論精度が記録されることを確認
    expect(audit_step_4.inference_confidence).toBeGreaterThanOrEqual(0.95);
    expect(audit_step_8.inference_confidence).toBeGreaterThanOrEqual(0.95);

    // 12. 監査ログの時系列順序を確認
    for (let i = 0; i < stub_audit_log.length - 1; i++) {
      const current_timestamp = new Date(stub_audit_log[i].timestamp).getTime();
      const next_timestamp = new Date(stub_audit_log[i + 1].timestamp).getTime();
      expect(current_timestamp).toBeLessThanOrEqual(next_timestamp);
    }

    // 13. 最終的な期待値の確認
    expect(result.step_7_dashboard_visualization.compliance_rate).toBeCloseTo(
      0.863,
      2
    );
    expect(result.step_8_manager_report.processing_result).toBe('auto_completed');
    expect(result.status).toBe('completed');
    expect(result.result_type).toBe('auto_completed');
  });
});