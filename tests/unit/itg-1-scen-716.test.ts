import { analyzeProposalAndCustomerInteractionPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('提案内容と顧客対応パターンの標準プロセス比較分析', () => {
  // SCEN-716: [edge] 提案内容と顧客対応パターンの標準プロセス比較分析 - 顧客対応記録の件数が最小要件未満の場合に分析不可と判定される
  test('顧客対応記録が最小要件未満の場合、分析を実行せずにエラーメッセージを返す', () => {
    const min_interaction_records_required = 10;
    const actual_interaction_records_count = 9;
    const proposal_content = {
      proposal_id: 'prop_20240115_001',
      customer_id: 'cust_A001',
      proposal_title: '営業管理システム導入提案',
      proposal_amount: 500000,
      proposal_date: '2024-01-15T09:00:00Z',
      proposed_solution: 'クラウド型営業管理システム',
      key_benefits: ['営業プロセス可視化', 'リアルタイム分析', 'データ統合'],
    };
    const customer_interaction_records = [
      {
        interaction_id: 'int_001',
        interaction_date: '2024-01-10T10:00:00Z',
        interaction_type: 'email',
        interaction_summary: 'システム要件確認',
      },
      {
        interaction_id: 'int_002',
        interaction_date: '2024-01-11T14:00:00Z',
        interaction_type: 'phone_call',
        interaction_summary: 'スケジュール調整',
      },
      {
        interaction_id: 'int_003',
        interaction_date: '2024-01-12T10:00:00Z',
        interaction_type: 'meeting',
        interaction_summary: 'オンサイト打ち合わせ',
      },
      {
        interaction_id: 'int_004',
        interaction_date: '2024-01-12T15:00:00Z',
        interaction_type: 'email',
        interaction_summary: '議事録送付',
      },
      {
        interaction_id: 'int_005',
        interaction_date: '2024-01-13T09:00:00Z',
        interaction_type: 'email',
        interaction_summary: '提案資料事前確認',
      },
      {
        interaction_id: 'int_006',
        interaction_date: '2024-01-14T10:00:00Z',
        interaction_type: 'meeting',
        interaction_summary: '提案プレゼンテーション',
      },
      {
        interaction_id: 'int_007',
        interaction_date: '2024-01-14T15:00:00Z',
        interaction_type: 'email',
        interaction_summary: 'Q&A回答送付',
      },
      {
        interaction_id: 'int_008',
        interaction_date: '2024-01-15T09:00:00Z',
        interaction_type: 'phone_call',
        interaction_summary: '予算確認',
      },
      {
        interaction_id: 'int_009',
        interaction_date: '2024-01-15T11:00:00Z',
        interaction_type: 'email',
        interaction_summary: '次ステップの提案',
      },
    ];
    const standard_process_definition = {
      process_id: 'proc_standard_001',
      stage_1: 'initial_contact',
      stage_2: 'needs_analysis',
      stage_3: 'proposal',
      stage_4: 'negotiation',
      stage_5: 'contract',
      required_touchpoints_per_stage: 2,
    };

    const result = analyzeProposalAndCustomerInteractionPatterns({
      proposal_content,
      customer_interaction_records,
      standard_process_definition,
      min_interaction_records_required,
    });

    expect(result.analysis_executable).toBe(false);
    expect(result.error_message).toMatch(/顧客対応記録/);
    expect(result.error_message).toMatch(/不足/);
    expect(result.error_message).toMatch(/10/);
    expect(result.analysis_results).toBeUndefined();
    expect(result.compliance_score).toBeUndefined();
    expect(result.deviation_patterns).toBeUndefined();
  });
});