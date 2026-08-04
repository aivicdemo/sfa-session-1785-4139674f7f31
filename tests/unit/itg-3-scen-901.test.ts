import { findMatchingSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能', () => {
  // SCEN-901
  test('商談条件が1個入力されたとき照合が正しく実行される', () => {
    // ========== Setup: テストデータ準備 ==========
    const newDealCondition = {
      dealId: 'DEAL-20240115-001',
      industry: '製造業',
      companyScale: null,
      businessChallenge: null,
    };

    const mockSimilarPatterns = [
      {
        patternId: 'PATTERN-001',
        successCaseName: '大手自動車部品メーカーへの提案',
        industry: '製造業',
        companyScale: '大規模',
        proposalApproach: 'コスト削減重視',
        successIndicators: {
          closingRate: 0.85,
          adoptionTimeline: 45,
        },
      },
      {
        patternId: 'PATTERN-002',
        successCaseName: '中堅電子機器メーカーへの提案',
        industry: '製造業',
        companyScale: '中規模',
        proposalApproach: '品質向上重視',
        successIndicators: {
          closingRate: 0.78,
          adoptionTimeline: 60,
        },
      },
      {
        patternId: 'PATTERN-003',
        successCaseName: '小規模精密機械メーカーへの提案',
        industry: '製造業',
        companyScale: '小規模',
        proposalApproach: 'イノベーション連携',
        successIndicators: {
          closingRate: 0.62,
          adoptionTimeline: 90,
        },
      },
    ];

    const mockRelevanceScores = [0.92, 0.87, 0.65];

    // ========== Setup: AIRecommendationEngine スタブ設定 ==========
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((pattern) => {
          if (pattern.patternId === 'PATTERN-001') return Promise.resolve(0.92);
          if (pattern.patternId === 'PATTERN-002') return Promise.resolve(0.87);
          if (pattern.patternId === 'PATTERN-003') return Promise.resolve(0.65);
          return Promise.resolve(0.0);
        }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // ========== 実行 ==========
    return findMatchingSuccessPatterns(newDealCondition, mockAIEngine).then(
      (matchingResult) => {
        // ========== 検証 (1): 適用可能性スコアが降順にランク付けされている ==========
        expect(matchingResult.rankedPatterns).toHaveLength(3);
        expect(matchingResult.rankedPatterns[0].relevanceScore).toBe(0.92);
        expect(matchingResult.rankedPatterns[1].relevanceScore).toBe(0.87);
        expect(matchingResult.rankedPatterns[2].relevanceScore).toBe(0.65);

        // ========== 検証 (2): 各パターンに業務上の識別情報とスコア値が付与されている ==========
        matchingResult.rankedPatterns.forEach((pattern, index) => {
          expect(pattern).toHaveProperty('patternId');
          expect(pattern).toHaveProperty('successCaseName');
          expect(pattern).toHaveProperty('relevanceScore');
          expect(typeof pattern.patternId).toBe('string');
          expect(typeof pattern.successCaseName).toBe('string');
          expect(typeof pattern.relevanceScore).toBe('number');
          expect(pattern.relevanceScore).toBeGreaterThanOrEqual(0.0);
          expect(pattern.relevanceScore).toBeLessThanOrEqual(1.0);
        });

        // ========== 検証 (3): 商談条件1個との照合判定ロジックが正常に動作 ==========
        // スコア 0.65 以下のパターン（PATTERN-003）は条件が低マッチと判定
        const lowMatchPattern = matchingResult.rankedPatterns.find(
          (p) => p.patternId === 'PATTERN-003'
        );
        expect(lowMatchPattern).toBeDefined();
        expect(lowMatchPattern!.relevanceScore).toBeLessThanOrEqual(0.65);

        // スコア 0.87 以上のパターン（PATTERN-001, PATTERN-002）は条件が高マッチと判定
        const highMatchPatterns = matchingResult.rankedPatterns.filter(
          (p) => p.relevanceScore >= 0.87
        );
        expect(highMatchPatterns).toHaveLength(2);

        // ========== 検証 (4): 外部AI呼び出しが正常に完了 ==========
        expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
          newDealCondition
        );
        expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);

        mockSimilarPatterns.forEach((pattern) => {
          expect(
            mockAIEngine.evaluatePatternRelevance
          ).toHaveBeenCalledWith(pattern);
        });
        expect(
          mockAIEngine.evaluatePatternRelevance
        ).toHaveBeenCalledTimes(3);

        // ========== 検証: エラーハンドリング未発生 ==========
        expect(matchingResult).toHaveProperty('rankedPatterns');
        expect(matchingResult).toHaveProperty('totalMatchCount');
        expect(matchingResult.totalMatchCount).toBe(3);
        expect(matchingResult).not.toHaveProperty('error');
      }
    );
  });
});