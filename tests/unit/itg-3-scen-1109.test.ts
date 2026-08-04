import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AI推奨エンジン - OpenAI API認証エラー時の代替パターンマスタ切り替え', () => {
  test('SCEN-1109: OpenAI API 401認証エラー時に推奨パターンマスタからの推奨を返却', async () => {
    const mock_ai_engine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('401'))
        .mockRejectedValueOnce(new Error('401'))
        .mockRejectedValueOnce(new Error('401')),
    };

    const mock_pattern_master = [
      {
        pattern_id: 'PAT-001',
        pattern_name: '初回接触後3日以内フォローアップ',
        application_rate: 85,
        success_rate: 85,
      },
      {
        pattern_id: 'PAT-002',
        pattern_name: '予算決定者との同席提案',
        application_rate: 72,
        success_rate: 72,
      },
    ];

    const mock_recommendation_history = [
      {
        recommendation_id: 'REC-001',
        pattern_id: 'PAT-001',
        customer_id: 'CUST-999',
        created_at: '2024-01-15T10:00:00Z',
      },
    ];

    const input_data = {
      customer_id: 'CUST-12345',
      customer_name: 'テスト顧客',
      industry: '製造業',
      company_size: '従業員500人',
      deal_value: 5000000,
      deal_stage: '初期接触',
      challenge_keyword: 'コスト削減',
      ai_engine: mock_ai_engine,
      pattern_master: mock_pattern_master,
      recommendation_history: mock_recommendation_history,
    };

    const result = await generateRecommendation(input_data);

    expect(result.recommendation_source).toBe('pattern_master');
    expect(result.pattern_id).toBe('PAT-001');
    expect(result.pattern_name).toBe('初回接触後3日以内フォローアップ');
    expect(result.confidence_score).toBe(85);
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.reasoning_explanation_type).toBe('simplified');
    expect(result.api_call_attempts).toBe(3);
    expect(result.fallback_applied).toBe(true);
    expect(result.error_log).toContain('401');
  });
});