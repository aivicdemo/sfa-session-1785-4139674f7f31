import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨機能 - 複数件の過去商談データから類似パターンをランク付けして推奨アプローチを生成', () => {
  test('SCEN-668: 過去商談データが複数件のとき、類似パターンをランク付けして推奨アプローチを生成する', () => {
    // テストデータ: 過去商談データ5件
    const pastDeals = [
      {
        id: 'deal_001',
        industry: 'manufacturing',
        scale: 'large',
        dealValue: 5000000,
        duration: 180,
        successFlag: 1,
        customizationRequired: true,
        previousOutcome: 'contracted',
      },
      {
        id: 'deal_002',
        industry: 'manufacturing',
        scale: 'large',
        dealValue: 4500000,
        duration: 175,
        successFlag: 1,
        customizationRequired: true,
        previousOutcome: 'contracted',
      },
      {
        id: 'deal_003',
        industry: 'distribution',
        scale: 'medium',
        dealValue: 2000000,
        duration: 120,
        successFlag: 1,
        customizationRequired: false,
        previousOutcome: 'contracted',
      },
      {
        id: 'deal_004',
        industry: 'distribution',
        scale: 'medium',
        dealValue: 1800000,
        duration: 110,
        successFlag: 1,
        customizationRequired: false,
        previousOutcome: 'contracted',
      },
      {
        id: 'deal_005',
        industry: 'service',
        scale: 'small',
        dealValue: 800000,
        duration: 60,
        successFlag: 1,
        customizationRequired: false,
        previousOutcome: 'contracted',
      },
    ];

    // 新規案件条件
    const newDealCondition = {
      industry: 'manufacturing',
      scale: 'medium',
      estimatedValue: 2500000,
      firstContact: true,
      customizationRequired: true,
    };

    // AIRecommendationEngine のスタブ
    const mockAIEngine = {
      findSimilarPatterns: jest.fn((condition: typeof newDealCondition, pastData: typeof pastDeals) => {
        return [
          {
            patternId: 'deal_001',
            similarityScore: 0.92,
            matchReason: 'Manufacturing industry, large scale with customization',
          },
          {
            patternId: 'deal_003',
            similarityScore: 0.78,
            matchReason: 'Medium scale, structured approach',
          },
          {
            patternId: 'deal_002',
            similarityScore: 0.65,
            matchReason: 'Manufacturing with similar characteristics',
          },
        ];
      }),
      evaluatePatternRelevance: jest.fn((pattern: any, condition: typeof newDealCondition) => {
        const scoreMap: Record<string, number> = {
          deal_001: 0.88,
          deal_003: 0.72,
          deal_002: 0.61,
        };
        return scoreMap[pattern.patternId] || 0.5;
      }),
      explainRecommendationReasoning: jest.fn((pattern: any, matchingReasons: string) => {
        const explanations: Record<string, string> = {
          deal_001: '製造業の類似規模案件では導入前ヒアリングに3時間を要し、提案資料のカスタマイズが成功要因でした。貴社の中規模案件でも同様のアプローチが効果的と予測されます。',
          deal_003: '中規模案件での標準的なアプローチにより成約に至った事例です。スムーズな提案プロセスが特徴です。',
          deal_002: '製造業大規模案件での成功パターンを参考に、スケーリング可能な提案戦略を推奨します。',
        };
        return explanations[pattern.patternId] || '';
      }),
    };

    // generateRecommendation を呼び出す
    const result = generateRecommendation(
      newDealCondition,
      pastDeals,
      mockAIEngine.findSimilarPatterns,
      mockAIEngine.evaluatePatternRelevance,
      mockAIEngine.explainRecommendationReasoning
    );

    // findSimilarPatterns が呼び出されたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealCondition, pastDeals);

    // 返却オブジェクトの構造を検証
    expect(result).toHaveProperty('recommendedApproaches');
    expect(result).toHaveProperty('rankingScores');
    expect(result).toHaveProperty('reasoningExplanation');
    expect(result).toHaveProperty('sourcePatternIds');

    // recommendedApproaches が配列で、3件のパターンを含むことを確認
    expect(Array.isArray(result.recommendedApproaches)).toBe(true);
    expect(result.recommendedApproaches.length).toBe(3);

    // ランク付けが高スコア順で整列されていることを確認
    expect(result.rankingScores.length).toBe(3);
    expect(result.rankingScores[0]).toBe(0.92);
    expect(result.rankingScores[1]).toBe(0.78);
    expect(result.rankingScores[2]).toBe(0.65);
    expect(result.rankingScores[0] > result.rankingScores[1]).toBe(true);
    expect(result.rankingScores[1] > result.rankingScores[2]).toBe(true);

    // sourcePatternIds が正しい順序で含まれていることを確認
    expect(result.sourcePatternIds).toEqual(['deal_001', 'deal_003', 'deal_002']);

    // 各パターンに適用可能性スコア（0.0～1.0）が付与されていることを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(result.recommendedApproaches[0]).toHaveProperty('applicabilityScore');
    expect(result.recommendedApproaches[0].applicabilityScore).toBe(0.88);
    expect(result.recommendedApproaches[1].applicabilityScore).toBe(0.72);
    expect(result.recommendedApproaches[2].applicabilityScore).toBe(0.61);

    // 適用可能性スコアが 0.0～1.0 の範囲内であることを確認
    result.recommendedApproaches.forEach((approach: any) => {
      expect(approach.applicabilityScore).toBeGreaterThanOrEqual(0.0);
      expect(approach.applicabilityScore).toBeLessThanOrEqual(1.0);
    });

    // explainRecommendationReasoning が呼び出されたことを確認
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);

    // 自然言語根拠説明が各パターンに含まれていることを確認
    expect(result.reasoningExplanation).toHaveLength(3);
    expect(result.reasoningExplanation[0]).toContain('製造業');
    expect(result.reasoningExplanation[0]).toContain('ヒアリング');
    expect(result.reasoningExplanation[0]).toContain('カスタマイズ');
    expect(result.reasoningExplanation[1]).toContain('中規模');
    expect(result.reasoningExplanation[2]).toContain('製造業');

    // 最上位パターンが新規案件と最も適合度が高い過去事例を参照していることを確認
    expect(result.sourcePatternIds[0]).toBe('deal_001');
    expect(result.rankingScores[0]).toBe(0.92);
    expect(result.recommendedApproaches[0].applicabilityScore).toBeGreaterThan(
      result.recommendedApproaches[1].applicabilityScore
    );

    // 全体構造が期待通りであることを確認
    expect(result.recommendedApproaches[0]).toEqual({
      patternId: 'deal_001',
      applicabilityScore: 0.88,
      matchingReasons: expect.any(String),
      recommendedSteps: expect.any(Array),
    });
  });
});