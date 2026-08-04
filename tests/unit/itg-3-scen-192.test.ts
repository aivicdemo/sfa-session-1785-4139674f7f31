import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件に適用可能な提案アプローチを推奨', () => {
  // SCEN-192: [edge] 内部パターンマスタ統計集計機能 - 全成功パターンから統計的に上位の提案アプローチが1件抽出される
  test('OpenAI API失敗時に内部パターンマスタから統計スコア最高のパターンが1件抽出される', () => {
    const internalPatternMaster = [
      {
        pattern_id: 'pattern_a',
        success_count: 150,
        adoption_rate: 0.85,
        approach_content: 'Executive summary with ROI focus'
      },
      {
        pattern_id: 'pattern_b',
        success_count: 120,
        adoption_rate: 0.78,
        approach_content: 'Technical deep dive approach'
      },
      {
        pattern_id: 'pattern_c',
        success_count: 95,
        adoption_rate: 0.72,
        approach_content: 'Risk mitigation focused approach'
      },
      {
        pattern_id: 'pattern_d',
        success_count: 110,
        adoption_rate: 0.81,
        approach_content: 'Agile transformation roadmap'
      }
    ];

    const aiEngineStub = {
      generateRecommendation: jest.fn().mockRejectedValueOnce(
        new Error('API timeout')
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const newDealData = {
      customer_id: 'cust_001',
      customer_industry: 'Manufacturing',
      customer_size: 'Enterprise',
      deal_value: 2500000,
      deal_stage: 'discovery'
    };

    const result = generateRecommendation(
      newDealData,
      aiEngineStub,
      internalPatternMaster
    );

    expect(result).toEqual({
      recommendation: {
        pattern_id: 'pattern_a',
        approach_content: 'Executive summary with ROI focus',
        success_count: 150,
        adoption_rate: 0.85,
        statistical_score: 127.5
      },
      confidence_score: 0,
      reasoning_brief: 'Selected from internal pattern master. Statistics: success_count × adoption_rate'
    });

    expect(Array.isArray(result.recommendation)).toBe(false);
  });
});