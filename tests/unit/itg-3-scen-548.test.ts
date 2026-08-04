import { describe, test, expect, beforeEach } from '@jest/globals';
import { decideSalesGuidancePolicy } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-548
  test('改善対象項目が0件のとき方針が維持指示になる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const guidancePolicyInput = {
      salesPersonId: 'SP001',
      improvementItems: [],
      reportingPeriod: '2024-01',
      dataQualityScore: 92,
    };

    const result = decideSalesGuidancePolicy(guidancePolicyInput, mockAIEngine);

    expect(result.policyStatus).toBe('MAINTAIN_CURRENT');
    expect(result.policyMessage).toBe(
      '現在の営業活動を継続してください。改善対象項目がないため、既存のアプローチを維持してください'
    );
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});