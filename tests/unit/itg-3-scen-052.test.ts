import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似パターン検索機能 - 決定論的な同一性検証', () => {
  test('SCEN-052: 同じ商談条件で複数回検索を実行しても同じ結果が返される', () => {
    // Arrange: スタブ化されたAIRecommendationEngine
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn((dealCondition) => {
        // 固定の類似パターン結果セット
        return [
          {
            patternId: 'PAT-001',
            matchScore: 0.9234,
            successCaseIndustry: '製造業',
            dealAmount: 5000000,
            proposalApproach: '業務効率化ソリューション導入支援',
          },
          {
            patternId: 'PAT-004',
            matchScore: 0.8567,
            successCaseIndustry: '製造業',
            dealAmount: 4800000,
            proposalApproach: 'プロセス最適化コンサルティング',
          },
          {
            patternId: 'PAT-007',
            matchScore: 0.7891,
            successCaseIndustry: '製造業',
            dealAmount: 5200000,
            proposalApproach: 'デジタルトランスフォーメーション推進',
          },
        ];
      }),
    };

    // 商談条件の定義
    const dealCondition = {
      industry: '製造業',
      dealAmount: 5000000,
      proposalCategory: '業務効率化',
    };

    // Act: 3回の検索を実行
    const response1 = findSimilarPatterns(dealCondition, mockAIRecommendationEngine);
    const response2 = findSimilarPatterns(dealCondition, mockAIRecommendationEngine);
    const response3 = findSimilarPatterns(dealCondition, mockAIRecommendationEngine);

    // Assert: 返却パターン件数の検証
    expect(response1.length).toBe(3);
    expect(response2.length).toBe(3);
    expect(response3.length).toBe(3);

    // パターンID一覧の順序検証
    expect(response1.map((p) => p.patternId)).toEqual([
      'PAT-001',
      'PAT-004',
      'PAT-007',
    ]);
    expect(response2.map((p) => p.patternId)).toEqual([
      'PAT-001',
      'PAT-004',
      'PAT-007',
    ]);
    expect(response3.map((p) => p.patternId)).toEqual([
      'PAT-001',
      'PAT-004',
      'PAT-007',
    ]);

    // 各パターンのマッチスコア値が小数点第4位まで完全に一致することを検証
    expect(response1[0].matchScore).toBe(0.9234);
    expect(response2[0].matchScore).toBe(0.9234);
    expect(response3[0].matchScore).toBe(0.9234);

    expect(response1[1].matchScore).toBe(0.8567);
    expect(response2[1].matchScore).toBe(0.8567);
    expect(response3[1].matchScore).toBe(0.8567);

    expect(response1[2].matchScore).toBe(0.7891);
    expect(response2[2].matchScore).toBe(0.7891);
    expect(response3[2].matchScore).toBe(0.7891);

    // 全体の完全一致を検証
    expect(response1).toEqual(response2);
    expect(response2).toEqual(response3);

    // モックが同じ入力条件で3回呼ばれたことを確認
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledTimes(
      3
    );
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      dealCondition
    );
  });
});