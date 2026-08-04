import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2336: [edge] 推奨根拠の自然言語説明生成機能 - 推奨根拠データが複数件のとき全件分の説明文が生成される
  test('複数件の推奨根拠データから全件分の自然言語説明文が生成される', () => {
    const mockRecommendationId = 'REC-2024-001';
    const mockRecommendationEngineResponse = {
      recommendationId: mockRecommendationId,
      reasons: [
        {
          reasonId: 'R001',
          explanation: '過去の類似案件において顧客業種が一致し、当該業種では本提案アプローチの成約率が85%を超える実績があります。'
        },
        {
          reasonId: 'R002',
          explanation: '顧客の購買規模が過去の成功事例の平均値である500万円以上であり、提案内容との適合度が高いと判定されました。'
        },
        {
          reasonId: 'R003',
          explanation: '営業担当者の過去6ヶ月間のフォローアップ実績から、当顧客との接触頻度は週1回以上で、購買シグナルの検出確度が高まっています。'
        }
      ]
    };

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(mockRecommendationEngineResponse)
    };

    const generatedExplanations = explainRecommendationReasoning(
      mockRecommendationId,
      mockRecommendationEngineResponse.reasons,
      mockAIRecommendationEngine
    );

    expect(generatedExplanations).toHaveLength(3);

    expect(generatedExplanations[0]).toBeDefined();
    expect(generatedExplanations[0]).not.toBeNull();
    expect(generatedExplanations[0]).not.toBe('');
    expect(typeof generatedExplanations[0]).toBe('string');

    expect(generatedExplanations[1]).toBeDefined();
    expect(generatedExplanations[1]).not.toBeNull();
    expect(generatedExplanations[1]).not.toBe('');
    expect(typeof generatedExplanations[1]).toBe('string');

    expect(generatedExplanations[2]).toBeDefined();
    expect(generatedExplanations[2]).not.toBeNull();
    expect(generatedExplanations[2]).not.toBe('');
    expect(typeof generatedExplanations[2]).toBe('string');

    expect(generatedExplanations).toEqual([
      mockRecommendationEngineResponse.reasons[0].explanation,
      mockRecommendationEngineResponse.reasons[1].explanation,
      mockRecommendationEngineResponse.reasons[2].explanation
    ]);

    expect(generatedExplanations.length).toBe(mockRecommendationEngineResponse.reasons.length);
  });
});