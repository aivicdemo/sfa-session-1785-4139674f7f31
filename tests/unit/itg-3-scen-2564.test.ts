import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2564
  test('推奨内容が複数件のとき、すべての根拠が表示される', () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([
        {
          id: 'rec_001',
          content: '推奨A',
          type: 'pricing_strategy',
        },
        {
          id: 'rec_002',
          content: '推奨B',
          type: 'phased_implementation',
        },
        {
          id: 'rec_003',
          content: '推奨C',
          type: 'risk_mitigation',
        },
      ]),
      explainRecommendationReasoning: jest.fn((recId: string) => {
        const reasoningMap: Record<string, string> = {
          rec_001: '過去同業種の成功事例では価格提案が決定要因',
          rec_002: '顧客の予算規模から段階導入パターンが適用',
          rec_003: '競合他社の同時期案件の失敗要因を回避',
        };
        return Promise.resolve(reasoningMap[recId] || '');
      }),
    };

    const customerContext = {
      customerId: 'cust_001',
      industryType: 'IT',
      companySize: 'mid_market',
      budget: 5000000,
      timeframe: 'Q2_2024',
    };

    const dealContext = {
      dealId: 'deal_001',
      productCategory: 'cloud_service',
      currentPhase: 'proposal_stage',
      pastSimilarDeals: 3,
    };

    return displayRecommendationReasoning(
      customerContext,
      dealContext,
      mockRecommendationEngine
    ).then((result) => {
      expect(result.recommendations).toHaveLength(3);

      expect(result.recommendations[0]).toEqual({
        id: 'rec_001',
        content: '推奨A',
        type: 'pricing_strategy',
        reasoning: '過去同業種の成功事例では価格提案が決定要因',
      });

      expect(result.recommendations[1]).toEqual({
        id: 'rec_002',
        content: '推奨B',
        type: 'phased_implementation',
        reasoning: '顧客の予算規模から段階導入パターンが適用',
      });

      expect(result.recommendations[2]).toEqual({
        id: 'rec_003',
        content: '推奨C',
        type: 'risk_mitigation',
        reasoning: '競合他社の同時期案件の失敗要因を回避',
      });

      expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
        customerContext,
        dealContext
      );

      expect(mockRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
      expect(mockRecommendationEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(1, 'rec_001');
      expect(mockRecommendationEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(2, 'rec_002');
      expect(mockRecommendationEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(3, 'rec_003');
    });
  });
});