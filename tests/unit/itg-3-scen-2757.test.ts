import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2757
  test('根拠説明文の生成結果が同じ入力で複数回実行されたとき、毎回同じ説明が返される', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(
        (dealId: string, customerIndustry: string, recommendedApproach: string) => {
          return '小売業向けのクロスセル提案は、顧客の購買履歴から関連商品の需要が高いことが確認されています。過去の同業種案件で76%の成約率を達成しており、現在の顧客条件と一致する成功パターンです。推奨タイミングは決算月前であり、在庫補充需要が高まる時期です。';
        }
      ),
    };

    const dealId = 'DEAL-001';
    const customerIndustry = '小売';
    const recommendedApproach = 'クロスセル提案';

    const firstExecution = explainRecommendationReasoning(
      dealId,
      customerIndustry,
      recommendedApproach,
      mockAIEngine
    );

    const secondExecution = explainRecommendationReasoning(
      dealId,
      customerIndustry,
      recommendedApproach,
      mockAIEngine
    );

    const thirdExecution = explainRecommendationReasoning(
      dealId,
      customerIndustry,
      recommendedApproach,
      mockAIEngine
    );

    expect(firstExecution).toBe(
      '小売業向けのクロスセル提案は、顧客の購買履歴から関連商品の需要が高いことが確認されています。過去の同業種案件で76%の成約率を達成しており、現在の顧客条件と一致する成功パターンです。推奨タイミングは決算月前であり、在庫補充需要が高まる時期です。'
    );
    expect(secondExecution).toBe(firstExecution);
    expect(thirdExecution).toBe(firstExecution);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      1,
      dealId,
      customerIndustry,
      recommendedApproach
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      2,
      dealId,
      customerIndustry,
      recommendedApproach
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      3,
      dealId,
      customerIndustry,
      recommendedApproach
    );
  });
});