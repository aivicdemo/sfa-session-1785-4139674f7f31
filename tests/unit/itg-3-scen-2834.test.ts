import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2834
  test('推奨内容の根拠表示・検証機能 - 営業担当者の成約実績が1件の場合、推奨内容の根拠が個別商談の詳細情報で説明される', async () => {
    // テストデータ: 営業担当者Aの成約実績（商談1件）
    const salesRepresentativeId = 'sales_rep_001';
    const successfulDealId = 'deal_001';
    const customerNameHistorical = 'XX株式会社';
    const productNameHistorical = 'プレミアムプラン';
    const contractAmountHistorical = 5000000; // 500万円
    const dealStartDate = '2024-01-01T00:00:00Z';
    const dealEndDate = '2024-03-31T23:59:59Z';
    const decisionFactor = 'コスト削減効果の提示';

    // テストデータ: 新規案件
    const newCustomerName = 'YY株式会社';
    const industryType = '製造業';
    const businessChallenge = '生産効率化';
    const newCustomerId = 'customer_002';

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          dealId: successfulDealId,
          salesRepId: salesRepresentativeId,
          customerName: customerNameHistorical,
          product: productNameHistorical,
          contractAmount: contractAmountHistorical,
          dealPeriodStart: dealStartDate,
          dealPeriodEnd: dealEndDate,
          decisionFactors: [decisionFactor],
          similarity: 0.85,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation:
          '過去の成功事例（XX株式会社での提案）において、コスト削減効果の定量化が決定要因となりました。貴社の生産効率化課題に対しても、同様のアプローチで年間XXX万円のコスト削減シミュレーションを提示することで、意思決定促進が期待できます',
        confidenceScore: 85,
        basedOnPatterns: [
          {
            patternId: 'pattern_001',
            historicalCustomer: customerNameHistorical,
            historicalProduct: productNameHistorical,
            historicalDecisionFactor: decisionFactor,
          },
        ],
      }),
    };

    // 推奨生成入力
    const recommendationInput = {
      customerId: newCustomerId,
      customerName: newCustomerName,
      industry: industryType,
      challenge: businessChallenge,
      salesRepId: salesRepresentativeId,
    };

    // 推奨根拠を説明文として取得
    const result = await explainRecommendationReasoning(
      recommendationInput,
      mockAIEngine,
    );

    // 期待結果の検証
    expect(result).toBeDefined();
    expect(result.explanation).toBe(
      '過去の成功事例（XX株式会社での提案）において、コスト削減効果の定量化が決定要因となりました。貴社の生産効率化課題に対しても、同様のアプローチで年間XXX万円のコスト削減シミュレーションを提示することで、意思決定促進が期待できます',
    );

    // 根拠が営業担当者Aの成約実績（商談詳細情報）に基づいていることを検証
    expect(result.basedOnPatterns).toHaveLength(1);
    expect(result.basedOnPatterns[0].historicalCustomer).toBe(
      customerNameHistorical,
    );
    expect(result.basedOnPatterns[0].historicalProduct).toBe(
      productNameHistorical,
    );
    expect(result.basedOnPatterns[0].historicalDecisionFactor).toBe(
      decisionFactor,
    );

    // 信頼度スコア（0～100）の検証
    expect(result.confidenceScore).toBe(85);
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(100);

    // AIエンジンの呼び出しを検証
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      recommendationInput,
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationInput,
      expect.any(Array),
    );
  });
});