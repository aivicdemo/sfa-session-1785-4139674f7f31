import { findSimilarPatterns, generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件に推奨', () => {
  // SCEN-1339
  test('過去商談データが0件のとき、推奨対象パターンなしとして処理される', async () => {
    const newCaseInfo = {
      caseId: 'テスト太郎_20240101_001',
      customerName: 'テスト太郎',
      industry: 'IT',
      budget: 5000000,
      stage: '初期接触',
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        similarPatterns: [],
        totalCount: 0,
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = await generateRecommendation(newCaseInfo, mockAIEngine);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newCaseInfo);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();

    expect(result).toEqual({
      status: 'no_pattern_found',
      message: '推奨対象となる過去成功パターンが見つかりません。十分な商談実績が蓄積されてから推奨機能をご利用ください',
      recommendationContent: null,
      recommendationReason: null,
      patternCandidates: [],
      caseId: newCaseInfo.caseId,
    });

    expect(result.recommendationContent).toBeNull();
    expect(result.recommendationReason).toBeNull();
    expect(result.patternCandidates).toEqual([]);
  });
});