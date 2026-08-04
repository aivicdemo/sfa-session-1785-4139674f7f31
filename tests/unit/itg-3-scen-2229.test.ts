import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-2229
  test('過去商談が複数件のとき全成功パターンから最適なものが選出される', async () => {
    const past_deals = [
      {
        deal_id: 'DEAL001',
        customer_industry: '製造業',
        product_category: 'ERP',
        proposal_approach: '既存システム連携型導入',
        success_indicator: 1,
        pattern_priority: 85,
      },
      {
        deal_id: 'DEAL002',
        customer_industry: '製造業',
        product_category: 'ERP',
        proposal_approach: 'クラウド移行型提案',
        success_indicator: 1,
        pattern_priority: 78,
      },
      {
        deal_id: 'DEAL003',
        customer_industry: '製造業',
        product_category: 'ERP',
        proposal_approach: 'コスト削減重視型提案',
        success_indicator: 1,
        pattern_priority: 72,
      },
      {
        deal_id: 'DEAL004',
        customer_industry: '製造業',
        product_category: 'ERP',
        proposal_approach: '業務最適化型提案',
        success_indicator: 1,
        pattern_priority: 80,
      },
      {
        deal_id: 'DEAL005',
        customer_industry: '製造業',
        product_category: 'ERP',
        proposal_approach: 'セキュリティ強化型提案',
        success_indicator: 1,
        pattern_priority: 75,
      },
    ];

    const new_deal_context = {
      customer_industry: '製造業',
      product_category: 'ERP',
      budget_scale: 5000000,
      existing_system_present: true,
    };

    const mock_ai_engine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          pattern_id: 'DEAL001',
          similarity_score: 0.85,
          deal_data: past_deals[0],
        },
        {
          pattern_id: 'DEAL002',
          similarity_score: 0.85,
          deal_data: past_deals[1],
        },
        {
          pattern_id: 'DEAL003',
          similarity_score: 0.85,
          deal_data: past_deals[2],
        },
        {
          pattern_id: 'DEAL004',
          similarity_score: 0.85,
          deal_data: past_deals[3],
        },
        {
          pattern_id: 'DEAL005',
          similarity_score: 0.85,
          deal_data: past_deals[4],
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue([
        { pattern_id: 'DEAL001', relevance_score: 0.82 },
        { pattern_id: 'DEAL002', relevance_score: 0.80 },
        { pattern_id: 'DEAL003', relevance_score: 0.81 },
        { pattern_id: 'DEAL004', relevance_score: 0.80 },
        { pattern_id: 'DEAL005', relevance_score: 0.80 },
      ]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommended_pattern_id: 'DEAL001',
        recommendation_approach:
          '顧客の既存システムとの連携を軸にした段階的導入提案',
        confidence_score: 82,
        pattern_details: {
          pattern_id: 'DEAL001',
          customer_industry: '製造業',
          product_category: 'ERP',
          proposal_method: '既存システム連携型導入',
        },
      }),
    };

    const result = await generateRecommendation(
      new_deal_context,
      past_deals,
      mock_ai_engine
    );

    expect(result.recommended_pattern_id).toBe('DEAL001');
    expect(result.recommendation_approach).toBe(
      '顧客の既存システムとの連携を軸にした段階的導入提案'
    );
    expect(result.confidence_score).toBe(82);
    expect(result.pattern_details.pattern_id).toBe('DEAL001');
    expect(result.pattern_details.customer_industry).toBe('製造業');
    expect(result.pattern_details.product_category).toBe('ERP');
    expect(result.pattern_details.proposal_method).toBe(
      '既存システム連携型導入'
    );

    expect(mock_ai_engine.findSimilarPatterns).toHaveBeenCalledWith(
      new_deal_context,
      past_deals
    );
    expect(mock_ai_engine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ pattern_id: 'DEAL001' }),
        expect.objectContaining({ pattern_id: 'DEAL002' }),
        expect.objectContaining({ pattern_id: 'DEAL003' }),
        expect.objectContaining({ pattern_id: 'DEAL004' }),
        expect.objectContaining({ pattern_id: 'DEAL005' }),
      ]),
      new_deal_context
    );
    expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledWith(
      new_deal_context,
      expect.any(Array)
    );
  });
});