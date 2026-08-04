import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1772
  test('推奨根拠が0件のとき根拠表示内容を空配列で返す', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue([]),
    };

    const recommendationId = 'REC-20240115-001';
    const dealInfo = {
      dealId: 'DEAL-20240115-0001',
      customerId: 'CUST-ABC123',
      customerName: '株式会社テスト',
      industry: '製造業',
      scale: 'medium',
      proposalContent: 'クラウドシステム導入提案',
    };

    const result = await explainRecommendationReasoning(
      recommendationId,
      dealInfo,
      mockAIEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId,
      dealInfo
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
  });
});