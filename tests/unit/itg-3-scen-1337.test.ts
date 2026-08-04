import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への推奨機能', () => {
  // SCEN-1337
  test('新規案件の顧客条件が1件のとき、パターンマッチングが実行される', async () => {
    // テストデータ: 顧客条件が1件のみの新規案件
    const newProposalCondition = {
      customerIndustry: '製造業',
    };

    // モック成功パターン（AIRecommendationEngineのスタブから返されるデータ）
    const mockSuccessPatterns = [
      {
        patternId: 'pattern_001',
        industry: '製造業',
        matchScore: 0.95,
        successRatio: 0.88,
        pastCaseCount: 12,
      },
      {
        patternId: 'pattern_002',
        industry: '製造業',
        matchScore: 0.82,
        successRatio: 0.75,
        pastCaseCount: 8,
      },
      {
        patternId: 'pattern_003',
        industry: '製造業',
        matchScore: 0.71,
        successRatio: 0.68,
        pastCaseCount: 5,
      },
    ];

    // AIRecommendationEngineのスタブ
    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSuccessPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // システムが新規案件を処理するメインロジックを実行
    const result = await findSimilarPatterns(
      newProposalCondition,
      aiRecommendationEngineStub
    );

    // AIRecommendationEngine.findSimilarPatternsメソッドが、
    // 入力された1つの顧客条件を引数として正確に1回呼び出されたことをアサート
    expect(aiRecommendationEngineStub.findSimilarPatterns).toHaveBeenCalledTimes(
      1
    );
    expect(
      aiRecommendationEngineStub.findSimilarPatterns
    ).toHaveBeenCalledWith(newProposalCondition);

    // スタブから返されたパターンマッチング結果のレコード数が1件以上であることをアサート
    expect(result).toHaveLength(3);

    // 返されたマッチング結果の構造を検証
    expect(result[0]).toMatchObject({
      patternId: 'pattern_001',
      industry: '製造業',
      matchScore: 0.95,
      successRatio: 0.88,
      pastCaseCount: 12,
    });

    // スコアの降順でソートされていることを検証
    expect(result[0].matchScore).toBeGreaterThan(result[1].matchScore);
    expect(result[1].matchScore).toBeGreaterThan(result[2].matchScore);

    // マッチング結果がシステムに保持され、後続処理で利用可能な状態を検証
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});