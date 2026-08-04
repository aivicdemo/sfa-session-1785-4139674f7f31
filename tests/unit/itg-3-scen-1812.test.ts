import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1812
  test('[normal] 推奨内容の根拠説明機能 - 根拠説明に顧客データの関連情報が含まれる', () => {
    const customer_id = 'CUST-20240115-001';
    const industry = '製造業';
    const budget_scale = '500万円以上';
    const implementation_timing = '2024年Q2';
    const current_challenge = '生産効率化';

    const ai_recommendation_engine_stub = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '顧客業種：製造業\n' +
        '予算規模：500万円以上\n' +
        '類似成功事例：同業種で同規模予算の案件3件\n' +
        '適用理由：入力された顧客の業種「製造業」、予算規模「500万円以上」、課題「生産効率化」に基づき、過去の同業種同規模案件から3件の成功パターンを抽出しました。これらの案件では同様の課題解決アプローチが採用され、平均ROI向上率125%を達成しています。'
      ),
    };

    const reasoning_text = explainRecommendationReasoning(
      {
        customer_id,
        industry,
        budget_scale,
        implementation_timing,
        current_challenge,
      },
      ai_recommendation_engine_stub
    );

    expect(ai_recommendation_engine_stub.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_id,
        industry,
        budget_scale,
        implementation_timing,
        current_challenge,
      })
    );

    expect(reasoning_text).toContain('顧客業種：製造業');
    expect(reasoning_text).toContain('予算規模：500万円以上');
    expect(reasoning_text).toContain('類似成功事例：同業種で同規模予算の案件3件');
    expect(reasoning_text).toContain('適用理由');
    expect(reasoning_text).toMatch(/3件/);
    expect(reasoning_text).toMatch(/製造業/);
    expect(reasoning_text).toMatch(/500万円以上/);
    expect(reasoning_text).toMatch(/生産効率化/);
  });
});