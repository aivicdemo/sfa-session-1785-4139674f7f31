import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1917
  test('推奨根拠の可視化機能 - 根拠データが昇順で並ぶときに正しく返却される', () => {
    const stub_findSimilarPatterns = jest.fn(() => [
      {
        patternId: 'pattern_001',
        relevanceScore: 0.65,
        matchingFactors: ['industry_match', 'budget_fit'],
        customerAttributes: { industry: 'manufacturing', size: 'large' },
        proposalContent: 'cost_reduction_proposal'
      },
      {
        patternId: 'pattern_002',
        relevanceScore: 0.78,
        matchingFactors: ['industry_match', 'timeline_fit', 'stakeholder_alignment'],
        customerAttributes: { industry: 'manufacturing', size: 'large' },
        proposalContent: 'efficiency_improvement_proposal'
      },
      {
        patternId: 'pattern_003',
        relevanceScore: 0.92,
        matchingFactors: ['industry_match', 'budget_fit', 'timeline_fit', 'stakeholder_alignment'],
        customerAttributes: { industry: 'manufacturing', size: 'large' },
        proposalContent: 'digital_transformation_proposal'
      }
    ]);

    const input_recommendationId = 'rec_12345';
    const input_sortAscending = true;

    const result = explainRecommendationReasoning(
      input_recommendationId,
      stub_findSimilarPatterns,
      input_sortAscending
    );

    expect(result).toBeDefined();
    expect(Array.isArray(result.reasoningBasis)).toBe(true);
    expect(result.reasoningBasis.length).toBe(3);

    expect(result.reasoningBasis[0].relevanceScore).toBe(0.65);
    expect(result.reasoningBasis[0].patternId).toBe('pattern_001');
    expect(result.reasoningBasis[0].index).toBe(0);
    expect(result.reasoningBasis[0].matchingFactors).toEqual([
      'industry_match',
      'budget_fit'
    ]);
    expect(result.reasoningBasis[0].customerAttributes).toEqual({
      industry: 'manufacturing',
      size: 'large'
    });
    expect(result.reasoningBasis[0].proposalContent).toBe(
      'cost_reduction_proposal'
    );

    expect(result.reasoningBasis[1].relevanceScore).toBe(0.78);
    expect(result.reasoningBasis[1].patternId).toBe('pattern_002');
    expect(result.reasoningBasis[1].index).toBe(1);
    expect(result.reasoningBasis[1].matchingFactors).toEqual([
      'industry_match',
      'timeline_fit',
      'stakeholder_alignment'
    ]);
    expect(result.reasoningBasis[1].customerAttributes).toEqual({
      industry: 'manufacturing',
      size: 'large'
    });
    expect(result.reasoningBasis[1].proposalContent).toBe(
      'efficiency_improvement_proposal'
    );

    expect(result.reasoningBasis[2].relevanceScore).toBe(0.92);
    expect(result.reasoningBasis[2].patternId).toBe('pattern_003');
    expect(result.reasoningBasis[2].index).toBe(2);
    expect(result.reasoningBasis[2].matchingFactors).toEqual([
      'industry_match',
      'budget_fit',
      'timeline_fit',
      'stakeholder_alignment'
    ]);
    expect(result.reasoningBasis[2].customerAttributes).toEqual({
      industry: 'manufacturing',
      size: 'large'
    });
    expect(result.reasoningBasis[2].proposalContent).toBe(
      'digital_transformation_proposal'
    );
  });
});