import { displayRecommendationReasons } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2721
  test('複数の候補提案アプローチが適用可能性スコアの高い順にランク付けされて表示される', () => {
    const customer_industry = '製造業';
    const company_scale = '中堅企業';
    const business_issue = '生産効率化';
    const budget = 5000000;
    const decision_timeline_days = 90;

    const ai_engine_stub = {
      generateRecommendation: jest.fn().mockReturnValue({
        candidates: [
          {
            approach_id: 'APP_A',
            approach_name: '導入支援パッケージ',
            applicability_score: 0.92,
            rationale: '顧客の生産効率化課題に直結した支援体制が整備されている',
          },
          {
            approach_id: 'APP_B',
            approach_name: 'コンサルティング先行型',
            applicability_score: 0.78,
            rationale: '段階的な導入により顧客の組織体制の適応を支援',
          },
          {
            approach_id: 'APP_C',
            approach_name: '段階的導入プラン',
            applicability_score: 0.85,
            rationale: '予算制約下での分割導入による費用最適化',
          },
        ],
      }),
    };

    const result = displayRecommendationReasons(
      {
        customer_industry,
        company_scale,
        business_issue,
        budget,
        decision_timeline_days,
      },
      ai_engine_stub
    );

    expect(result.recommendation_candidates).toHaveLength(3);

    expect(result.recommendation_candidates[0]).toEqual({
      rank: 1,
      approach_id: 'APP_A',
      approach_name: '導入支援パッケージ',
      applicability_score: 0.92,
      rationale: '顧客の生産効率化課題に直結した支援体制が整備されている',
    });

    expect(result.recommendation_candidates[1]).toEqual({
      rank: 2,
      approach_id: 'APP_C',
      approach_name: '段階的導入プラン',
      applicability_score: 0.85,
      rationale: '予算制約下での分割導入による費用最適化',
    });

    expect(result.recommendation_candidates[2]).toEqual({
      rank: 3,
      approach_id: 'APP_B',
      approach_name: 'コンサルティング先行型',
      applicability_score: 0.78,
      rationale: '段階的な導入により顧客の組織体制の適応を支援',
    });

    expect(result.recommendation_candidates[0].applicability_score).toBeGreaterThan(
      result.recommendation_candidates[1].applicability_score
    );
    expect(result.recommendation_candidates[1].applicability_score).toBeGreaterThan(
      result.recommendation_candidates[2].applicability_score
    );

    expect(ai_engine_stub.generateRecommendation).toHaveBeenCalledWith({
      customer_industry,
      company_scale,
      business_issue,
      budget,
      decision_timeline_days,
    });
  });
});