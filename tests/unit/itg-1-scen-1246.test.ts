import { runTx2Imp2Agent } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1246
  test('重大なプロセス逸脱検出時にマネージャーへエスカレーション', async () => {
    const mockAiClient = {
      analyzeProcessCompliance: jest.fn().mockResolvedValue({
        compliance_status: 'critical_deviation_detected',
        deviation_type: 'critical_process_violation',
        affected_sales_rep_ids: ['SR001', 'SR002'],
        severity_level: 'critical',
        deviation_details: {
          skipped_initial_contact: true,
          proposal_quality_score: 25,
          followup_gap_days: 45,
        },
        confidence_score: 0.98,
        timestamp: new Date('2024-02-15T10:30:00Z').toISOString(),
      }),
      generateImprovementProposal: jest.fn(),
      notifySalesRepresentative: jest.fn(),
      updateDashboard: jest.fn(),
    };

    const mockAuditLogger = {
      logEvent: jest.fn(),
    };

    const sales_activity_data = {
      period_start: '2024-02-01',
      period_end: '2024-02-15',
      sales_reps: [
        {
          sales_rep_id: 'SR001',
          initial_contact_completed: false,
          proposal_submitted: true,
          proposal_quality_score: 25,
          last_followup_date: '2024-01-01',
          days_since_last_contact: 45,
        },
        {
          sales_rep_id: 'SR002',
          initial_contact_completed: true,
          proposal_submitted: false,
          proposal_quality_score: null,
          last_followup_date: '2024-01-20',
          days_since_last_contact: 26,
        },
      ],
    };

    const result = await runTx2Imp2Agent({
      ai_client: mockAiClient,
      audit_logger: mockAuditLogger,
      sales_activity_data,
    });

    // エスカレーション条件判定が実行されたことを確認
    expect(mockAiClient.analyzeProcessCompliance).toHaveBeenCalledWith(sales_activity_data);

    // 重大なプロセス逸脱が検出されたことを確認
    expect(result.escalation_triggered).toBe(true);
    expect(result.escalation_reason).toBe('critical_process_deviation_detected');

    // 改善提案の自動生成・通知が実行されないことを確認
    expect(mockAiClient.generateImprovementProposal).not.toHaveBeenCalled();
    expect(mockAiClient.notifySalesRepresentative).not.toHaveBeenCalled();
    expect(mockAiClient.updateDashboard).not.toHaveBeenCalled();

    // マネージャーへの引き継ぎ情報が正しく構成されていることを確認
    expect(result.escalation_info).toEqual({
      deviation_type: 'critical_process_violation',
      affected_sales_rep_ids: ['SR001', 'SR002'],
      severity_level: 'critical',
      deviation_details: {
        skipped_initial_contact: true,
        proposal_quality_score: 25,
        followup_gap_days: 45,
      },
      confidence_score: 0.98,
      escalated_to: 'manager_review',
      timestamp: '2024-02-15T10:30:00Z',
    });

    // エージェント実行状態がescalated_pending_human_reviewになっていることを確認
    expect(result.agent_state).toBe('escalated_pending_human_review');

    // 監査ログにエスカレーションイベントが記録されていることを確認
    expect(mockAuditLogger.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: 'escalation_triggered',
        reason: 'critical_process_deviation_detected',
        escalated_to: 'manager_review',
        affected_sales_rep_ids: ['SR001', 'SR002'],
        severity_level: 'critical',
        timestamp: '2024-02-15T10:30:00Z',
      })
    );

    // 副作用が確定していない状態であることを確認
    expect(result.pending_actions).toEqual([
      'generate_improvement_proposal',
      'notify_sales_representative',
      'update_dashboard',
    ]);

    // マネージャーの確認待ち状態であることを確認
    expect(result.requires_manager_approval).toBe(true);
  });
});