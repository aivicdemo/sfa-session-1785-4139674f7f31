import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx12Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-1311: [normal] 営業データ分析から乖離検出までの自律実行 AIエージェント - 営業担当者ごとの行動パターン分析
  test('月次営業会議トリガー後に営業担当者ごとの行動パターン（接触頻度、提案内容、フォローアップ間隔）を正確に分析し、データセットと計算ロジックを記録する', async () => {
    // テスト用の営業データベースセットアップ
    const sales_rep_a_data = Array.from({ length: 30 }, (_, i) => ({
      sales_rep_id: 'A001',
      contact_date: new Date(Date.UTC(2024, 0, 1 + Math.floor(i * 0.83))).toISOString(),
      proposal_category: ['product_x', 'service_y', 'bundle_z'][i % 3],
      followup_date: new Date(Date.UTC(2024, 0, 2 + Math.floor(i * 0.83))).toISOString(),
    }));

    const sales_rep_b_data = Array.from({ length: 30 }, (_, i) => ({
      sales_rep_id: 'B002',
      contact_date: new Date(Date.UTC(2024, 0, 1 + Math.floor(i * 0.47))).toISOString(),
      proposal_category: ['product_x', 'service_y', 'bundle_z', 'support_w'][i % 4],
      followup_date: new Date(Date.UTC(2024, 0, 2 + Math.floor(i * 0.47))).toISOString(),
    }));

    const sales_rep_c_data = Array.from({ length: 30 }, (_, i) => ({
      sales_rep_id: 'C003',
      contact_date: new Date(Date.UTC(2024, 0, 1 + Math.floor(i * 1.45))).toISOString(),
      proposal_category: ['product_x', 'service_y'][i % 2],
      followup_date: new Date(Date.UTC(2024, 0, 2 + Math.floor(i * 1.45))).toISOString(),
    }));

    const all_sales_data = [...sales_rep_a_data, ...sales_rep_b_data, ...sales_rep_c_data];

    // ステップ 1: 営業データベースから当月データを抽出し品質チェックを実行する返答
    fetchMock.mockResponseOnce(
      JSON.stringify({
        extraction_status: 'completed',
        total_records: 90,
        quality_score: 0.97,
        data: all_sales_data,
        quality_issues: [],
      }),
      { status: 200 }
    );

    // ステップ 2: 営業担当者ごとの行動パターン分析の返答
    fetchMock.mockResponseOnce(
      JSON.stringify({
        analysis_status: 'completed',
        patterns: [
          {
            sales_rep_id: 'A001',
            avg_contact_frequency_days: 5.2,
            proposal_diversity_score: 78,
            avg_followup_interval_days: 3.8,
            behavior_pattern: 'standard',
            confidence_score: 0.88,
            dataset_summary: {
              total_contacts: 30,
              contact_dates: sales_rep_a_data.map(d => d.contact_date),
              proposal_categories: sales_rep_a_data.map(d => d.proposal_category),
              followup_dates: sales_rep_a_data.map(d => d.followup_date),
            },
            calculation_logic: {
              contact_frequency_method: 'interval_between_consecutive_contacts_in_days',
              diversity_method: 'categorical_entropy_scaled_0_to_100',
              followup_method: 'days_between_contact_and_followup',
            },
          },
          {
            sales_rep_id: 'B002',
            avg_contact_frequency_days: 2.9,
            proposal_diversity_score: 92,
            avg_followup_interval_days: 2.1,
            behavior_pattern: 'aggressive',
            confidence_score: 0.91,
            dataset_summary: {
              total_contacts: 30,
              contact_dates: sales_rep_b_data.map(d => d.contact_date),
              proposal_categories: sales_rep_b_data.map(d => d.proposal_category),
              followup_dates: sales_rep_b_data.map(d => d.followup_date),
            },
            calculation_logic: {
              contact_frequency_method: 'interval_between_consecutive_contacts_in_days',
              diversity_method: 'categorical_entropy_scaled_0_to_100',
              followup_method: 'days_between_contact_and_followup',
            },
          },
          {
            sales_rep_id: 'C003',
            avg_contact_frequency_days: 8.7,
            proposal_diversity_score: 45,
            avg_followup_interval_days: 6.3,
            behavior_pattern: 'passive',
            confidence_score: 0.85,
            dataset_summary: {
              total_contacts: 30,
              contact_dates: sales_rep_c_data.map(d => d.contact_date),
              proposal_categories: sales_rep_c_data.map(d => d.proposal_category),
              followup_dates: sales_rep_c_data.map(d => d.followup_date),
            },
            calculation_logic: {
              contact_frequency_method: 'interval_between_consecutive_contacts_in_days',
              diversity_method: 'categorical_entropy_scaled_0_to_100',
              followup_method: 'days_between_contact_and_followup',
            },
          },
        ],
        analysis_log_id: 'ANALYSIS_20240115_001',
      }),
      { status: 200 }
    );

    // ステップ 3: 営業プロセス標準書との乖離分析に進むことを確認するための返答
    fetchMock.mockResponseOnce(
      JSON.stringify({
        deviation_analysis_status: 'ready_to_execute',
        message: 'proceeding_to_deviation_analysis',
      }),
      { status: 200 }
    );

    const trigger_input = {
      trigger_type: 'monthly_sales_meeting',
      trigger_date: '2024-01-15T11:00:00Z',
      target_month: '2024-01',
    };

    const result = await runTx12Imp1Agent(trigger_input);

    // 検証: データ品質チェックステップが完了し、品質スコア >= 95%
    expect(result.data_quality_check_completed).toBe(true);
    expect(result.quality_score).toBeGreaterThanOrEqual(0.95);

    // 検証: 行動パターン分析ステップが実行された
    expect(result.behavior_pattern_analysis_completed).toBe(true);

    // 検証: 分析結果ログから営業担当者Aのデータが正確に記録されている
    const pattern_a = result.analysis_patterns.find((p: any) => p.sales_rep_id === 'A001');
    expect(pattern_a).toBeDefined();
    expect(pattern_a.avg_contact_frequency_days).toBe(5.2);
    expect(pattern_a.proposal_diversity_score).toBe(78);
    expect(pattern_a.avg_followup_interval_days).toBe(3.8);
    expect(pattern_a.behavior_pattern).toBe('standard');

    // 検証: 分析結果ログから営業担当者Bのデータが正確に記録されている
    const pattern_b = result.analysis_patterns.find((p: any) => p.sales_rep_id === 'B002');
    expect(pattern_b).toBeDefined();
    expect(pattern_b.avg_contact_frequency_days).toBe(2.9);
    expect(pattern_b.proposal_diversity_score).toBe(92);
    expect(pattern_b.avg_followup_interval_days).toBe(2.1);
    expect(pattern_b.behavior_pattern).toBe('aggressive');

    // 検証: 分析結果ログから営業担当者Cのデータが正確に記録されている
    const pattern_c = result.analysis_patterns.find((p: any) => p.sales_rep_id === 'C003');
    expect(pattern_c).toBeDefined();
    expect(pattern_c.avg_contact_frequency_days).toBe(8.7);
    expect(pattern_c.proposal_diversity_score).toBe(45);
    expect(pattern_c.avg_followup_interval_days).toBe(6.3);
    expect(pattern_c.behavior_pattern).toBe('passive');

    // 検証: 行動パターン分析に使用されたデータセットが正確に含まれている
    const dataset_a = pattern_a.dataset_summary;
    expect(dataset_a.total_contacts).toBe(30);
    expect(dataset_a.contact_dates.length).toBe(30);
    expect(dataset_a.proposal_categories.length).toBe(30);
    expect(dataset_a.followup_dates.length).toBe(30);

    // 検証: データセット内の営業担当者ID、接触記録日付、提案内容、フォローアップ日付が営業データと一致
    dataset_a.contact_dates.forEach((contact_date: string, index: number) => {
      expect(contact_date).toBe(sales_rep_a_data[index].contact_date);
    });
    dataset_a.proposal_categories.forEach((category: string, index: number) => {
      expect(category).toBe(sales_rep_a_data[index].proposal_category);
    });
    dataset_a.followup_dates.forEach((followup_date: string, index: number) => {
      expect(followup_date).toBe(sales_rep_a_data[index].followup_date);
    });

    // 検証: 計算ロジックの詳細が記録されている
    expect(pattern_a.calculation_logic).toBeDefined();
    expect(pattern_a.calculation_logic.contact_frequency_method).toBe(
      'interval_between_consecutive_contacts_in_days'
    );
    expect(pattern_a.calculation_logic.diversity_method).toBe(
      'categorical_entropy_scaled_0_to_100'
    );
    expect(pattern_a.calculation_logic.followup_method).toBe(
      'days_between_contact_and_followup'
    );

    // 検証: 次のステップ（営業プロセス標準書との乖離分析）に進むことが確認されている
    expect(result.proceeding_to_next_step).toBe(true);
    expect(result.next_step_type).toBe('process_deviation_analysis');
  });
});