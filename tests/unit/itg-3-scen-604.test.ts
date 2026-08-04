import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-604
  test('[normal] 推奨内容の根拠表示機能 - 根拠情報が自然言語で営業担当者向けに説明される', () => {
    const new_deal_data = {
      customer_industry: '製造業',
      customer_issue: '生産効率化',
      budget_amount: 5000000,
      decision_maker: '工場長',
    };

    const stub_ai_engine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        'この顧客は製造業で生産効率化の課題を抱えており、過去3年間で同業種・同規模・同予算帯での成功事例が5件あります。そのうち4件は初期段階で工場長向けのROI試算資料を提示することで商談が進展しています。推奨アプローチ「工場長向けROI試算資料の事前準備」は、類似事例との合致度が92%で、成功確度が高いと判断されました。'
      ),
    };

    const result = explainRecommendationReasoning(new_deal_data, stub_ai_engine);

    expect(stub_ai_engine.explainRecommendationReasoning).toHaveBeenCalledWith(new_deal_data);
    expect(result).toContain('製造業');
    expect(result).toContain('生産効率化');
    expect(result).toContain('過去3年間');
    expect(result).toContain('5件');
    expect(result).toContain('4件');
    expect(result).toContain('工場長向けのROI試算資料');
    expect(result).toContain('工場長向けROI試算資料の事前準備');
    expect(result).toContain('92%');
    expect(result).toContain('成功確度が高い');
  });
});