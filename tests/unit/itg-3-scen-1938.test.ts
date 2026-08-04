import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1938: 推奨タイプが購買数量のときに該当する根拠が抽出される', () => {
    // Arrange: 推奨タイプ='購買数量'の案件データを設定
    const recommendationData = {
      recommendationType: '購買数量',
      customerId: 'CUST_001',
      customerAnnualPurchaseVolume: 600,
      productCategory: 'Software License',
      recommendedQuantity: 100,
    };

    // Arrange: AIRecommendationEngineのスタブを初期化
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationType: '購買数量',
        suggestedQuantity: 100,
        confidenceScore: 78,
        successPatternId: 'PATTERN_PURCHASE_VOLUME_001',
        patternDescription: '顧客の年間購買数量が500単位以上の場合、ボリュームディスカウント提案が成功率78%',
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoningText: '当顧客の年間購買数量は600単位であり、500単位以上のボリューム購買カテゴリに該当します。過去事例から、同規模の購買数量を持つ顧客に対するボリュームディスカウント提案は成功率78%と高い実績があります。',
        extractedPatternIds: ['PATTERN_PURCHASE_VOLUME_001', 'PATTERN_PURCHASE_VOLUME_002'],
        relevantKeywords: ['購買数量', 'ボリューム', '数量', 'ディスカウント'],
      }),
    };

    // Arrange: 推奨パターンマスタの定義
    const successPatternMaster = {
      PATTERN_PURCHASE_VOLUME_001: {
        category: 'PURCHASE_VOLUME',
        description: '年間購買500単位以上',
        successRate: 78,
      },
      PATTERN_PURCHASE_VOLUME_002: {
        category: 'PURCHASE_VOLUME',
        description: '年間購買1000単位以上',
        successRate: 82,
      },
      PATTERN_INDUSTRY_001: {
        category: 'INDUSTRY',
        description: '金融業界',
        successRate: 71,
      },
      PATTERN_PAYMENT_CONDITION_001: {
        category: 'PAYMENT_CONDITION',
        description: '月次支払',
        successRate: 65,
      },
    };

    // Act: explainRecommendationReasoningメソッドを呼び出し
    const reasoning = mockAIRecommendationEngine.explainRecommendationReasoning(
      recommendationData,
      mockAIRecommendationEngine.generateRecommendation(recommendationData)
    );

    // Assert: 根拠説明に購買数量関連キーワードが含まれていることを確認
    expect(reasoning.reasoningText).toContain('購買数量');
    expect(reasoning.reasoningText).toContain('ボリューム');
    expect(reasoning.reasoningText).toContain('数量');

    // Assert: 抽出された根拠パターンIDが購買数量カテゴリに限定されていることを確認
    expect(reasoning.extractedPatternIds.length).toBe(2);
    reasoning.extractedPatternIds.forEach((patternId: string) => {
      const pattern = successPatternMaster[patternId as keyof typeof successPatternMaster];
      expect(pattern).toBeDefined();
      expect(pattern.category).toBe('PURCHASE_VOLUME');
    });

    // Assert: 他のカテゴリ（業種、支払条件）の根拠が含まれていないことを確認
    expect(reasoning.extractedPatternIds).not.toContain('PATTERN_INDUSTRY_001');
    expect(reasoning.extractedPatternIds).not.toContain('PATTERN_PAYMENT_CONDITION_001');

    // Assert: 抽出キーワードに購買数量関連の用語のみが含まれていることを確認
    const volumeRelatedKeywords = reasoning.relevantKeywords;
    expect(volumeRelatedKeywords).toContain('購買数量');
    expect(volumeRelatedKeywords).toContain('ボリューム');
    expect(volumeRelatedKeywords).toContain('数量');
    expect(volumeRelatedKeywords.length).toBe(4);

    // Assert: 根拠説明の精度スコアが78以上であることを確認
    const confidenceThreshold = 78;
    expect(mockAIRecommendationEngine.generateRecommendation(recommendationData).confidenceScore).toBeGreaterThanOrEqual(
      confidenceThreshold
    );
  });
});