import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2464
  test('推奨根拠が1つ存在するとき、根拠情報が正しく可視化される', async () => {
    const mock_recommendation_engine = {
      generateRecommendation: jest.fn(),
    };

    const mock_response = {
      recommendation: '提案内容',
      reasoning: [
        {
          id: 'reason_001',
          title: '根拠タイトル',
          description: '根拠の詳細説明',
          relevanceScore: 0.95,
        },
      ],
    };

    mock_recommendation_engine.generateRecommendation.mockResolvedValue(
      mock_response
    );

    const input_customer_data = {
      customerId: 'cust_12345',
      industry: '製造業',
      scale: '中堅企業',
      challenges: ['コスト削減', '効率化'],
    };

    const result = await generateRecommendation(
      input_customer_data,
      mock_recommendation_engine
    );

    expect(result.recommendation).toBe('提案内容');
    expect(result.reasoning).toHaveLength(1);

    const reason_item = result.reasoning[0];
    expect(reason_item.id).toBe('reason_001');
    expect(reason_item.title).toBe('根拠タイトル');
    expect(reason_item.description).toBe('根拠の詳細説明');
    expect(reason_item.relevanceScore).toBe(0.95);

    expect(mock_recommendation_engine.generateRecommendation).toHaveBeenCalledWith(
      input_customer_data
    );
  });
});