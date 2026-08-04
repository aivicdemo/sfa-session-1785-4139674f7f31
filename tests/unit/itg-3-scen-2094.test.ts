import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案内容と顧客対応パターンの標準プロセス照合分析', () => {
  // SCEN-2094
  test('顧客マスタから取得した顧客属性が標準プロセス照合に反映される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerAttributesPattern1 = {
      industry: '製造業',
      company_size: '大企業',
      region: '関東',
      past_purchase_category: 'SaaS製品',
      contract_status: '既存顧客',
    };

    const dealConditionsPattern1 = {
      customer_id: 'CUST001',
      customer_attributes: customerAttributesPattern1,
      deal_value: 5000000,
      deal_timeline_days: 90,
      product_category: 'エンタープライズソリューション',
      previous_interactions_count: 12,
    };

    const standardProcessPattern1 = {
      proposal_flow: '段階的承認プロセス（CFO→CTO→CEO）',
      followup_frequency_days: 14,
      proposal_document_structure: '経営指標連携型（ROI・導入効果シミュレーション含む）',
      estimated_decision_cycle_days: 120,
    };

    const recommendationResultPattern1 = {
      recommended_approach: 'エンタープライズ営業モデル',
      standard_process: standardProcessPattern1,
      confidence_score: 87,
      matched_customer_segment: '大規模製造業_関東地域',
      applicability_reason: '顧客属性が標準パターンマスタの「大企業・製造業」セグメントと完全合致',
    };

    mockAIEngine.generateRecommendation.mockResolvedValueOnce(
      recommendationResultPattern1
    );

    const resultPattern1 = await generateRecommendation(
      dealConditionsPattern1,
      mockAIEngine
    );

    expect(resultPattern1.standard_process.proposal_flow).toBe(
      '段階的承認プロセス（CFO→CTO→CEO）'
    );
    expect(resultPattern1.standard_process.followup_frequency_days).toBe(14);
    expect(resultPattern1.standard_process.proposal_document_structure).toBe(
      '経営指標連携型（ROI・導入効果シミュレーション含む）'
    );
    expect(resultPattern1.confidence_score).toBe(87);
    expect(resultPattern1.matched_customer_segment).toBe(
      '大規模製造業_関東地域'
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      dealConditionsPattern1
    );

    const customerAttributesPattern2 = {
      industry: 'IT',
      company_size: '中小企業',
      region: '関西',
      past_purchase_category: 'クラウドサービス',
      contract_status: '新規顧客',
    };

    const dealConditionsPattern2 = {
      customer_id: 'CUST002',
      customer_attributes: customerAttributesPattern2,
      deal_value: 800000,
      deal_timeline_days: 60,
      product_category: 'クラウドソリューション',
      previous_interactions_count: 2,
    };

    const standardProcessPattern2 = {
      proposal_flow: '単一決裁者承認（経営者直決）',
      followup_frequency_days: 7,
      proposal_document_structure: 'コスト削減・生産性向上シンプル版',
      estimated_decision_cycle_days: 45,
    };

    const recommendationResultPattern2 = {
      recommended_approach: 'スタートアップフレンドリー営業モデル',
      standard_process: standardProcessPattern2,
      confidence_score: 82,
      matched_customer_segment: '中小IT企業_関西地域',
      applicability_reason: '顧客属性が標準パターンマスタの「中小企業・IT業」セグメントと完全合致',
    };

    mockAIEngine.generateRecommendation.mockResolvedValueOnce(
      recommendationResultPattern2
    );

    const resultPattern2 = await generateRecommendation(
      dealConditionsPattern2,
      mockAIEngine
    );

    expect(resultPattern2.standard_process.proposal_flow).toBe(
      '単一決裁者承認（経営者直決）'
    );
    expect(resultPattern2.standard_process.followup_frequency_days).toBe(7);
    expect(resultPattern2.standard_process.proposal_document_structure).toBe(
      'コスト削減・生産性向上シンプル版'
    );
    expect(resultPattern2.confidence_score).toBe(82);
    expect(resultPattern2.matched_customer_segment).toBe(
      '中小IT企業_関西地域'
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      dealConditionsPattern2
    );

    expect(resultPattern1.standard_process).not.toEqual(
      resultPattern2.standard_process
    );
    expect(resultPattern1.recommended_approach).not.toBe(
      resultPattern2.recommended_approach
    );
  });
});