import { describe, test, expect, beforeEach } from '@jest/globals';
import { RecommendationReasoningGenerator } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  let generator: RecommendationReasoningGenerator;
  let mockFindSimilarPatterns: jest.Mock;
  let mockExplainRecommendationReasoning: jest.Mock;

  beforeEach(() => {
    mockFindSimilarPatterns = jest.fn();
    mockExplainRecommendationReasoning = jest.fn();
    
    generator = new RecommendationReasoningGenerator(
      { findSimilarPatterns: mockFindSimilarPatterns } as any,
      { explainRecommendationReasoning: mockExplainRecommendationReasoning } as any
    );
  });

  // SCEN-581
  test('過去成功事例の参照件数が1件のときその事例が根拠説明に含まれる', () => {
    const pastCaseData = {
      caseId: 'CASE-001',
      customerIndustry: '製造業',
      proposalContent: 'コスト削減ソリューション',
      successFlag: true,
      adoptionRate: 85
    };

    const newProjectInfo = {
      customerId: 'CUST-999',
      dealCondition: 'cost_optimization',
      customerIndustry: '製造業'
    };

    const similarPatterns = [pastCaseData];

    mockFindSimilarPatterns.mockReturnValue(similarPatterns);

    const expectedExplanation = '過去の製造業向け案件（CASE-001）では同様のコスト削減ソリューション提案により成功実績があります。';

    mockExplainRecommendationReasoning.mockReturnValue(expectedExplanation);

    const result = generator.generateExplanation(newProjectInfo, similarPatterns);

    expect(result).toContain('CASE-001');
    expect(result).toContain('製造業');
    expect(result).toContain('コスト削減ソリューション');
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newProjectInfo);
    expect(mockExplainRecommendationReasoning).toHaveBeenCalledWith(
      newProjectInfo,
      similarPatterns
    );
  });
});