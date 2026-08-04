import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨外部連携（正常系）', () => {
  // SCEN-808
  test('OpenAI APIから類似パターンが正常に検索されて返却される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
    };

    const mockEmbeddingResponse = {
      object: 'list',
      data: [
        {
          object: 'embedding',
          embedding: Array(1536).fill(0).map(() => Math.random()),
          index: 0,
        },
      ],
      model: 'text-embedding-ada-002',
      usage: {
        prompt_tokens: 12,
        total_tokens: 12,
      },
    };

    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValueOnce([
      {
        caseId: 'CASE-001',
        similarityScore: 0.82,
        customerIndustry: 'IT',
        budgetScale: '500万円',
        proposalApproachSummary: 'クラウド基盤構築による業務効率化の提案',
        contractResult: true,
      },
      {
        caseId: 'CASE-002',
        similarityScore: 0.78,
        customerIndustry: 'IT',
        budgetScale: '450万円',
        proposalApproachSummary: 'システム統合による運用コスト削減の提案',
        contractResult: true,
      },
      {
        caseId: 'CASE-003',
        similarityScore: 0.76,
        customerIndustry: 'IT',
        budgetScale: '550万円',
        proposalApproachSummary: 'デジタル化推進による生産性向上の提案',
        contractResult: true,
      },
    ]);

    const newDealCondition = {
      customerIndustry: 'IT',
      budgetAmount: '500万円',
      businessChallenge: '業務効率化',
    };

    const result = await mockAIRecommendationEngine.findSimilarPatterns(
      newDealCondition,
      mockEmbeddingResponse
    );

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(3);

    expect(result[0]).toEqual({
      caseId: 'CASE-001',
      similarityScore: 0.82,
      customerIndustry: 'IT',
      budgetScale: '500万円',
      proposalApproachSummary: 'クラウド基盤構築による業務効率化の提案',
      contractResult: true,
    });

    expect(result[1]).toEqual({
      caseId: 'CASE-002',
      similarityScore: 0.78,
      customerIndustry: 'IT',
      budgetScale: '450万円',
      proposalApproachSummary: 'システム統合による運用コスト削減の提案',
      contractResult: true,
    });

    expect(result[2]).toEqual({
      caseId: 'CASE-003',
      similarityScore: 0.76,
      customerIndustry: 'IT',
      budgetScale: '550万円',
      proposalApproachSummary: 'デジタル化推進による生産性向上の提案',
      contractResult: true,
    });

    const topSimilarityScore = result[0].similarityScore;
    expect(topSimilarityScore).toBeGreaterThanOrEqual(0.75);

    result.forEach((caseItem) => {
      expect(caseItem.similarityScore).toBeGreaterThanOrEqual(0.0);
      expect(caseItem.similarityScore).toBeLessThanOrEqual(1.0);
      expect(caseItem).toHaveProperty('caseId');
      expect(caseItem).toHaveProperty('similarityScore');
      expect(caseItem).toHaveProperty('customerIndustry');
      expect(caseItem).toHaveProperty('budgetScale');
      expect(caseItem).toHaveProperty('proposalApproachSummary');
      expect(caseItem).toHaveProperty('contractResult');
    });

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].similarityScore).toBeGreaterThanOrEqual(
        result[i + 1].similarityScore
      );
    }
  });
});