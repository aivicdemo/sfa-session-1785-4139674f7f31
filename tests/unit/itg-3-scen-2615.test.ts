import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2615: [normal] 推奨提案アプローチの根拠として参照される過去商談が複数件の場合、すべてのデータが表示される', () => {
    const recommendation_id = 'rec-12345';
    const similar_past_deals = [
      {
        deal_id: 'ID-001',
        customer_name: '製造業A社',
        deal_amount: 50000000,
        contract_completed_date: '2023-06-15',
        success_point: 'コスト削減率35%達成、導入期間3ヶ月'
      },
      {
        deal_id: 'ID-002',
        customer_name: '製造業B社',
        deal_amount: 45000000,
        contract_completed_date: '2023-08-20',
        success_point: 'コスト削減率40%達成、導入期間2ヶ月'
      },
      {
        deal_id: 'ID-003',
        customer_name: '製造業C社',
        deal_amount: 55000000,
        contract_completed_date: '2023-10-10',
        success_point: 'コスト削減率38%達成、導入期間2.5ヶ月'
      },
      {
        deal_id: 'ID-004',
        customer_name: '製造業D社',
        deal_amount: 48000000,
        contract_completed_date: '2023-12-05',
        success_point: 'コスト削減率42%達成、導入期間2ヶ月'
      }
    ];

    const mock_ai_engine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoning_text: 'この推奨は以下の過去商談の成功パターンに基づいています。',
        referenced_deals: similar_past_deals,
        confidence_score: 92
      })
    };

    const result = explainRecommendationReasoning(
      recommendation_id,
      mock_ai_engine
    );

    expect(result).toHaveProperty('reasoning_text');
    expect(result).toHaveProperty('referenced_deals');
    expect(result.referenced_deals).toHaveLength(4);
    
    expect(result.referenced_deals[0]).toEqual({
      deal_id: 'ID-001',
      customer_name: '製造業A社',
      deal_amount: 50000000,
      contract_completed_date: '2023-06-15',
      success_point: 'コスト削減率35%達成、導入期間3ヶ月'
    });

    expect(result.referenced_deals[1]).toEqual({
      deal_id: 'ID-002',
      customer_name: '製造業B社',
      deal_amount: 45000000,
      contract_completed_date: '2023-08-20',
      success_point: 'コスト削減率40%達成、導入期間2ヶ月'
    });

    expect(result.referenced_deals[2]).toEqual({
      deal_id: 'ID-003',
      customer_name: '製造業C社',
      deal_amount: 55000000,
      contract_completed_date: '2023-10-10',
      success_point: 'コスト削減率38%達成、導入期間2.5ヶ月'
    });

    expect(result.referenced_deals[3]).toEqual({
      deal_id: 'ID-004',
      customer_name: '製造業D社',
      deal_amount: 48000000,
      contract_completed_date: '2023-12-05',
      success_point: 'コスト削減率42%達成、導入期間2ヶ月'
    });

    expect(result.confidence_score).toBe(92);
    expect(mock_ai_engine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendation_id
    );
  });
});