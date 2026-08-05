import { runTx12Imp1Agent } from '../../src/agents/tx-12-imp-1/orchestrator';
import type { Tx12Imp1AiClient } from '../../src/agents/tx-12-imp-1/ai-client';

describe('営業データ分析から乖離検出までの自律実行 AIエージェント', () => {
  // SCEN-1313
  test('[normal] 営業データ分析から乖離検出までの自律実行が月次営業会議トリガーから成功パターン抽出・レポート提示まで完結する', async () => {
    // ========================================
    // 1. モックAIクライアント実装
    // ========================================
    const mockAiClient: Tx12Imp1AiClient = {
      extractMonthlyData: jest.fn(async (params) => ({
        sales_reps: [
          { rep_id: 'SR001', rep_name: '営業太郎' },
          { rep_id: 'SR002', rep_name: '営業花子' },
          { rep_id: 'SR003', rep_name: '営業次郎' },
        ],
        transactions: [
          {
            transaction_id: 'TXN001',
            rep_id: 'SR001',
            customer_id: 'CUST001',
            contact_date: '2024-01-10T09:00:00Z',
            contact_type: 'initial_meeting',
            proposal_content: '新商品A紹介',
            followup_interval_days: 5,
            closed_flag: 1,
            deal_amount: 500000,
          },
          {
            transaction_id: 'TXN002',
            rep_id: 'SR001',
            customer_id: 'CUST002',
            contact_date: '2024-01-12T10:30:00Z',
            contact_type: 'proposal',
            proposal_content: 'プラン詳細説明',
            followup_interval_days: 3,
            closed_flag: 1,
            deal_amount: 750000,
          },
          {
            transaction_id: 'TXN003',
            rep_id: 'SR002',
            customer_id: 'CUST003',
            contact_date: '2024-01-15T14:00:00Z',
            contact_type: 'initial_meeting',
            proposal_content: '商品B紹介',
            followup_interval_days: 7,
            closed_flag: 0,
            deal_amount: 0,
          },
          {
            transaction_id: 'TXN004',
            rep_id: 'SR002',
            customer_id: 'CUST004',
            contact_date: '2024-01-18T11:00:00Z',
            contact_type: 'closing',
            proposal_content: '契約条件確認',
            followup_interval_days: 2,
            closed_flag: 1,
            deal_amount: 1200000,
          },
          {
            transaction_id: 'TXN005',
            rep_id: 'SR003',
            customer_id: 'CUST005',
            contact_date: '2024-01-20T15:30:00Z',
            contact_type: 'followup',
            proposal_content: 'フォローアップ',
            followup_interval_days: 10,
            closed_flag: 0,
            deal_amount: 0,
          },
        ],
        data_period: { year: 2024, month: 1 },
      })),

      validateDataQuality: jest.fn(async (params) => ({
        quality_score: 0.97,
        missing_values_count: 1,
        format_errors_count: 0,
        duplicate_records_count: 0,
        status: 'passed',
      })),

      analyzeRepBehaviorPatterns: jest.fn(async (params) => ({
        reps_patterns: [
          {
            rep_id: 'SR001',
            contact_frequency_per_month: 2.0,
            proposal_content_distribution: {
              initial_meeting: 0.5,
              proposal: 0.5,
              followup: 0.0,
              closing: 0.0,
            },
            avg_followup_interval_days: 4.0,
            avg_deal_amount_closed: 625000,
            close_rate: 1.0,
          },
          {
            rep_id: 'SR002',
            contact_frequency_per_month: 2.0,
            proposal_content_distribution: {
              initial_meeting: 0.5,
              proposal: 0.0,
              followup: 0.0,
              closing: 0.5,
            },
            avg_followup_interval_days: 4.5,
            avg_deal_amount_closed: 1200000,
            close_rate: 0.5,
          },
          {
            rep_id: 'SR003',
            contact_frequency_per_month: 1.0,
            proposal_content_distribution: {
              initial_meeting: 0.0,
              proposal: 0.0,
              followup: 1.0,
              closing: 0.0,
            },
            avg_followup_interval_days: 10.0,
            avg_deal_amount_closed: 0,
            close_rate: 0.0,
          },
        ],
      })),

      compareWithStandardProcess: jest.fn(async (params) => ({
        process_compliance: [
          {
            rep_id: 'SR001',
            compliance_rate: 0.95,
            deviations: [
              {
                step: 'initial_meeting',
                status: 'compliant',
              },
              {
                step: 'hearing',
                status: 'skipped',
              },
              {
                step: 'proposal',
                status: 'compliant',
              },
              {
                step: 'closing',
                status: 'compliant',
              },
            ],
          },
          {
            rep_id: 'SR002',
            compliance_rate: 0.75,
            deviations: [
              {
                step: 'initial_meeting',
                status: 'compliant',
              },
              {
                step: 'hearing',
                status: 'compliant',
              },
              {
                step: 'proposal',
                status: 'skipped',
              },
              {
                step: 'closing',
                status: 'compliant',
              },
            ],
          },
          {
            rep_id: 'SR003',
            compliance_rate: 0.5,
            deviations: [
              {
                step: 'initial_meeting',
                status: 'skipped',
              },
              {
                step: 'hearing',
                status: 'skipped',
              },
              {
                step: 'proposal',
                status: 'skipped',
              },
              {
                step: 'closing',
                status: 'skipped',
              },
            ],
          },
        ],
      })),

      analyzeCorrelation: jest.fn(async (params) => ({
        correlation_analysis: {
          correlation_coefficient: 0.78,
          confidence_score: 0.92,
          sample_size: 5,
          success_patterns: [
            {
              pattern_id: 'PAT001',
              description: '初期接触から3-5日以内のフォローアップで提案実施',
              success_characteristics: {
                initial_contact_to_proposal_days: 3.5,
                contact_frequency_per_30days: 2.0,
                proposal_depth: 'detailed',
              },
              success_rate: 1.0,
              sample_deals: 2,
              avg_deal_amount: 625000,
            },
            {
              pattern_id: 'PAT002',
              description: '初期接触後2日でクロージングステップ進行',
              success_characteristics: {
                initial_contact_to_closing_days: 2.0,
                proposal_stages_count: 1,
                followup_interval_days: 2.0,
              },
              success_rate: 0.5,
              sample_deals: 2,
              avg_deal_amount: 1200000,
            },
            {
              pattern_id: 'PAT003',
              description: '長期フォローアップ（10日超）は成約に結びつきにくい',
              success_characteristics: {
                followup_interval_days: 10.0,
                proposal_count: 0,
              },
              success_rate: 0.0,
              sample_deals: 1,
              avg_deal_amount: 0,
            },
          ],
          optimal_followup_range_min_days: 2,
          optimal_followup_range_max_days: 5,
          high_performer_characteristics: {
            rep_ids: ['SR001', 'SR002'],
            common_behavior: 'Short follow-up intervals (2-5 days) with structured proposal progression',
            avg_close_rate: 0.75,
          },
        },
      })),

      generateImprovementProposals: jest.fn(async (params) => ({
        improvement_proposals: [
          {
            proposal_id: 'IMP001',
            category: 'process_modification',
            description: 'SR003の営業プロセスにおいて、初期接触後3-5日以内に提案ステップを実施するよう指導',
            impact_score: 0.85,
            target_reps: ['SR003'],
            expected_improvement: { close_rate_increase_percent: 40 },
          },
          {
            proposal_id: 'IMP002',
            category: 'individual_coaching',
            description: 'SR002に対して、提案ステップのスキップを改善し、詳細なヒアリング→提案の流れを実施するよう指導',
            impact_score: 0.72,
            target_reps: ['SR002'],
            expected_improvement: { close_rate_increase_percent: 25 },
          },
          {
            proposal_id: 'IMP003',
            category: 'new_success_pattern',
            description: '新規成功パターン：初期接触→短期提案（3-5日）→クロージング の最適プロセス',
            impact_score: 0.92,
            applicable_reps: ['SR001', 'SR002', 'SR003'],
            expected_improvement: { close_rate_increase_percent: 35 },
          },
        ],
      })),

      generateAnalysisReport: jest.fn(async (params) => ({
        report: {
          report_id: 'RPT_2024_01_TX12',
          analysis_period: { year: 2024, month: 1 },
          generated_at: '2024-02-01T09:00:00Z',
          dataset_summary: {
            sales_reps_count: 3,
            transactions_count: 5,
            closed_deals_count: 3,
            total_deal_amount: 2450000,
            overall_close_rate: 0.6,
          },
          quality_metrics: {
            data_quality_score: 0.97,
            data_sources: [
              {
                source_name: 'sales_database',
                records_count: 5,
                validation_status: 'passed',
              },
              {
                source_name: 'crm_system',
                records_count: 3,
                validation_status: 'passed',
              },
            ],
          },
          analysis_steps: [
            {
              step_num: 1,
              step_name: 'データ抽出',
              data_source: 'sales_database',
              records_processed: 5,
              status: 'completed',
            },
            {
              step_num: 2,
              step_name: 'データ品質検証',
              data_source: 'validation_engine',
              quality_score: 0.97,
              status: 'completed',
            },
            {
              step_num: 3,
              step_name: '行動パターン分析',
              data_source: 'transaction_data',
              records_analyzed: 5,
              status: 'completed',
            },
            {
              step_num: 4,
              step_name: 'プロセス遵守率計算',
              data_source: 'standard_process_definition',
              reps_evaluated: 3,
              status: 'completed',
            },
            {
              step_num: 5,
              step_name: '相関分析',
              data_source: 'transaction_data',
              correlation_coefficient: 0.78,
              confidence_score: 0.92,
              status: 'completed',
            },
          ],
          calculation_logic: {
            correlation_calculation_method:
              'Pearson correlation coefficient between close_rate and followup_interval_days',
            sample_extraction_rule:
              'All transactions from analysis_period with complete required fields (rep_id, contact_date, closed_flag, deal_amount)',
            quality_score_formula:
              '(total_records - missing_values - format_errors - duplicates) / total_records * 100',
            compliance_rate_formula:
              'Completed process steps / Total expected process steps per standard definition',
          },
          success_patterns_detail: [
            {
              pattern_id: 'PAT001',
              description: '初期接触から3-5日以内のフォローアップで提案実施',
              behavioral_characteristics:
                'short_followup_interval=3-5days, structured_proposal_approach',
              close_rate_value: 1.0,
              supporting_reps: ['SR001'],
              sample_transactions: ['TXN001', 'TXN002'],
            },
            {
              pattern_id: 'PAT002',
              description: '初期接触後2日でクロージングステップ進行',
              behavioral_characteristics:
                'rapid_close_initiation=2days, single_proposal_stage',
              close_rate_value: 0.5,
              supporting_reps: ['SR002'],
              sample_transactions: ['TXN003', 'TXN004'],
            },
          ],
          improvement_proposals: [
            {
              proposal_id: 'IMP001',
              description: 'SR003の営業プロセスにおいて、初期接触後3-5日以内に提案ステップを実施するよう指導',
              target_reps: ['SR003'],
              priority: 'high',
            },
            {
              proposal_id: 'IMP002',
              description:
                'SR002に対して、提案ステップのスキップを改善し、詳細なヒアリング→提案の流れを実施するよう指導',
              target_reps: ['SR002'],
              priority: 'medium',
            },
            {
              proposal_id: 'IMP003',
              description:
                '新規成功パターン：初期接触→短期提案（3-5日）→クロージング の最適プロセス',
              target_reps: [],
              priority: 'high',
            },
          ],
        },
      })),

      presentReportToManager: jest.fn(async (params) => ({
        presentation_status: 'completed',
        report_id: params.report_id,
        target_manager_id: params.target_manager_id,
        presentation_timestamp: '2024-02-01T09:30:00Z',
        access_location: '/dashboard/reports/RPT_2024_01_TX12',
      })),
    };

    // ========================================
    // 2. エージェント実行
    // ========================================
    const trigger_event = {
      event_type: 'monthly_sales_meeting',
      triggered_at: '2024-02-01T09:00:00Z',
      target_month: { year: 2024, month: 1 },
      manager_id: 'MGR001',
    };

    const agent_result = await runTx12Imp1Agent(
      mockAiClient,
      trigger_event,
    );

    // ========================================
    // 3. ステップ1: データ抽出確認
    // ========================================
    expect(mockAiClient.extractMonthlyData).toHaveBeenCalledWith({
      year: 2024,
      month: 1,
    });
    expect(agent_result.extraction_status).toBe('completed');
    expect(agent_result.extracted_data.sales_reps.length).toBe(3);
    expect(agent_result.extracted_data.transactions.length).toBe(5);

    // ========================================
    // 4. ステップ2: データ品質検証確認
    // ========================================
    expect(mockAiClient.validateDataQuality).toHaveBeenCalled();
    expect(agent_result.quality_check_result.quality_score).toBe(0.97);
    expect(agent_result.quality_check_result.status).toBe('passed');
    expect(agent_result.quality_check_result.quality_score).toBeGreaterThanOrEqual(
      0.95,
    );

    // ========================================
    // 5. ステップ3: 行動パターン分析確認
    // ========================================
    expect(
      mockAiClient.analyzeRepBehaviorPatterns,
    ).toHaveBeenCalledWith({
      transactions: agent_result.extracted_data.transactions,
    });
    expect(
      agent_result.behavior_analysis.reps_patterns.length,
    ).toBe(3);

    const sr001_pattern = agent_result.behavior_analysis.reps_patterns.find(
      (p: any) => p.rep_id === 'SR001',
    );
    expect(sr001_pattern.contact_frequency_per_month).toBe(2.0);
    expect(sr001_pattern.avg_followup_interval_days).toBe(4.0);
    expect(sr001_pattern.close_rate).toBe(1.0);

    const sr003_pattern = agent_result.behavior_analysis.reps_patterns.find(
      (p: any) => p.rep_id === 'SR003',
    );
    expect(sr003_pattern.contact_frequency_per_month).toBe(1.0);
    expect(sr003_pattern.avg_followup_interval_days).toBe(10.0);
    expect(sr003_pattern.close_rate).toBe(0.0);

    // ========================================
    // 6. ステップ4: プロセス標準書との照合確認
    // ========================================
    expect(
      mockAiClient.compareWithStandardProcess,
    ).toHaveBeenCalledWith({
      reps_patterns: agent_result.behavior_analysis.reps_patterns,
    });
    expect(
      agent_result.process_compliance.process_compliance.length,
    ).toBe(3);

    const sr001_compliance = agent_result.process_compliance.process_compliance.find(
      (c: any) => c.rep_id === 'SR001',
    );
    expect(sr001_compliance.compliance_rate).toBe(0.95);
    expect(sr001_compliance.compliance_rate).toBeGreaterThanOrEqual(0.75);

    const sr003_compliance = agent_result.process_compliance.process_compliance.find(
      (c: any) => c.rep_id === 'SR003',
    );
    expect(sr003_compliance.compliance_rate).toBe(0.5);
    expect(sr003_compliance.compliance_rate).toBeLessThan(0.75);

    // ========================================
    // 7. ステップ5: 相関分析確認
    // ========================================
    expect(mockAiClient.analyzeCorrelation).toHaveBeenCalledWith({
      transactions: agent_result.extracted_data.transactions,
      behavior_patterns: agent_result.behavior_analysis.reps_patterns,
    });
    expect(
      agent_result.correlation_analysis.correlation_analysis
        .correlation_coefficient,
    ).toBe(0.78);
    expect(
      agent_result.correlation_analysis.correlation_analysis
        .confidence_score,
    ).toBe(0.92);
    expect(
      agent_result.correlation_analysis.correlation_analysis.sample_size,
    ).toBe(5);

    const pat001 = agent_result.correlation_analysis.correlation_analysis.success_patterns.find(
      (p: any) => p.pattern_id === 'PAT001',
    );
    expect(pat001.success_rate).toBe(1.0);
    expect(pat001.sample_deals).toBe(2);
    expect(pat001.avg_deal_amount).toBe(625000);
    expect(
      pat001.success_characteristics.initial_contact_to_proposal_days,
    ).toBe(3.5);

    const pat003 = agent_result.correlation_analysis.correlation_analysis.success_patterns.find(
      (p: any) => p.pattern_id === 'PAT003',
    );
    expect(pat003.description).toContain('10日超');
    expect(pat003.success_rate).toBe(0.0);

    expect(
      agent_result.correlation_analysis.correlation_analysis
        .optimal_followup_range_min_days,
    ).toBe(2);
    expect(
      agent_result.correlation_analysis.correlation_analysis
        .optimal_followup_range_max_days,
    ).toBe(5);

    // ========================================
    // 8. ステップ6: 改善提案生成確認
    // ========================================
    expect(
      mockAiClient.generateImprovementProposals,
    ).toHaveBeenCalledWith({
      correlation_analysis: agent_result.correlation_analysis
        .correlation_analysis,
      behavior_patterns: agent_result.behavior_analysis.reps_patterns,
      process_compliance: agent_result.process_compliance
        .process_compliance,
    });
    expect(
      agent_result.improvement_proposals.improvement_proposals.length,
    ).toBeGreaterThan(0);

    const imp001 = agent_result.improvement_proposals.improvement_proposals.find(
      (p: any) => p.proposal_id === 'IMP001',
    );
    expect(imp001.category).toBe('process_modification');
    expect(imp001.target_reps).toContain('SR003');
    expect(imp001.expected_improvement.close_rate_increase_percent).toBe(40);

    // ========================================
    // 9. ステップ7: レポート生成確認
    // ========================================
    expect(mockAiClient.generateAnalysisReport).toHaveBeenCalledWith({
      analysis_period: { year: 2024, month: 1 },
      extracted_data: agent_result.extracted_data,
      quality_metrics: agent_result.quality_check_result,
      behavior_analysis: agent_result.behavior_analysis,
      process_compliance: agent_result.process_compliance,
      correlation_analysis: agent_result.correlation_analysis
        .correlation_analysis,
      improvement_proposals: agent_result.improvement_proposals
        .improvement_proposals,
    });

    const report = agent_result.generated_report.report;
    expect(report.report_id).toBe('RPT_2024_01_TX12');
    expect(report.analysis_period.year).toBe(2024);
    expect(report.analysis_period.month).toBe(1);

    // データセット情報確認
    expect(report.dataset_summary.sales_reps_count).toBe(3);
    expect(report.dataset_summary.transactions_count).toBe(5);
    expect(report.dataset_summary.closed_deals_count).toBe(3);
    expect(report.dataset_summary.total_deal_amount).toBe(2450000);
    expect(report.dataset_summary.overall_close_rate).toBe(0.6);

    // 各分析ステップのデータソース確認
    expect(report.analysis_steps.length).toBe(5);
    const step1 = report.analysis_steps.find((s: any) => s.step_num === 1);
    expect(step1.step_name).toBe('データ抽出');
    expect(step1.records_processed).toBe(5);
    expect(step1.status).toBe('completed');

    const step5 = report.analysis_steps.find((s: any) => s.step_num === 5);
    expect(step5.step_name).toBe('相関分析');
    expect(step5.correlation_coefficient).toBe(0.78);
    expect(step5.confidence_score).toBe(0.92);

    // 計算ロジック詳細確認
    expect(report.calculation_logic).toBeDefined();
    expect(report.calculation_logic.correlation_calculation_method).toContain(
      'Pearson',
    );
    expect(report.calculation_logic.sample_extraction_rule).toContain(
      'complete required fields',
    );
    expect(report.calculation_logic.quality_score_formula).toContain(
      'total_records',
    );
    expect(report.calculation_logic.compliance_rate_formula).toContain(
      'Completed process steps',
    );

    // 成功パターン詳細確認
    expect(report.success_patterns_detail.length).toBe(2);
    const success_pat_001 = report.success_patterns_detail.find(
      (p: any) => p.pattern_id === 'PAT001',
    );
    expect(success_pat_001.close_rate_value).toBe(1.0);
    expect(success_pat_001.supporting_reps).toContain('SR001');
    expect(success_pat_001.sample_transactions).toContain('TXN001');
    expect(success_pat_001.behavioral_characteristics).toContain(
      'followup_interval',
    );

    // ========================================
    // 10. ステップ8: レポート提示確認
    // ========================================
    expect(mockAiClient.presentReportToManager).toHaveBeenCalledWith({
      report_id: 'RPT_2024_01_TX12',
      target_manager_id: 'MGR001',
    });
    expect(agent_result.presentation_result.presentation_status).toBe(
      'completed',
    );
    expect(agent_result.presentation_result.access_location).toContain(
      'RPT_2024_01_TX12',
    );

    // ========================================
    // 11. エージェント全体の処理完了確認
    // ========================================
    expect(agent_result.overall_status).toBe('completed');
    expect(agent_result.executed_steps).toBe(8);
    expect(agent_result.execution_errors).toEqual([]);
    expect(agent_result.processing_completed_at).toBeDefined();
  });
});