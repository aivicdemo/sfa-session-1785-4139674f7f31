import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1541
  test('成功パターンが1件のみ適用可能な場合、その1件の根拠が単一選択肢として表示される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        applicablePatterns: [
          {
            patternId: 'pattern_001',
            relevanceScore: 0.85,
            matchedAttributes: {
              industry: 'IT',
              companySize: 'mid_market',
              challengeType: 'digital_transformation'
            }
          }
        ]
      }),
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedApproach: 'Phased Digital Transformation',
        proposalStrategy: '段階的なデジタル変革推進を提案',
        successPatternReference: 'pattern_001'
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanations: [
          {
            patternId: 'pattern_001',
            reasoning: '過去の類似案件5件で成功した営業アプローチ：IT企業の経営課題に対する段階的な提案進め方',
            evidenceCount: 5,
            successRate: 0.92
          }
        ]
      })
    };

    const newProjectData = {
      customerId: 'cust_20240115_001',
      customerIndustry: 'IT',
      customerSize: 'mid_market',
      businessChallenge: 'digital_transformation',
      dealAmount: 2500000,
      dealCycle: 90
    };

    const result = generateRecommendationWithReasoning(
      newProjectData,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.recommendationOptions).toHaveLength(1);
    expect(result.recommendationOptions[0]).toEqual({
      patternId: 'pattern_001',
      reasoning: '過去の類似案件5件で成功した営業アプローチ：IT企業の経営課題に対する段階的な提案進め方',
      isSelected: true,
      evidenceCount: 5,
      successRate: 0.92
    });
    expect(result.recommendationOptions[0].reasoning).toBeTruthy();
    expect(result.recommendationOptions[0].reasoning).not.toEqual('');
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: 'IT',
        companySize: 'mid_market',
        challengeType: 'digital_transformation'
      })
    );
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'cust_20240115_001'
      })
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        patternId: 'pattern_001'
      })
    );
  });
});