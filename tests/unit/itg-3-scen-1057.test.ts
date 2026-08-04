import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1057: 推奨内容に紐づく根拠情報が同時に表示される', async () => {
    // スタブ: AIRecommendationEngineの explainRecommendationReasoning を模擬
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning:
          '過去3年間の類似案件15件中、同ツール採用企業の成約率は87%。特に製造業向けカスタマイズ事例が5件あり、平均導入期間は2ヶ月',
      }),
    };

    // テスト用の新規案件データ
    const newDealInput = {
      customerName: 'テスト太郎',
      industry: '製造業',
      budget: 5000000,
      challenge: '業務効率化',
    };

    // 推奨内容（スタブから返される想定値）
    const recommendationContent = 'SaaS型業務自動化ツールA の導入提案';

    // explainRecommendationReasoning を呼び出し
    const result = await explainRecommendationReasoning(
      {
        recommendationId: 'rec_12345',
        recommendationContent,
        dealData: newDealInput,
      },
      mockAIRecommendationEngine
    );

    // 推奨内容が返却されていることを確認
    expect(result).toHaveProperty('recommendation');
    expect(result.recommendation).toBe('SaaS型業務自動化ツールA の導入提案');

    // 根拠説明が返却されていることを確認
    expect(result).toHaveProperty('reasoning');
    expect(result.reasoning).toBe(
      '過去3年間の類似案件15件中、同ツール採用企業の成約率は87%。特に製造業向けカスタマイズ事例が5件あり、平均導入期間は2ヶ月'
    );

    // 推奨内容と根拠情報が同一オブジェクト内に存在することを確認（同時表示可能）
    expect(result).toHaveProperty('recommendation');
    expect(result).toHaveProperty('reasoning');

    // 各セクションが明確に区別可能な構造であることを確認
    expect(Object.keys(result).sort()).toEqual(['recommendation', 'reasoning']);

    // AIエージェントへのデータ受け渡しが正しく行われたことを確認
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId: 'rec_12345',
        recommendationContent: 'SaaS型業務自動化ツールA の導入提案',
        dealData: newDealInput,
      })
    );

    // 返却データが営業担当者向け表示に適した形式であることを確認
    expect(typeof result.recommendation).toBe('string');
    expect(typeof result.reasoning).toBe('string');
    expect(result.recommendation.length).toBeGreaterThan(0);
    expect(result.reasoning.length).toBeGreaterThan(0);
  });
});