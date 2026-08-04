import { generateRecommendationWithReasoningDisplay } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2614
  test('推奨提案アプローチの根拠として参照される過去商談が1件の場合、そのデータが正確に表示される', () => {
    // テストデータ: 過去商談1件
    const pastDealData = {
      customer_industry: '製造業',
      budget_scale: '500万円以上',
      implementation_period: '3ヶ月',
      success_flag: true,
      success_reason: '顧客の既存システムとの統合が円滑に進み、導入期間内に完了できた。営業担当者による定期的なフォローアップと技術サポートが功を奏した。',
    };

    // 新規案件条件
    const newDealCondition = {
      customer_industry: '製造業',
      budget_scale: '500万円以上',
      implementation_period: '3ヶ月',
    };

    // AIRecommendationEngine のスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendation_id: 'rec_001',
        recommended_approach: '製造業向けの統合型ソリューション提案',
        confidence_score: 85,
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          pattern_id: 'pat_001',
          customer_industry: '製造業',
          budget_scale: '500万円以上',
          implementation_period: '3ヶ月',
          success_flag: true,
          past_deal_id: 'deal_past_001',
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '参照商談(deal_past_001)は同じ製造業で500万円以上の予算規模を持つ顧客でした。当案件では、既存システムとの統合が円滑に進み、導入期間内(3ヶ月)に完了できました。営業担当者による定期的なフォローアップと技術サポートが成功の要因でした。本案件も同様の体制で対応することで、成功の可能性が高いと予想されます。'
      ),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevance_score: 92,
        matched_attributes: ['customer_industry', 'budget_scale', 'implementation_period'],
      }),
    };

    // 関数実行
    const result = generateRecommendationWithReasoningDisplay(
      newDealCondition,
      mockAIEngine
    );

    // 検証: 根拠表示画面が生成されている
    expect(result).toHaveProperty('reasoning_display_section');
    expect(result.reasoning_display_section).toHaveProperty('referenced_past_deals');

    // 検証: 参照された過去商談が1件のみ表示される
    expect(result.reasoning_display_section.referenced_past_deals).toHaveLength(1);

    // 検証: 過去商談データが正確に表示される
    const referencedDeal = result.reasoning_display_section.referenced_past_deals[0];
    expect(referencedDeal.customer_industry).toBe('製造業');
    expect(referencedDeal.budget_scale).toBe('500万円以上');
    expect(referencedDeal.implementation_period).toBe('3ヶ月');

    // 検証: 根拠説明文に成功理由が自然言語で記載されている
    expect(result.reasoning_display_section).toHaveProperty('reasoning_text');
    expect(result.reasoning_display_section.reasoning_text).toContain('既存システムとの統合');
    expect(result.reasoning_display_section.reasoning_text).toContain('導入期間内');
    expect(result.reasoning_display_section.reasoning_text).toContain('定期的なフォローアップ');
    expect(result.reasoning_display_section.reasoning_text).toContain('技術サポート');

    // 検証: 根拠説明文が営業向けの表現である
    expect(result.reasoning_display_section.reasoning_text.length).toBeGreaterThan(50);
    expect(result.reasoning_display_section.reasoning_text).toMatch(/本案件|対応|可能性/);

    // 検証: AIエージェントメソッドが正しい順序で呼ばれている
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newDealCondition);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});