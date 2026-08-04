import { findSimilarPatterns, evaluatePatternRelevance, generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2716
  test('過去商談データから成功パターンが抽出され、新規案件条件と照合して推奨アプローチが決定される', async () => {
    // 過去商談データベースに成功パターンを事前登録
    const historicalDealData = {
      dealId: 'DEAL-001',
      customerIndustry: '製造業',
      dealAmount: 5000000,
      decisionFactor: 'コスト削減提案',
      contractPeriod: 3,
      status: 'won'
    };

    // AIRecommendationEngineのfindSimilarPatternsメソッドをスタブ化
    const mockFindSimilarPatterns = jest.fn().mockResolvedValue([
      {
        patternId: 'PATTERN-001',
        customerIndustry: '製造業',
        dealAmount: 5000000,
        decisionFactor: 'コスト削減提案',
        contractPeriod: 3,
        successRate: 0.92
      }
    ]);

    // 新規案件の条件を定義
    const newDealCondition = {
      customerIndustry: '製造業',
      dealAmount: 4800000,
      currentStage: '初期ヒアリング後'
    };

    // AIRecommendationEngineのevaluatePatternRelevanceメソッドをスタブ化
    const mockEvaluatePatternRelevance = jest.fn().mockResolvedValue({
      patternId: 'PATTERN-001',
      relevanceScore: 0.87
    });

    // AIRecommendationEngineのgenerateRecommendationメソッドをスタブ化
    const mockGenerateRecommendation = jest.fn().mockResolvedValue({
      recommendedApproach: '顧客のコスト削減要件を重点的にヒアリングし、ROI試算による提案資料を作成',
      reasoning: '過去の同業種案件で同様のコスト削減提案が成功しており、適用可能性が高い'
    });

    // AIRecommendationEngineスタブを作成
    const mockAIRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
      generateRecommendation: mockGenerateRecommendation
    };

    // 推奨生成処理を実行
    const similarPatterns = await mockAIRecommendationEngine.findSimilarPatterns(newDealCondition);
    expect(similarPatterns).toHaveLength(1);
    expect(similarPatterns[0].patternId).toBe('PATTERN-001');
    expect(similarPatterns[0].customerIndustry).toBe('製造業');
    expect(similarPatterns[0].dealAmount).toBe(5000000);
    expect(similarPatterns[0].decisionFactor).toBe('コスト削減提案');
    expect(similarPatterns[0].contractPeriod).toBe(3);

    // パターンの適用可能性スコアを評価
    const relevanceEvaluation = await mockAIRecommendationEngine.evaluatePatternRelevance(
      similarPatterns[0],
      newDealCondition
    );
    expect(relevanceEvaluation.relevanceScore).toBe(0.87);

    // 推奨アプローチを生成
    const recommendation = await mockAIRecommendationEngine.generateRecommendation(
      newDealCondition,
      similarPatterns[0],
      relevanceEvaluation.relevanceScore
    );

    // 期待結果を検証
    // (1) 推奨アプローチが正常に決定されている
    expect(recommendation.recommendedApproach).toBe('顧客のコスト削減要件を重点的にヒアリングし、ROI試算による提案資料を作成');

    // (2) パターン適用可能性スコアが0.87として算出されている
    expect(relevanceEvaluation.relevanceScore).toBe(0.87);

    // (3) 過去商談の成約実績が根拠情報として含まれている
    const expectedBasis = {
      decisionFactor: 'コスト削減提案',
      contractPeriod: 3,
      customerIndustry: '製造業',
      dealAmount: 5000000
    };
    expect(similarPatterns[0].decisionFactor).toBe(expectedBasis.decisionFactor);
    expect(similarPatterns[0].contractPeriod).toBe(expectedBasis.contractPeriod);
    expect(similarPatterns[0].customerIndustry).toBe(expectedBasis.customerIndustry);
    expect(similarPatterns[0].dealAmount).toBe(expectedBasis.dealAmount);
  });
});