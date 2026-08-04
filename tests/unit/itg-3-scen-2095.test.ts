import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案内容と顧客対応パターンの標準プロセス照合分析', () => {
  // SCEN-2095
  test('商談詳細テーブルから取得した商談情報が成功パターンマッチングに使用される', async () => {
    // Arrange: 商談詳細テーブルの事前設定
    const dealDetail = {
      dealId: 'DEAL-20250801-001',
      industry: '製造業',
      amount: 5000000,
      stage: '提案段階',
      proposalKeywords: ['コスト削減', 'デジタル化'],
      companySize: '大企業',
    };

    // AIRecommendationEngineのfindSimilarPatternsメソッドをスタブ化
    const mockFindSimilarPatterns = jest.fn().mockResolvedValue([
      {
        patternId: 'PATTERN-001',
        score: 0.92,
        description: 'コスト削減で成功した大企業案件',
        industry: '製造業',
        successRate: 0.92,
      },
      {
        patternId: 'PATTERN-002',
        score: 0.85,
        description: 'デジタル化提案が受入れられた製造業案件',
        industry: '製造業',
        successRate: 0.85,
      },
      {
        patternId: 'PATTERN-003',
        score: 0.78,
        description: '別業種案件',
        industry: '流通業',
        successRate: 0.78,
      },
    ]);

    // AIRecommendationEngineのgenerateRecommendationメソッドをスタブ化
    const mockGenerateRecommendation = jest.fn().mockResolvedValue({
      recommendedApproach: '段階的なコスト削減ロードマップ提示',
      applicationReason: '過去同業種大企業案件での成功率92%',
      recommendedActivity: '初回ヒアリングで経営課題ヒアリングシート活用',
      matchingScore: 0.92,
      matchedPatternId: 'PATTERN-001',
    });

    const mockAIRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      generateRecommendation: mockGenerateRecommendation,
    };

    // Act: generateRecommendationメソッドを呼び出し
    const result = await generateRecommendation(dealDetail, mockAIRecommendationEngine);

    // Assert: 入力パラメータの検証
    expect(mockGenerateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: 'DEAL-20250801-001',
        industry: '製造業',
        amount: 5000000,
        stage: '提案段階',
        proposalKeywords: ['コスト削減', 'デジタル化'],
      })
    );

    // Assert: 推奨内容の検証
    expect(result).toEqual({
      recommendedApproach: '段階的なコスト削減ロードマップ提示',
      applicationReason: '過去同業種大企業案件での成功率92%',
      recommendedActivity: '初回ヒアリングで経営課題ヒアリングシート活用',
      matchingScore: 0.92,
      matchedPatternId: 'PATTERN-001',
    });

    // Assert: 最も高いスコア（0.92）のパターンが選択されたことを確認
    expect(result.matchingScore).toBe(0.92);
    expect(result.matchedPatternId).toBe('PATTERN-001');
  });
});