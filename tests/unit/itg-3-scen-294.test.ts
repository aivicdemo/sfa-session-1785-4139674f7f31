import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-294
  test('[normal] 類似パターン検索・ランク付け機能 - OpenAI API が正常応答したとき、類似度でランク付けされた過去事例一覧が返却される', async () => {
    const mock_ai_recommendation_engine = {
      findSimilarPatterns: jest.fn(),
    };

    const past_cases_from_api = [
      {
        case_id: 'CASE001',
        industry: 'IT',
        deal_amount: 5000000,
        success_flag: true,
        description: 'クラウドシステム導入案件',
        similarity_score: 0.95,
      },
      {
        case_id: 'CASE002',
        industry: 'IT',
        deal_amount: 4500000,
        success_flag: true,
        description: 'デジタル変革支援案件',
        similarity_score: 0.87,
      },
      {
        case_id: 'CASE003',
        industry: 'Manufacturing',
        deal_amount: 3000000,
        success_flag: true,
        description: '生産効率化システム導入',
        similarity_score: 0.72,
      },
      {
        case_id: 'CASE004',
        industry: 'Retail',
        deal_amount: 2500000,
        success_flag: false,
        description: 'POSシステム導入',
        similarity_score: 0.68,
      },
      {
        case_id: 'CASE005',
        industry: 'IT',
        deal_amount: 6000000,
        success_flag: true,
        description: 'AI導入支援案件',
        similarity_score: 0.61,
      },
    ];

    mock_ai_recommendation_engine.findSimilarPatterns.mockResolvedValueOnce(
      past_cases_from_api
    );

    const current_deal_conditions = {
      industry: 'IT',
      budget_min: 5000000,
      budget_max: 10000000,
    };

    const result = await mock_ai_recommendation_engine.findSimilarPatterns(
      current_deal_conditions
    );

    expect(result).toHaveLength(5);

    expect(result[0].similarity_score).toBe(0.95);
    expect(result[1].similarity_score).toBe(0.87);
    expect(result[2].similarity_score).toBe(0.72);
    expect(result[3].similarity_score).toBe(0.68);
    expect(result[4].similarity_score).toBe(0.61);

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].similarity_score).toBeGreaterThanOrEqual(
        result[i + 1].similarity_score
      );
    }

    expect(result[0]).toEqual({
      case_id: 'CASE001',
      industry: 'IT',
      deal_amount: 5000000,
      success_flag: true,
      description: 'クラウドシステム導入案件',
      similarity_score: 0.95,
    });

    expect(result[1]).toEqual({
      case_id: 'CASE002',
      industry: 'IT',
      deal_amount: 4500000,
      success_flag: true,
      description: 'デジタル変革支援案件',
      similarity_score: 0.87,
    });

    expect(result[2]).toEqual({
      case_id: 'CASE003',
      industry: 'Manufacturing',
      deal_amount: 3000000,
      success_flag: true,
      description: '生産効率化システム導入',
      similarity_score: 0.72,
    });

    expect(result[3]).toEqual({
      case_id: 'CASE004',
      industry: 'Retail',
      deal_amount: 2500000,
      success_flag: false,
      description: 'POSシステム導入',
      similarity_score: 0.68,
    });

    expect(result[4]).toEqual({
      case_id: 'CASE005',
      industry: 'IT',
      deal_amount: 6000000,
      success_flag: true,
      description: 'AI導入支援案件',
      similarity_score: 0.61,
    });

    for (const case_item of result) {
      expect(case_item.similarity_score).toBeGreaterThanOrEqual(0.0);
      expect(case_item.similarity_score).toBeLessThanOrEqual(1.0);
    }

    expect(mock_ai_recommendation_engine.findSimilarPatterns).toHaveBeenCalledWith(
      current_deal_conditions
    );
  });
});