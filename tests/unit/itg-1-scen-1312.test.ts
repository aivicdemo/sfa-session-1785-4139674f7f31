import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx12Imp1Agent } from '../../src/agents/tx-12-imp-1/orchestrator';
import type { Tx12Imp1AiClient } from '../../src/agents/tx-12-imp-1/types';

// Mock AI client factory
const createMockAiClient = (): jest.Mocked<Tx12Imp1AiClient> => {
  return {
    analyzeProcessDeviation: jest.fn(),
    generateAuditLog: jest.fn(),
    createReport: jest.fn(),
  } as jest.Mocked<Tx12Imp1AiClient>;
};

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1312
  it('[normal] 営業データ分析から乖離検出までの自律実行 AIエージェント - 標準書と実績データの照合が契約どおり実行される', async () => {
    const mockAiClient = createMockAiClient();

    // Setup: 営業プロセス標準書の定義
    const processDef = {
      version: '1.0',
      created_at: new Date('2024-01-01T00:00:00Z').toISOString(),
      steps: [
        {
          name: 'contact_frequency',
          standard_value: 2,
          unit: 'times_per_week',
          threshold_type: 'minimum',
        },
        {
          name: 'proposal_record',
          standard_value: true,
          unit: 'required',
          threshold_type: 'must_exist',
        },
        {
          name: 'followup_interval',
          standard_value: 3,
          unit: 'days',
          threshold_type: 'maximum',
        },
      ],
    };

    // Setup: 営業担当者A の実績データ（乖離あり）
    const sales_rep_a = {
      id: 'rep_a',
      name: 'Sales Rep A',
      contact_frequency: 1, // 標準: 2 (乖離)
      contact_frequency_unit: 'times_per_week',
      proposal_record_exists: false, // 標準: true (乖離)
      followup_interval_days: 5, // 標準: 3 (乖離)
      period_start: new Date('2024-01-01T00:00:00Z').toISOString(),
      period_end: new Date('2024-01-31T23:59:59Z').toISOString(),
    };

    // Setup: 営業担当者B の実績データ（標準遵守）
    const sales_rep_b = {
      id: 'rep_b',
      name: 'Sales Rep B',
      contact_frequency: 3, // 標準: 2 (達成)
      contact_frequency_unit: 'times_per_week',
      proposal_record_exists: true, // 標準: true (達成)
      followup_interval_days: 2, // 標準: 3 (達成)
      period_start: new Date('2024-01-01T00:00:00Z').toISOString(),
      period_end: new Date('2024-01-31T23:59:59Z').toISOString(),
    };

    // Setup: AIクライアントのモック実装
    const deviation_rep_a = {
      sales_rep_id: 'rep_a',
      sales_rep_name: 'Sales Rep A',
      deviations: [
        {
          step_name: 'contact_frequency',
          standard: 2,
          actual: 1,
          unit: 'times_per_week',
          status: 'DEVIATED',
          deviation_value: -1,
        },
        {
          step_name: 'proposal_record',
          standard: true,
          actual: false,
          unit: 'required',
          status: 'DEVIATED',
          deviation_detail: 'proposal record missing',
        },
        {
          step_name: 'followup_interval',
          standard: 3,
          actual: 5,
          unit: 'days',
          status: 'DEVIATED',
          deviation_value: 2,
        },
      ],
      overall_compliance: false,
      compliance_score: 0,
    };

    const deviation_rep_b = {
      sales_rep_id: 'rep_b',
      sales_rep_name: 'Sales Rep B',
      deviations: [],
      overall_compliance: true,
      compliance_score: 100,
    };

    mockAiClient.analyzeProcessDeviation.mockResolvedValueOnce({
      analysis_id: 'analysis_20240115_001',
      timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
      process_definition_version: '1.0',
      period: {
        start: new Date('2024-01-01T00:00:00Z').toISOString(),
        end: new Date('2024-01-31T23:59:59Z').toISOString(),
      },
      deviation_results: [deviation_rep_a, deviation_rep_b],
    });

    // Setup: 監査ログのモック実装
    const audit_log = {
      log_id: 'audit_20240115_001',
      timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
      analysis_id: 'analysis_20240115_001',
      process_definition_version: '1.0',
      data_source: 'sales_performance_db',
      period_start: new Date('2024-01-01T00:00:00Z').toISOString(),
      period_end: new Date('2024-01-31T23:59:59Z').toISOString(),
      comparison_logic_steps: [
        {
          step: 'contact_frequency',
          logic: 'actual_value >= standard_value',
          standard: 2,
        },
        {
          step: 'proposal_record',
          logic: 'actual_value == standard_value',
          standard: true,
        },
        {
          step: 'followup_interval',
          logic: 'actual_value <= standard_value',
          standard: 3,
        },
      ],
      records_processed: 2,
    };

    mockAiClient.generateAuditLog.mockResolvedValueOnce(audit_log);

    // Setup: レポート生成のモック実装
    const report = {
      report_id: 'report_20240115_001',
      generated_at: new Date('2024-01-15T11:00:00Z').toISOString(),
      title: 'Monthly Sales Process Compliance Analysis Report',
      analysis_id: 'analysis_20240115_001',
      audit_log_id: 'audit_20240115_001',
      summary: {
        total_sales_reps: 2,
        compliant_reps: 1,
        non_compliant_reps: 1,
        overall_compliance_rate: 50,
      },
      deviation_section: {
        rep_a: {
          sales_rep_id: 'rep_a',
          sales_rep_name: 'Sales Rep A',
          status: 'DEVIATED',
          findings: [
            {
              category: 'contact_frequency',
              message:
                'Deviation detected: Contact frequency is 1 time per week against standard of 2 times per week',
              severity: 'high',
            },
            {
              category: 'proposal_record',
              message: 'Deviation detected: Proposal record is missing',
              severity: 'high',
            },
            {
              category: 'followup_interval',
              message:
                'Deviation detected: Follow-up interval is 5 days, exceeding standard of 3 days by 2 days',
              severity: 'medium',
            },
          ],
        },
        rep_b: {
          sales_rep_id: 'rep_b',
          sales_rep_name: 'Sales Rep B',
          status: 'COMPLIANT',
          findings: [
            {
              category: 'process_adherence',
              message:
                'Sales Rep B is in full compliance with standard process',
              severity: 'none',
            },
          ],
        },
      },
      detailed_data_attachment: {
        rep_a_contact_records: [
          {
            contact_date: new Date('2024-01-05T10:00:00Z').toISOString(),
            contact_type: 'email',
          },
          {
            contact_date: new Date('2024-01-15T14:00:00Z').toISOString(),
            contact_type: 'call',
          },
        ],
        rep_a_proposal_analysis: {
          total_proposals: 0,
          proposals_with_records: 0,
          proposals_without_records: 0,
        },
        rep_a_followup_intervals: [5, 4, 6],
        rep_a_followup_intervals_avg: 5,
        rep_b_contact_records: [
          {
            contact_date: new Date('2024-01-03T09:00:00Z').toISOString(),
            contact_type: 'meeting',
          },
          {
            contact_date: new Date('2024-01-10T11:00:00Z').toISOString(),
            contact_type: 'call',
          },
          {
            contact_date: new Date('2024-01-17T15:00:00Z').toISOString(),
            contact_type: 'email',
          },
        ],
        rep_b_proposal_analysis: {
          total_proposals: 3,
          proposals_with_records: 3,
          proposals_without_records: 0,
        },
        rep_b_followup_intervals: [2, 2, 2],
        rep_b_followup_intervals_avg: 2,
      },
      audit_trail: {
        audit_log_id: 'audit_20240115_001',
        process_definition_used: '1.0',
        data_extraction_period: {
          start: new Date('2024-01-01T00:00:00Z').toISOString(),
          end: new Date('2024-01-31T23:59:59Z').toISOString(),
        },
        comparison_logic_applied: [
          'contact_frequency >= 2 times_per_week',
          'proposal_record == true',
          'followup_interval <= 3 days',
        ],
      },
    };

    mockAiClient.createReport.mockResolvedValueOnce(report);

    // Execute: Tx12Imp1Agent の実行
    const result = await runTx12Imp1Agent(
      {
        trigger: 'monthly_sales_meeting',
        process_definition: processDef,
        sales_performance_data: [sales_rep_a, sales_rep_b],
        ai_client: mockAiClient,
      },
      {
        log_enabled: true,
        audit_log_target: 'database',
      }
    );

    // Verify: 基本的なレポート構造
    expect(result.report_id).toBe('report_20240115_001');
    expect(result.generated_at).toBe(
      new Date('2024-01-15T11:00:00Z').toISOString()
    );

    // Verify: (1) 営業担当者A について乖離検出内容が正確に記載されている
    expect(result.deviation_section.rep_a.status).toBe('DEVIATED');
    expect(result.deviation_section.rep_a.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'contact_frequency',
          message:
            'Deviation detected: Contact frequency is 1 time per week against standard of 2 times per week',
          severity: 'high',
        }),
        expect.objectContaining({
          category: 'proposal_record',
          message: 'Deviation detected: Proposal record is missing',
          severity: 'high',
        }),
        expect.objectContaining({
          category: 'followup_interval',
          message:
            'Deviation detected: Follow-up interval is 5 days, exceeding standard of 3 days by 2 days',
          severity: 'medium',
        }),
      ])
    );

    // Verify: (2) 営業担当者B について標準プロセス遵守が明記されている
    expect(result.deviation_section.rep_b.status).toBe('COMPLIANT');
    expect(result.deviation_section.rep_b.findings[0].message).toBe(
      'Sales Rep B is in full compliance with standard process'
    );

    // Verify: (3) 照合に使用した情報が監査ログに記録されている
    const audit_log_result = await mockAiClient.generateAuditLog({
      analysis_id: 'analysis_20240115_001',
    });

    expect(audit_log_result.process_definition_version).toBe('1.0');
    expect(audit_log_result.period_start).toBe(
      new Date('2024-01-01T00:00:00Z').toISOString()
    );
    expect(audit_log_result.period_end).toBe(
      new Date('2024-01-31T23:59:59Z').toISOString()
    );
    expect(audit_log_result.comparison_logic_steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          step: 'contact_frequency',
          logic: 'actual_value >= standard_value',
          standard: 2,
        }),
        expect.objectContaining({
          step: 'proposal_record',
          logic: 'actual_value == standard_value',
          standard: true,
        }),
        expect.objectContaining({
          step: 'followup_interval',
          logic: 'actual_value <= standard_value',
          standard: 3,
        }),
      ])
    );

    // Verify: (4) 分析結果に詳細データが添付されている
    expect(result.detailed_data_attachment).toBeDefined();
    expect(result.detailed_data_attachment.rep_a_contact_records).toEqual([
      {
        contact_date: new Date('2024-01-05T10:00:00Z').toISOString(),
        contact_type: 'email',
      },
      {
        contact_date: new Date('2024-01-15T14:00:00Z').toISOString(),
        contact_type: 'call',
      },
    ]);
    expect(result.detailed_data_attachment.rep_a_proposal_analysis).toEqual({
      total_proposals: 0,
      proposals_with_records: 0,
      proposals_without_records: 0,
    });
    expect(result.detailed_data_attachment.rep_a_followup_intervals).toEqual([
      5, 4, 6,
    ]);
    expect(result.detailed_data_attachment.rep_a_followup_intervals_avg).toBe(5);

    // Verify: 営業担当者B の詳細データ
    expect(result.detailed_data_attachment.rep_b_contact_records).toEqual([
      {
        contact_date: new Date('2024-01-03T09:00:00Z').toISOString(),
        contact_type: 'meeting',
      },
      {
        contact_date: new Date('2024-01-10T11:00:00Z').toISOString(),
        contact_type: 'call',
      },
      {
        contact_date: new Date('2024-01-17T15:00:00Z').toISOString(),
        contact_type: 'email',
      },
    ]);
    expect(result.detailed_data_attachment.rep_b_proposal_analysis).toEqual({
      total_proposals: 3,
      proposals_with_records: 3,
      proposals_without_records: 0,
    });
    expect(result.detailed_data_attachment.rep_b_followup_intervals).toEqual([
      2, 2, 2,
    ]);
    expect(result.detailed_data_attachment.rep_b_followup_intervals_avg).toBe(2);

    // Verify: 監査証跡がレポートに含まれている
    expect(result.audit_trail.audit_log_id).toBe('audit_20240115_001');
    expect(result.audit_trail.process_definition_used).toBe('1.0');
    expect(result.audit_trail.data_extraction_period.start).toBe(
      new Date('2024-01-01T00:00:00Z').toISOString()
    );
    expect(result.audit_trail.data_extraction_period.end).toBe(
      new Date('2024-01-31T23:59:59Z').toISOString()
    );
    expect(result.audit_trail.comparison_logic_applied).toEqual([
      'contact_frequency >= 2 times_per_week',
      'proposal_record == true',
      'followup_interval <= 3 days',
    ]);

    // Verify: AIクライアントの適切な呼び出し
    expect(mockAiClient.analyzeProcessDeviation).toHaveBeenCalledTimes(1);
    expect(mockAiClient.generateAuditLog).toHaveBeenCalledTimes(1);
    expect(mockAiClient.createReport).toHaveBeenCalledTimes(1);

    // Verify: サマリー統計の正確性
    expect(result.summary.total_sales_reps).toBe(2);
    expect(result.summary.compliant_reps).toBe(1);
    expect(result.summary.non_compliant_reps).toBe(1);
    expect(result.summary.overall_compliance_rate).toBe(50);
  });
});