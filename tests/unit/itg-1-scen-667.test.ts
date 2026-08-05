import { analyzeProposalAndCustomerInteraction } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-667
  test('[normal] 提案実行と顧客対応記録の入力によるAIエージェント分析開始', async () => {
    const proposal_id = 'PROP-2024-001';
    const proposal_content = '新製品パッケージプラン提示';
    const proposal_execution_datetime = '2024-01-15T14:30:00Z';
    const customer_id = 'CUST-5678';
    const interaction_content = '提案内容について質問対応';
    const interaction_completion_datetime = '2024-01-15T14:45:00Z';

    const mock_ai_client = {
      analyzeProposalPattern: jest.fn().mockResolvedValue({
        status: 'processing',
        analysis_id: 'ANAL-2024-001',
        message: 'AIエージェント分析を開始しました',
      }),
    };

    const input_data = {
      proposal_id,
      proposal_content,
      proposal_execution_datetime,
      customer_id,
      interaction_content,
      interaction_completion_datetime,
      ai_client: mock_ai_client,
    };

    const result = await analyzeProposalAndCustomerInteraction(input_data);

    expect(result.status).toBe('processing');
    expect(result.message).toBe('AIエージェント分析を開始しました');
    expect(result.analysis_id).toBe('ANAL-2024-001');

    expect(mock_ai_client.analyzeProposalPattern).toHaveBeenCalledTimes(1);
    expect(mock_ai_client.analyzeProposalPattern).toHaveBeenCalledWith({
      proposal_id,
      proposal_content,
      proposal_execution_datetime,
      customer_id,
      interaction_content,
      interaction_completion_datetime,
    });
  });
});