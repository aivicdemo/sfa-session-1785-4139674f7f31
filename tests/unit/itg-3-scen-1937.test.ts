import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1937
  test('[edge] 推奨内容の根拠表示機能 - 推奨タイプが購買タイミングのときに該当する根拠が抽出される', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationData = {
      recommendationId: 'rec_20240115_001',
      recommendationType: 'purchasing_timing',
      customerId: 'cust_98765',
      customerIndustry: 'manufacturing',
      customerScale: 'mid_enterprise',
      purchasingPhase: 'inventory_adjustment',
      proposedTimingReason: '決算期接近に伴う在庫調整需要',
      confidenceScore: 87,
    };

    const mockReasoningResponse = {
      recommendationId: 'rec_20240115_001',
      reasoningBasis: [
        {
          basisType: '決算期接近',
          basisContent:
            '顧客の決算期は3月であり、在庫調整の必要性が高まる2月中旬が最適な提案時期です',
          dataSource: 'customer_fiscal_calendar',
          relevanceScore: 92,
        },
        {
          basisType: '予算消化時期',
          basisContent:
            '過去3年間の購買実績から、第4四半期の予算消化率が80%以上に達する時期に追加購買が発生しやすい傾向が確認されています',
          dataSource: 'historical_purchase_pattern',
          relevanceScore: 78,
        },
      ],
    };

    mockAIRecommendationEngine.explainRecommendationReasoning.mockResolvedValue(
      mockReasoningResponse,
    );

    const result = explainRecommendationReasoning(
      recommendationData,
      mockAIRecommendationEngine,
    );

    return result.then((response) => {
      expect(
        mockAIRecommendationEngine.explainRecommendationReasoning,
      ).toHaveBeenCalledWith(recommendationData);

      expect(response.recommendationId).toBe('rec_20240115_001');
      expect(response.reasoningBasis).toHaveLength(2);

      const basisTypes = response.reasoningBasis.map((b) => b.basisType);
      expect(basisTypes).toContain('決算期接近');
      expect(basisTypes).toContain('予算消化時期');

      const firstBasis = response.reasoningBasis.find(
        (b) => b.basisType === '決算期接近',
      );
      expect(firstBasis?.basisContent).toBe(
        '顧客の決算期は3月であり、在庫調整の必要性が高まる2月中旬が最適な提案時期です',
      );
      expect(firstBasis?.relevanceScore).toBe(92);

      const secondBasis = response.reasoningBasis.find(
        (b) => b.basisType === '予算消化時期',
      );
      expect(secondBasis?.basisContent).toContain('第4四半期の予算消化率');
      expect(secondBasis?.relevanceScore).toBe(78);
    });
  });
});