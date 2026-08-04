import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容検証判定機能 - 成功パターン抽出の信頼度スコア検証', () => {
  test('SCEN-2877: 信頼度スコアが100を超える場合、エラーコードPATTERN_CONFIDENCE_EXCEEDS_THRESHOLDを返す', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        confidence_score: 100.5,
        is_applicable: true,
        reasoning: 'Pattern highly relevant but score exceeds threshold'
      })
    };

    const newProjectData = {
      customer_id: 'CUST001',
      customer_industry: '製造業',
      customer_size: '中堅企業',
      deal_stage: '提案段階',
      product_category: 'システム導入',
      estimated_deal_value: 5000000,
      deal_conditions: {
        budget_limit: 5000000,
        implementation_timeline_days: 90,
        required_features: ['在庫管理', '受発注管理']
      }
    };

    const successPatterns = [
      {
        pattern_id: 'PAT001',
        customer_industry: '製造業',
        success_rate: 0.85,
        revenue_range_min: 3000000,
        revenue_range_max: 8000000,
        implementation_period_days: 90,
        key_success_factors: ['要件定義の丁寧さ', '導入支援体制'],
        common_failure_factors: ['スケジュール遵守の困難さ']
      }
    ];

    let result: any;
    try {
      result = evaluatePatternRelevance(
        newProjectData,
        successPatterns,
        mockAIRecommendationEngine
      );
    } catch (error: any) {
      result = error;
    }

    expect(result).toBeDefined();
    expect(result.error_code).toBe('PATTERN_CONFIDENCE_EXCEEDS_THRESHOLD');
    expect(result.message).toMatch(/信頼度スコア/);
    expect(result.message).toMatch(/閾値/);
    expect(result.detected_confidence_score).toBe(100.5);
    expect(result.threshold_limit).toBe(100);
    expect(result.fallback_pattern).toBeDefined();
    expect(result.fallback_pattern.source).toBe('推奨パターンマスタ');
    expect(Array.isArray(result.fallback_pattern.patterns)).toBe(true);
    expect(result.fallback_pattern.patterns.length).toBeGreaterThan(0);
  });
});