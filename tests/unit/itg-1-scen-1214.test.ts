import { runTx12Imp1Agent } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書との乖離分析と成約実績の相関分析機能', () => {
  test('SCEN-1214: 分析対象期間の開始日と終了日が同日のときに相関分析が実行される', async () => {
    // ============================================================================
    // 1. テスト用の注入済みFake AI Clientを初期化
    // ============================================================================
    const fakeAiClient = {
      analyzeDataQuality: jest.fn().mockResolvedValue({
        quality_score: 92,
        missing_count: 0,
        format_errors: 0,
        duplicate_count: 0,
        sample_size: 1,
      }),
      extractSalesData: jest.fn().mockResolvedValue([
        {
          date: '2024-01-15',
          sales_rep_id: 'REP001',
          contact_frequency: 1,
          proposal_count: 1,
          followup_interval_days: 0,
          customer_id: 'CUST001',
          deal_status: 'won',
          amount: 500000,
        },
      ]),
      analyzeActionPatterns: jest.fn().mockResolvedValue({
        rep_id: 'REP001',
        daily_contact_avg: 1,
        proposal_success_rate: 100,
        followup_interval_avg: 0,
        pattern_id: 'PAT_001',
      }),
      analyzeProcessDeviation: jest.fn().mockResolvedValue({
        rep_id: 'REP001',
        process_step_1_completion: 100,
        process_step_2_completion: 100,
        process_step_3_completion: 100,
        process_step_4_completion: 100,
        overall_compliance_rate: 100,
        deviation_score: 0,
      }),
      analyzeCorrelation: jest.fn().mockResolvedValue({
        sample_size: 1,
        correlation_coefficient: null,
        correlation_status: 'insufficient_sample',
        confidence_note:
          'correlation_analysis_cannot_compute_with_single_observation',
      }),
      generateReport: jest.fn().mockResolvedValue({
        report_id: 'RPT_20240115_001',
        analysis_period_start: '2024-01-15',
        analysis_period_end: '2024-01-15',
        data_quality_score: 92,
        process_compliance_rate: 100,
        correlation_analysis_result: null,
        correlation_limitation_note:
          'Data period is 1 day; correlation analysis confidence is low',
        dataset_summary: {
          sample_size: 1,
          date_range: '2024-01-15T00:00:00Z to 2024-01-15T23:59:59Z',
        },
        calculation_logic_recorded: true,
        improvement_proposals: [
          {
            category: 'data_collection',
            description:
              'Extend analysis period to minimum 30 days for reliable correlation',
            priority: 'high',
          },
        ],
      }),
      recordAuditEvent: jest.fn().mockResolvedValue({
        event_id: 'EVT_001',
        event_type: 'correlation_analysis_executed_with_single_day_dataset',
        timestamp: '2024-01-15T12:00:00Z',
        status: 'recorded',
      }),
      rollbackTransaction: jest.fn().mockResolvedValue({
        status: 'success',
      }),
    };

    // ============================================================================
    // 2. 分析対象期間の開始日と終了日に同じ日付を設定
    // ============================================================================
    const analysisStartDate = '2024-01-15';
    const analysisEndDate = '2024-01-15';

    // ============================================================================
    // 3. 月次営業会議トリガーを発火させ、runTx12Imp1Agent関数を呼び出す
    // ============================================================================
    const triggerContext = {
      trigger_type: 'monthly_meeting',
      triggered_at: '2024-01-15T09:00:00Z',
      triggered_by_user_id: 'MGMT001',
    };

    const agentInput = {
      analysis_start_date: analysisStartDate,
      analysis_end_date: analysisEndDate,
      trigger_context: triggerContext,
      ai_client: fakeAiClient,
    };

    // ============================================================================
    // 4. 実行
    // ============================================================================
    const result = await runTx12Imp1Agent(agentInput);

    // ============================================================================
    // (1) 営業データ品質スコアが算出される（サンプルサイズ=1の場合のスコア値を含む）
    // ============================================================================
    expect(result.data_quality_score).toBe(92);
    expect(result.dataset_summary.sample_size).toBe(1);

    // ============================================================================
    // (2) 単一日付の行動パターンが識別・記録される
    // ============================================================================
    expect(result.action_patterns).toBeDefined();
    expect(result.action_patterns.rep_id).toBe('REP001');
    expect(result.action_patterns.daily_contact_avg).toBe(1);
    expect(result.action_patterns.proposal_success_rate).toBe(100);

    // ============================================================================
    // (3) 乖離分析結果が出力される
    //    （当日の標準プロセス遵守率が0%～100%の数値で記録される）
    // ============================================================================
    expect(result.process_deviation_analysis).toBeDefined();
    expect(result.process_deviation_analysis.overall_compliance_rate).toBe(100);
    expect(typeof result.process_deviation_analysis.overall_compliance_rate).toBe(
      'number'
    );

    // ============================================================================
    // (4) 相関分析処理がサンプルサイズ不足として実行完了する
    //    （相関係数が「計算不可（N=1）」または「NA」と明示的に記録される）
    // ============================================================================
    expect(result.correlation_analysis_result).toBe(null);
    expect(result.correlation_analysis_status).toBe('insufficient_sample');
    expect(result.correlation_analysis_status).toMatch(/insufficient_sample/);

    // ============================================================================
    // (5) 改善提案が生成される
    //    （「データ期間が1日のため相関分析の信頼度は低い」という限定注記を含む）
    // ============================================================================
    expect(result.improvement_proposals).toBeDefined();
    expect(result.improvement_proposals.length).toBeGreaterThan(0);
    expect(result.correlation_limitation_note).toMatch(/1 day/);
    expect(result.correlation_limitation_note).toMatch(/correlation.*confidence.*low/i);

    // ============================================================================
    // (6) レポートの「分析対象期間」フィールドに「2024年1月15日～2024年1月15日」と記録される
    // ============================================================================
    expect(result.analysis_period_start).toBe('2024-01-15');
    expect(result.analysis_period_end).toBe('2024-01-15');

    // ============================================================================
    // (7) 監査ログに「correlation_analysis_executed_with_single_day_dataset」
    //    というイベントが記録される
    // ============================================================================
    expect(fakeAiClient.recordAuditEvent).toHaveBeenCalled();
    const auditEventCall = fakeAiClient.recordAuditEvent.mock.calls[0];
    expect(auditEventCall[0]).toMatchObject({
      event_type: 'correlation_analysis_executed_with_single_day_dataset',
    });

    // ============================================================================
    // 追加検証: 計算ロジックが記録されていることを確認
    // ============================================================================
    expect(result.dataset_summary).toBeDefined();
    expect(result.dataset_summary.date_range).toMatch(/2024-01-15/);

    // ============================================================================
    // 追加検証: Fake AI Clientのメソッドが期待通りに呼び出されたことを確認
    // ============================================================================
    expect(fakeAiClient.extractSalesData).toHaveBeenCalled();
    expect(fakeAiClient.analyzeDataQuality).toHaveBeenCalled();
    expect(fakeAiClient.analyzeActionPatterns).toHaveBeenCalled();
    expect(fakeAiClient.analyzeProcessDeviation).toHaveBeenCalled();
    expect(fakeAiClient.analyzeCorrelation).toHaveBeenCalled();
    expect(fakeAiClient.generateReport).toHaveBeenCalled();
  });
});