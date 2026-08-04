import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2048
  test('過去商談データから抽出した成功パターンが複数件のとき、適合性スコアでランク付けされて推奨される', async () => {
    const mockSimilarPatterns = [
      {
        patternId: 'pattern-001',
        patternName: 'SaaS導入_中堅企業_3ヶ月スピード',
        customerIndustry: 'IT',
        customerSize: 'medium',
        proposalApproach: 'アジャイル導入法',
        successCount: 12,
        totalAttempts: 13,
      },
      {
        patternId: 'pattern-002',
        patternName: 'クラウド移行_大企業_12ヶ月計画',
        customerIndustry: 'Finance',
        customerSize: 'large',
        proposalApproach: '段階的クラウド移行',
        successCount: 18,
        totalAttempts: 23,
      },
      {
        patternId: 'pattern-003',
        patternName: 'デジタルトランスフォーメーション_成長企業',
        customerIndustry: 'Manufacturing',
        customerSize: 'medium',
        proposalApproach: 'DX推進ロードマップ',
        successCount: 9,
        totalAttempts: 11,
      },
    ];

    const mockRelevanceScores = {
      'pattern-001': 0.92,
      'pattern-002': 0.85,
      'pattern-003': 0.78,
    };

    const newDealCondition = {
      customerIndustry: 'IT',
      customerSize: 'medium',
      implementationPeriod: '3_months',
      budgetRange: 'medium',
      challengeType: 'digital_transformation',
    };

    const mockPatternRelevanceEngine = {
      evaluatePatternRelevance: jest.fn(
        (pattern: (typeof mockSimilarPatterns)[0]) => {
          return mockRelevanceScores[pattern.patternId as keyof typeof mockRelevanceScores];
        }
      ),
    };

    const recommendationResult = await evaluatePatternRelevance(
      newDealCondition,
      mockSimilarPatterns,
      mockPatternRelevanceEngine.evaluatePatternRelevance
    );

    expect(recommendationResult.patterns).toHaveLength(3);

    expect(recommendationResult.patterns[0].relevanceScore).toBe(0.92);
    expect(recommendationResult.patterns[0].patternId).toBe('pattern-001');
    expect(recommendationResult.patterns[0].patternName).toBe('SaaS導入_中堅企業_3ヶ月スピード');
    expect(recommendationResult.patterns[0].customerIndustry).toBe('IT');
    expect(recommendationResult.patterns[0].proposalApproach).toBe('アジャイル導入法');

    expect(recommendationResult.patterns[1].relevanceScore).toBe(0.85);
    expect(recommendationResult.patterns[1].patternId).toBe('pattern-002');
    expect(recommendationResult.patterns[1].patternName).toBe('クラウド移行_大企業_12ヶ月計画');
    expect(recommendationResult.patterns[1].customerIndustry).toBe('Finance');
    expect(recommendationResult.patterns[1].proposalApproach).toBe('段階的クラウド移行');

    expect(recommendationResult.patterns[2].relevanceScore).toBe(0.78);
    expect(recommendationResult.patterns[2].patternId).toBe('pattern-003');
    expect(recommendationResult.patterns[2].patternName).toBe('デジタルトランスフォーメーション_成長企業');
    expect(recommendationResult.patterns[2].customerIndustry).toBe('Manufacturing');
    expect(recommendationResult.patterns[2].proposalApproach).toBe('DX推進ロードマップ');

    expect(recommendationResult.patterns[0].relevanceScore).toBeGreaterThan(
      recommendationResult.patterns[1].relevanceScore
    );
    expect(recommendationResult.patterns[1].relevanceScore).toBeGreaterThan(
      recommendationResult.patterns[2].relevanceScore
    );

    expect(recommendationResult.recommendationReason).toContain('適合性スコア');
  });
});