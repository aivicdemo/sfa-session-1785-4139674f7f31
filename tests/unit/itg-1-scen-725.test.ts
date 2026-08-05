import { analyzeProposalAndCustomerInteractionPattern } from '../../src/logic/it-1-br-2-1-1';

describe('提案内容と顧客対応パターンの標準プロセス比較分析', () => {
  test('SCEN-725: 対応記録の時系列順序が逆順で入力された場合に正しく並べ替えられて分析される', () => {
    // 対応記録データセット（逆順で入力）
    const customerInteractionRecords = [
      {
        record_id: 'rec_003',
        interaction_timestamp: '2024-01-15T14:30:00Z',
        interaction_type: 'email_follow_up',
        customer_response: 'positive',
        notes: '提案内容に対する前向きな返答'
      },
      {
        record_id: 'rec_001',
        interaction_timestamp: '2024-01-15T13:00:00Z',
        interaction_type: 'initial_contact',
        customer_response: 'interested',
        notes: '初回接触完了'
      },
      {
        record_id: 'rec_002',
        interaction_timestamp: '2024-01-15T14:00:00Z',
        interaction_type: 'proposal_presentation',
        customer_response: 'needs_clarification',
        notes: '提案内容説明'
      }
    ];

    const proposalContent = {
      proposal_id: 'prop_001',
      customer_id: 'cust_001',
      proposed_product_category: 'software_solution',
      proposed_amount: 500000,
      proposal_timestamp: '2024-01-15T12:00:00Z'
    };

    const standardProcessDefinition = {
      stage_1: {
        stage_name: '初回接触',
        expected_action: 'initial_contact',
        target_duration_days: 1
      },
      stage_2: {
        stage_name: '提案',
        expected_action: 'proposal_presentation',
        target_duration_days: 3
      },
      stage_3: {
        stage_name: 'フォローアップ',
        expected_action: 'email_follow_up',
        target_duration_days: 7
      }
    };

    const analysisResult = analyzeProposalAndCustomerInteractionPattern(
      proposalContent,
      customerInteractionRecords,
      standardProcessDefinition
    );

    // 分析結果の対応記録が時系列昇順に並べ替えられていることを確認
    expect(analysisResult.sorted_interaction_records).toEqual([
      {
        record_id: 'rec_001',
        interaction_timestamp: '2024-01-15T13:00:00Z',
        interaction_type: 'initial_contact',
        customer_response: 'interested',
        notes: '初回接触完了'
      },
      {
        record_id: 'rec_002',
        interaction_timestamp: '2024-01-15T14:00:00Z',
        interaction_type: 'proposal_presentation',
        customer_response: 'needs_clarification',
        notes: '提案内容説明'
      },
      {
        record_id: 'rec_003',
        interaction_timestamp: '2024-01-15T14:30:00Z',
        interaction_type: 'email_follow_up',
        customer_response: 'positive',
        notes: '提案内容に対する前向きな返答'
      }
    ]);

    // 標準プロセスとの比較分析が実行されていることを確認
    expect(analysisResult.process_compliance_score).toBe(100);
    expect(analysisResult.analysis_status).toBe('completed');
    expect(analysisResult.chronological_order_validated).toBe(true);

    // 各ステージの実行状況が正しく分析されていることを確認
    expect(analysisResult.stage_execution_details).toEqual([
      {
        stage_name: '初回接触',
        expected_action: 'initial_contact',
        actual_action: 'initial_contact',
        matched: true,
        executed_at: '2024-01-15T13:00:00Z',
        target_duration_days: 1
      },
      {
        stage_name: '提案',
        expected_action: 'proposal_presentation',
        actual_action: 'proposal_presentation',
        matched: true,
        executed_at: '2024-01-15T14:00:00Z',
        target_duration_days: 3
      },
      {
        stage_name: 'フォローアップ',
        expected_action: 'email_follow_up',
        actual_action: 'email_follow_up',
        matched: true,
        executed_at: '2024-01-15T14:30:00Z',
        target_duration_days: 7
      }
    ]);

    // 顧客対応パターンが成功パターンと合致していることを確認
    expect(analysisResult.customer_response_pattern_match).toBe(true);
    expect(analysisResult.deviation_degree).toBe(0);
  });
});