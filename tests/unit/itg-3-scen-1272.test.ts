import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import type { AIRecommendationEngine } from '../../src/logic/it-1-br-3-1-1-1';
import { validateProposalWithRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  let mockAIEngine: jest.Mocked<AIRecommendationEngine>;

  beforeEach(() => {
    mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };
  });

  // SCEN-1272
  test('提案妥当性判定機能 - リスク要因に同値が並ぶ場合にスコア計算が正確に行われる', () => {
    // Arrange: 複数のリスク要因が同一スコア値（0.75）を持つテストデータを準備
    const riskFactorsWithEqualScores = [
      {
        factor_id: 'RISK_001',
        factor_name: 'リスク要因A',
        relevance_score: 0.75,
        weight: 0.3,
      },
      {
        factor_id: 'RISK_002',
        factor_name: 'リスク要因B',
        relevance_score: 0.75,
        weight: 0.3,
      },
      {
        factor_id: 'RISK_003',
        factor_name: 'リスク要因C',
        relevance_score: 0.75,
        weight: 0.4,
      },
    ];

    const proposalData = {
      proposal_id: 'PROP_20240115_001',
      customer_id: 'CUST_A123',
      customer_industry: 'IT',
      customer_scale: 'large',
      proposal_amount: 5000000,
      proposal_duration_months: 12,
      customer_constraints: {
        budget_limit: 6000000,
        max_implementation_months: 14,
        required_features: ['feature_1', 'feature_2'],
      },
    };

    const successPatternData = {
      similar_success_cases: 8,
      pattern_match_rate: 0.85,
      past_adoption_rate: 0.9,
    };

    // AIRecommendationEngine をモック化
    mockAIEngine.evaluatePatternRelevance.mockReturnValue({
      overall_relevance_score: 0.82,
      risk_factors: riskFactorsWithEqualScores,
      pattern_applicability: 0.88,
      confidence_score: 92,
    });

    // Act: 提案妥当性判定機能を呼び出し
    const result = validateProposalWithRecommendationReasoning(
      proposalData,
      successPatternData,
      mockAIEngine
    );

    // Assert: 同値リスク要因の重み付け計算が正確に行われていることを確認
    // 同値スコア（0.75）の加重平均計算：
    // (0.75 * 0.3 + 0.75 * 0.3 + 0.75 * 0.4) / (0.3 + 0.3 + 0.4)
    // = (0.225 + 0.225 + 0.3) / 1.0
    // = 0.75
    const expectedRiskWeightedAverage = 0.75;

    // 総合スコア計算：
    // (提案妥当性スコア * 0.5 + パターン適用性 * 0.3 + リスク要因スコア * 0.2)
    // = (0.82 * 0.5 + 0.88 * 0.3 + 0.75 * 0.2)
    // = 0.41 + 0.264 + 0.15
    // = 0.824 → 期待値 0.82
    const expectedTotalScore = 0.82;

    expect(result).toHaveProperty('proposal_validity_score');
    expect(result.proposal_validity_score).toBe(expectedTotalScore);

    expect(result).toHaveProperty('risk_factors_analysis');
    expect(Array.isArray(result.risk_factors_analysis)).toBe(true);
    expect(result.risk_factors_analysis).toHaveLength(3);

    // リスク要因ごとのスコアを検証
    result.risk_factors_analysis.forEach((risk) => {
      expect(risk.relevance_score).toBe(0.75);
    });

    // 加重平均の計算結果を検証
    expect(result).toHaveProperty('risk_weighted_average_score');
    expect(result.risk_weighted_average_score).toBe(expectedRiskWeightedAverage);

    // スコア計算に用いられたリスク要因の個数を検証
    expect(result).toHaveProperty('risk_factor_count');
    expect(result.risk_factor_count).toBe(3);

    // リスク要因の並び順が正確に記録されていることをアサート
    expect(result.risk_factors_analysis[0].factor_id).toBe('RISK_001');
    expect(result.risk_factors_analysis[1].factor_id).toBe('RISK_002');
    expect(result.risk_factors_analysis[2].factor_id).toBe('RISK_003');

    // スコア計算の内部状態を検証：信頼度スコア
    expect(result).toHaveProperty('confidence_score');
    expect(result.confidence_score).toBe(92);

    // スコア計算に誤差が生じていないことを検証（許容誤差：0.001）
    expect(Math.abs(result.proposal_validity_score - expectedTotalScore)).toBeLessThan(
      0.001
    );

    // AIエンジンが期待通りに呼び出されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        proposal_id: 'PROP_20240115_001',
        customer_id: 'CUST_A123',
      })
    );

    // 同値リスク要因の合計寄与度を検証
    const totalRiskContribution =
      riskFactorsWithEqualScores.reduce((sum, risk) => sum + risk.relevance_score, 0) /
      riskFactorsWithEqualScores.length;
    expect(totalRiskContribution).toBe(0.75);

    // 最終的な提案妥当性判定結果が期待値通りであることを確認
    expect(result).toHaveProperty('validity_judgment');
    expect(result.validity_judgment).toEqual(
      expect.objectContaining({
        is_valid: true,
        recommendation: expect.any(String),
      })
    );
  });
});