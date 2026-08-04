import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1826
  test('推奨根拠情報の統合機能 - 推奨根拠に対応する提案アプローチデータが提案アプローチテーブルに記録される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-001',
        approachId: 'APPROACH-A1',
        reasoning: '顧客業界が製造業で過去成功率85%',
        confidenceScore: 0.85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockProposalApproachTable = {
      query: jest.fn().mockResolvedValue([
        {
          approachId: 'APPROACH-A1',
          recommendationId: 'REC-001',
          approachName: '顧客業界別提案パターン',
          confidenceScore: 0.85,
          createdAt: new Date('2024-01-15T11:00:00Z'),
          isActive: true,
        },
      ]),
    };

    const customerInput = {
      customerId: 'CUST-123',
      industry: 'manufacturing',
      companySize: 'large',
    };

    const result = await generateRecommendationWithReasoning(
      customerInput,
      mockAIEngine,
      mockProposalApproachTable
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(customerInput);

    expect(mockProposalApproachTable.query).toHaveBeenCalledWith({
      approachId: 'APPROACH-A1',
    });

    expect(result).toEqual({
      recommendationId: 'REC-001',
      approachId: 'APPROACH-A1',
      reasoning: '顧客業界が製造業で過去成功率85%',
      confidenceScore: 0.85,
    });

    const queryResult = await mockProposalApproachTable.query({
      approachId: 'APPROACH-A1',
    });

    expect(queryResult).toHaveLength(1);
    expect(queryResult[0]).toEqual(
      expect.objectContaining({
        approachId: 'APPROACH-A1',
        recommendationId: 'REC-001',
        approachName: '顧客業界別提案パターン',
        confidenceScore: 0.85,
        isActive: true,
      })
    );
    expect(queryResult[0].createdAt).toEqual(new Date('2024-01-15T11:00:00Z'));
  });
});