import { designSuccessPatternTemplate } from '../../src/logic/it-1-br-3-3-2-1';

describe('営業成功パターンの構造化テンプレート設計機能', () => {
  test('SCEN-2496: [normal] 営業プロセスの1つのステップにおける成功パターンが構造化テンプレートに組み込まれる', () => {
    // Stub for AIRecommendationEngine
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 92,
        isApplicable: true,
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          caseId: 'case_001',
          customerSize: 'mid_enterprise',
          industry: 'manufacturing',
          proposalApproach: 'roi_focused',
          successRate: 0.85,
        },
      ]),
    };

    const input_caseData = {
      stepId: 'initial_proposal_phase',
      stepName: '初回提案フェーズ',
      customerInfo: {
        size: 'mid_enterprise',
        industry: 'manufacturing',
      },
      dealInfo: {
        proposalApproach: 'roi_focused',
      },
      pastSuccessCases: [
        {
          caseId: 'case_001',
          customerSize: 'mid_enterprise',
          industry: 'manufacturing',
          proposalApproach: 'roi_focused',
          successRate: 0.85,
        },
      ],
    };

    const result = designSuccessPatternTemplate(input_caseData, mockAIRecommendationEngine);

    // Verify structure of generated template
    expect(result).toEqual({
      stepId: 'initial_proposal_phase',
      stepName: '初回提案フェーズ',
      successPatterns: [
        {
          patternId: expect.any(String),
          customerSize: 'mid_enterprise',
          industry: 'manufacturing',
          proposalApproach: 'roi_focused',
          relevanceScore: 92,
          sequencePosition: 0,
          isApplicable: true,
        },
      ],
      templateStatus: 'active',
    });

    // Verify the pattern details
    const generatedPattern = result.successPatterns[0];
    expect(generatedPattern.customerSize).toBe('mid_enterprise');
    expect(generatedPattern.industry).toBe('manufacturing');
    expect(generatedPattern.proposalApproach).toBe('roi_focused');
    expect(generatedPattern.relevanceScore).toBe(92);
    expect(generatedPattern.sequencePosition).toBe(0);

    // Verify AI engine was called
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();
  });
});