import { generateStructuredTemplate } from '../../src/logic/it-1-br-3-3-2-1';

describe('営業成功パターンの構造化テンプレート設計機能', () => {
  // SCEN-2497
  test('営業プロセスの複数ステップにおける成功パターンがすべて構造化テンプレートに組み込まれる', async () => {
    // Mock AIRecommendationEngine
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Mock past success case data with multiple process steps
    const mockSimilarPatterns = {
      initialContact: {
        stepName: '初期接触',
        patterns: [
          {
            stepName: '初期接触',
            patternDescription: '業界トップ企業への導入事例を活用した初期アプローチ',
            successRate: 85,
            applicableConditions: {
              targetIndustry: 'IT',
              companySize: 'large',
              annualBudget: 10000000,
            },
          },
        ],
      },
      needsUnderstanding: {
        stepName: 'ニーズ把握',
        patterns: [
          {
            stepName: 'ニーズ把握',
            patternDescription: '経営課題ヒアリングシートを用いた構造化ニーズ把握',
            successRate: 92,
            applicableConditions: {
              targetIndustry: 'IT',
              companySize: 'large',
              annualBudget: 10000000,
            },
          },
        ],
      },
      proposal: {
        stepName: '提案',
        patterns: [
          {
            stepName: '提案',
            patternDescription: 'ROI可視化を重視した提案アプローチ',
            successRate: 88,
            applicableConditions: {
              targetIndustry: 'IT',
              companySize: 'large',
              annualBudget: 10000000,
            },
          },
        ],
      },
      closing: {
        stepName: 'クロージング',
        patterns: [
          {
            stepName: 'クロージング',
            patternDescription: '段階的な意思決定支援と経営層説得資料活用',
            successRate: 90,
            applicableConditions: {
              targetIndustry: 'IT',
              companySize: 'large',
              annualBudget: 10000000,
            },
          },
        ],
      },
      afterFollowUp: {
        stepName: 'アフターフォロー',
        patterns: [
          {
            stepName: 'アフターフォロー',
            patternDescription: '四半期ごとの経営層ビジネスレビュー施行',
            successRate: 87,
            applicableConditions: {
              targetIndustry: 'IT',
              companySize: 'large',
              annualBudget: 10000000,
            },
          },
        ],
      },
    };

    mockAIEngine.findSimilarPatterns.mockResolvedValue(mockSimilarPatterns);

    const mockRecommendation = {
      recommendedApproach: '複数ステップ統合型提案アプローチ',
      stepGuidance: {
        '初期接触': '業界トップ企業の導入事例を活用してアプローチ。信頼構築に注力。',
        'ニーズ把握': '経営課題ヒアリングシート使用。構造化的にニーズを把握。',
        '提案': 'ROI可視化資料を用いた提案。数値化された投資対効果を強調。',
        'クロージング': '段階的な意思決定支援。経営層向け説得資料を活用。',
        'アフターフォロー': '四半期ビジネスレビュー。継続的な価値提供を演出。',
      },
      relatedSuccessPatterns: [
        '業界トップ企業への導入事例を活用した初期アプローチ',
        '経営課題ヒアリングシートを用いた構造化ニーズ把握',
        'ROI可視化を重視した提案アプローチ',
        '段階的な意思決定支援と経営層説得資料活用',
        '四半期ごとの経営層ビジネスレビュー施行',
      ],
    };

    mockAIEngine.generateRecommendation.mockResolvedValue(mockRecommendation);

    // Input new case data
    const new_case_input = {
      targetIndustry: 'IT',
      companySize: 'large',
      issues: ['DX推進', 'コスト削減'],
      annualBudget: 10000000,
    };

    // Execute structured template design
    const result = await generateStructuredTemplate(new_case_input, mockAIEngine);

    // Verify structure requirement (1): All 5 steps in steps array
    expect(result.steps).toHaveLength(5);
    expect(result.steps.map((s: any) => s.stepName)).toEqual([
      '初期接触',
      'ニーズ把握',
      '提案',
      'クロージング',
      'アフターフォロー',
    ]);

    // Verify structure requirement (2): Each step includes extracted success patterns
    result.steps.forEach((step: any) => {
      expect(Array.isArray(step.patterns)).toBe(true);
      expect(step.patterns.length).toBeGreaterThan(0);
    });

    // Verify structure requirement (3): Each pattern has required attributes
    result.steps.forEach((step: any) => {
      step.patterns.forEach((pattern: any) => {
        expect(pattern).toHaveProperty('stepName');
        expect(pattern).toHaveProperty('patternDescription');
        expect(pattern).toHaveProperty('successRate');
        expect(pattern).toHaveProperty('applicableConditions');
        expect(typeof pattern.stepName).toBe('string');
        expect(typeof pattern.patternDescription).toBe('string');
        expect(typeof pattern.successRate).toBe('number');
        expect(typeof pattern.applicableConditions).toBe('object');
      });
    });

    // Verify structure requirement (4): Completeness score is 100
    expect(result.completeness).toBe(100);

    // Verify structure requirement (5): Structured template contains step-by-step guidance
    expect(result.structuredTemplate).toBeDefined();
    expect(result.structuredTemplate).toHaveProperty('stepGuidance');
    expect(typeof result.structuredTemplate.stepGuidance).toBe('object');
    expect(result.structuredTemplate.stepGuidance['初期接触']).toBeTruthy();
    expect(result.structuredTemplate.stepGuidance['ニーズ把握']).toBeTruthy();
    expect(result.structuredTemplate.stepGuidance['提案']).toBeTruthy();
    expect(result.structuredTemplate.stepGuidance['クロージング']).toBeTruthy();
    expect(result.structuredTemplate.stepGuidance['アフターフォロー']).toBeTruthy();

    // Verify mock was called with correct parameters
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();
  });
});