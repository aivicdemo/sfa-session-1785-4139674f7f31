import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1809
  test('推奨内容の根拠説明機能 - AIエージェント呼び出し成功時、OpenAI APIから返却された説明文が営業担当者に表示される', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning:
          '顧客の業界は製造業で、従業員規模500名以下のセグメント。過去3年間の成功事例から、このセグメントではクラウド導入時にコスト削減を最優先課題とする傾向が91%。よって、ROI試算と導入期間の短縮を軸とした提案アプローチを推奨します。',
      }),
    };

    const recommendationId = 'rec-2024-001';
    const customerId = 'cust-2024-100';
    const dealId = 'deal-2024-500';

    const result = await explainRecommendationReasoning(
      recommendationId,
      customerId,
      dealId,
      mockAIEngine
    );

    expect(result).toEqual({
      reasoning:
        '顧客の業界は製造業で、従業員規模500名以下のセグメント。過去3年間の成功事例から、このセグメントではクラウド導入時にコスト削減を最優先課題とする傾向が91%。よって、ROI試算と導入期間の短縮を軸とした提案アプローチを推奨します。',
    });

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId,
      customerId,
      dealId
    );
  });
});