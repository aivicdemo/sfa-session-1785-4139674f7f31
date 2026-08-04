import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generatePersuasionMaterialForExecutives } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨根拠の可視化機能 - 経営層向け説得資料自動生成', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-2014
  test('投資対効果スコアがちょうど閾値（80点）のとき、推奨判定が分岐点として正確に動作し、説得資料の推奨フラグとステータスラベルが適切に生成される', async () => {
    // ━━ 前提条件の設定 ━━
    const thresholdScore = 80;
    const businessNeedId = 'need_001';
    const customerId = 'cust_12345';
    const dealAmount = 5000000;
    const implementationPeriodDays = 180;

    // ━━ スコア80点（閾値）のテストケース設定 ━━
    const dealConditionAtThreshold = {
      dealId: 'deal_boundary_80',
      customerId: customerId,
      customerIndustry: 'Manufacturing',
      customerScale: 'large',
      businessNeedId: businessNeedId,
      proposalAmount: dealAmount,
      implementationPeriod: implementationPeriodDays,
      investmentROI: 280,
      paybackMonths: 8,
      riskFactors: ['market_risk'],
      budgetAvailable: true,
      budgetConstraintAmount: 6000000,
      timelineAlignmentDays: 0,
    };

    // ━━ AIRecommendationEngine スタブの設定（スコア80点を返す）━━
    const stubAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(thresholdScore),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'Phased implementation with executive alignment',
        confidenceScore: 85,
        rootCauseAnalysis: 'Strong ROI with manageable risk profile',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_mfg_001',
          matchScore: 92,
          successRate: 0.88,
          dealCount: 47,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningText:
          'Investment ROI of 280% combined with 8-month payback period demonstrates strong financial viability. Risk profile is acceptable for enterprise-scale implementation.',
      }),
    };

    // ━━ 提案内容と顧客制約条件の検証結果を事前準備 ━━
    const alignmentResult = {
      feasibilityScore: 88,
      alignmentWithObjectives: 'High',
      constraintViolations: [],
      recommendedModifications: [],
    };

    // ━━ 関数実行: スコア80点（閾値）
    const resultAtThreshold = await generatePersuasionMaterialForExecutives(
      dealConditionAtThreshold,
      stubAIEngine,
      alignmentResult,
      thresholdScore
    );

    // ━━ スコア80点での検証 ━━
    expect(resultAtThreshold.recommendedFlag).toBe(true);
    expect(resultAtThreshold.statusLabel).toBe('推奨対象');
    expect(resultAtThreshold.investmentROIScore).toBe(80);
    expect(resultAtThreshold.persuasionMaterial).toHaveProperty('executiveTitle');
    expect(resultAtThreshold.persuasionMaterial.investmentJustification).toContain(
      'ROI'
    );
    expect(resultAtThreshold.persuasionMaterial.riskMitigationStrategy).toBeDefined();

    // ━━ 関数実行: スコア79点（閾値未満）
    const dealConditionBelow = { ...dealConditionAtThreshold, dealId: 'deal_below_79' };
    const stubAIEngineBelow = {
      ...stubAIEngine,
      evaluatePatternRelevance: jest.fn().mockResolvedValue(79),
    };

    const resultBelow = await generatePersuasionMaterialForExecutives(
      dealConditionBelow,
      stubAIEngineBelow,
      alignmentResult,
      thresholdScore
    );

    // ━━ スコア79点での検証
    expect(resultBelow.recommendedFlag).toBe(false);
    expect(resultBelow.statusLabel).toBe('要検討');
    expect(resultBelow.investmentROIScore).toBe(79);

    // ━━ 関数実行: スコア81点（閾値超過）
    const dealConditionAbove = { ...dealConditionAtThreshold, dealId: 'deal_above_81' };
    const stubAIEngineAbove = {
      ...stubAIEngine,
      evaluatePatternRelevance: jest.fn().mockResolvedValue(81),
    };

    const resultAbove = await generatePersuasionMaterialForExecutives(
      dealConditionAbove,
      stubAIEngineAbove,
      alignmentResult,
      thresholdScore
    );

    // ━━ スコア81点での検証
    expect(resultAbove.recommendedFlag).toBe(true);
    expect(resultAbove.statusLabel).toBe('推奨対象');
    expect(resultAbove.investmentROIScore).toBe(81);

    // ━━ 境界値分岐の差分確認 ━━
    expect(resultBelow.recommendedFlag).toBe(false);
    expect(resultAtThreshold.recommendedFlag).toBe(true);
    expect(resultAbove.recommendedFlag).toBe(true);

    // ━━ 説得資料の構造確認 ━━
    expect(resultAtThreshold.persuasionMaterial).toEqual(
      expect.objectContaining({
        executiveTitle: expect.any(String),
        investmentJustification: expect.any(String),
        riskMitigationStrategy: expect.any(String),
        recommendationRationale: expect.any(String),
        nextSteps: expect.any(Array),
      })
    );

    // ━━ 推奨根拠の可視化確認 ━━
    expect(resultAtThreshold.recommendationReasoning).toBeDefined();
    expect(resultAtThreshold.recommendationReasoning.similarPatterns).toHaveLength(1);
    expect(resultAtThreshold.recommendationReasoning.similarPatterns[0].matchScore).toBe(
      92
    );
    expect(resultAtThreshold.recommendationReasoning.alignmentFactors).toEqual(
      expect.objectContaining({
        feasibilityScore: 88,
        alignmentWithObjectives: 'High',
      })
    );
  });
});