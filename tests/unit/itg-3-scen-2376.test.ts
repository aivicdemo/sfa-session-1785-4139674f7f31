import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  test('SCEN-2376: 複数の成功パターンから新規案件への適用可能性を考慮した精度スコアが算出される', () => {
    // ===== テストデータ準備 =====
    // 過去商談から抽出された複数の成功パターン
    const successPatterns = [
      {
        patternId: 'pattern_A',
        patternName: 'パターンA',
        industryMatch: 0.95,
        companySizeMatch: 0.80,
        budgetRangeMatch: 0.78,
        baseRelevanceScore: 0.85,
      },
      {
        patternId: 'pattern_B',
        patternName: 'パターンB',
        industryMatch: 0.70,
        companySizeMatch: 0.85,
        budgetRangeMatch: 0.60,
        baseRelevanceScore: 0.72,
      },
      {
        patternId: 'pattern_C',
        patternName: 'パターンC',
        industryMatch: 0.65,
        companySizeMatch: 0.70,
        budgetRangeMatch: 0.65,
        baseRelevanceScore: 0.65,
      },
    ];

    // 新規案件の条件
    const newDealCondition = {
      dealId: 'new_deal_001',
      customerIndustry: 'IT',
      customerCompanySize: 'large',
      budgetRange: 'high',
      purchaseStage: 'evaluation',
      decisionMakerComposition: ['CTO', 'CFO'],
    };

    // AIRecommendationEngine のスタブ
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn((pattern: typeof successPatterns[0], condition: typeof newDealCondition) => {
        // パターンAの場合
        if (pattern.patternId === 'pattern_A') {
          return {
            patternId: 'pattern_A',
            relevanceScore: 0.85,
            weightCoefficient: 0.55,
            matchDetails: {
              industryMatch: 0.95,
              companySizeMatch: 0.80,
              budgetRangeMatch: 0.78,
            },
          };
        }
        // パターンBの場合
        if (pattern.patternId === 'pattern_B') {
          return {
            patternId: 'pattern_B',
            relevanceScore: 0.72,
            weightCoefficient: 0.30,
            matchDetails: {
              industryMatch: 0.70,
              companySizeMatch: 0.85,
              budgetRangeMatch: 0.60,
            },
          };
        }
        // パターンCの場合
        return {
          patternId: 'pattern_C',
          relevanceScore: 0.65,
          weightCoefficient: 0.15,
          matchDetails: {
            industryMatch: 0.65,
            companySizeMatch: 0.70,
            budgetRangeMatch: 0.65,
          },
        };
      }),
    };

    // ===== 対象機能呼び出し =====
    const result = evaluatePatternRelevance(
      successPatterns,
      newDealCondition,
      mockAIRecommendationEngine,
    );

    // ===== 期待結果の検証 =====
    // (1) スコアが0.0～1.0の範囲内であり、複数パターンの統合値であること
    expect(result.inferenceAccuracyScore).toBeGreaterThanOrEqual(0.0);
    expect(result.inferenceAccuracyScore).toBeLessThanOrEqual(1.0);
    // 加重平均: (0.85 * 0.55 + 0.72 * 0.30 + 0.65 * 0.15) = 0.4675 + 0.216 + 0.0975 = 0.781
    expect(result.inferenceAccuracyScore).toBeCloseTo(0.781, 2);

    // (2) 各パターンの適用可能性スコアと新規案件条件の関連性に基づいた重み付けが根拠データに記録されていること
    expect(result.rationale).toBeDefined();
    expect(result.rationale.adoptedPatterns).toHaveLength(3);

    // パターンA の根拠
    expect(result.rationale.adoptedPatterns[0]).toEqual({
      patternId: 'pattern_A',
      patternName: 'パターンA',
      relevanceScore: 0.85,
      weightCoefficient: 0.55,
      matchDetails: {
        industryMatch: 0.95,
        companySizeMatch: 0.80,
        budgetRangeMatch: 0.78,
      },
    });

    // パターンB の根拠
    expect(result.rationale.adoptedPatterns[1]).toEqual({
      patternId: 'pattern_B',
      patternName: 'パターンB',
      relevanceScore: 0.72,
      weightCoefficient: 0.30,
      matchDetails: {
        industryMatch: 0.70,
        companySizeMatch: 0.85,
        budgetRangeMatch: 0.60,
      },
    });

    // パターンC の根拠
    expect(result.rationale.adoptedPatterns[2]).toEqual({
      patternId: 'pattern_C',
      patternName: 'パターンC',
      relevanceScore: 0.65,
      weightCoefficient: 0.15,
      matchDetails: {
        industryMatch: 0.65,
        companySizeMatch: 0.70,
        budgetRangeMatch: 0.65,
      },
    });

    // (3) 新規案件への適用可能性を考慮した根拠情報に、採用されたパターン名、各パターンの重み係数、計算式が含まれていること
    expect(result.rationale.calculationFormula).toBe(
      '(0.85 * 0.55) + (0.72 * 0.30) + (0.65 * 0.15) = 0.781',
    );
    expect(result.rationale.totalWeightSum).toBeCloseTo(1.0, 2);
    expect(result.rationale.dealConditionSummary).toEqual({
      industry: 'IT',
      companySize: 'large',
      budgetRange: 'high',
      purchaseStage: 'evaluation',
    });

    // AI呼び出しが正しく実行されたことを確認
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
  });
});