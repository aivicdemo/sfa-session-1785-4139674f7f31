import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-202
  test('[normal] 営業担当者向けに推奨内容の根拠が自然言語で説明文として生成される', () => {
    // テスト用のモック営業案件データ
    const dealData = {
      customerId: 'cust_001',
      customerIndustry: 'IT',
      budgetAmount: 5000000,
      issue: 'システム統合',
      recommendationPatternId: 'pattern_78_success',
    };

    // AIRecommendationEngineのスタブ定義
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: 'システム統合ソリューションの段階的導入プラン',
        patternId: 'pattern_78_success',
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation:
          '過去12ヶ月の成功事例から、同規模のIT企業での提案では、システム統合ソリューションを段階的な導入プランとセットで提示した案件の成約率が78%であることが判明しています。本案件は顧客の課題・予算規模が類似しているため、同じアプローチを推奨します。',
        confidenceScore: 78,
        successExampleCount: 32,
      }),
    };

    // 推奨根拠表示機能を呼び出し
    const result = explainRecommendationReasoning(dealData, mockAIEngine);

    // システムが内部でexplainRecommendationReasoningメソッドを呼び出すことを確認
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      dealData,
    );

    // 画面上に表示される根拠説明文を検証
    expect(result).toEqual({
      explanation:
        '過去12ヶ月の成功事例から、同規模のIT企業での提案では、システム統合ソリューションを段階的な導入プランとセットで提示した案件の成約率が78%であることが判明しています。本案件は顧客の課題・予算規模が類似しているため、同じアプローチを推奨します。',
      confidenceScore: 78,
      successExampleCount: 32,
    });

    // 説明文が営業担当者向けの日本語で記述されていることを検証
    expect(result.explanation).toMatch(/成功事例/);
    expect(result.explanation).toMatch(/成約率/);
    expect(result.explanation).toMatch(/78%/);
    expect(result.explanation).toMatch(/類似/);

    // 説明文が具体的な成功率を含んでいることを検証
    expect(result.confidenceScore).toBe(78);

    // 説明文が過去事例の数を含んでいることを検証
    expect(result.successExampleCount).toBe(32);
  });
});