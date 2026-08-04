import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2543
  test('成功パターンテンプレート生成日が月末のとき、テンプレートに記録される', () => {
    const endOfMonthDate = new Date('2026-08-31T23:59:59.000Z');
    jest.useFakeTimers();
    jest.setSystemTime(endOfMonthDate);

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        templateId: 'tpl-202608-001',
        generatedDate: '2026-08-31T23:59:59.000Z',
        successPatterns: [
          {
            patternName: '大規模案件_早期接触',
            applicableConditions: {
              customerSize: 'large',
              industryType: 'manufacturing',
              dealStage: 'initial_contact',
            },
            successFactors: [
              '経営層への早期アクセス',
              'ROI提示による説得',
              '導入スケジュール明確化',
            ],
            adoptionRate: 0.78,
            averageContractValue: 2500000,
          },
          {
            patternName: '中堅企業_段階導入',
            applicableConditions: {
              customerSize: 'medium',
              industryType: 'retail',
              dealStage: 'proposal_phase',
            },
            successFactors: [
              'パイロット実装の提案',
              'リスク軽減策の明示',
              '段階的な予算配分',
            ],
            adoptionRate: 0.65,
            averageContractValue: 850000,
          },
        ],
        reasoningExplanation:
          '過去24ヶ月の成功商談データ（n=156件）から抽出。大規模案件は経営層接触が成功要因、中堅企業は段階導入アプローチが効果的。',
        confidenceScore: 87,
      }),
    };

    const customerCondition = {
      customerName: 'Test Corp',
      industry: 'manufacturing',
      employeeCount: 5000,
      annualRevenue: 50000000,
    };

    const dealCondition = {
      dealStage: 'initial_contact',
      proposedProductCategory: 'enterprise_solution',
      budgetRange: 'high',
      decisionMakingProcess: 'committee',
    };

    const result = generateRecommendation(
      customerCondition,
      dealCondition,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.generatedDate).toBe('2026-08-31T23:59:59.000Z');
    expect(result.generatedDate).toMatch(/2026-08-31/);
    expect(result.successPatterns).toHaveLength(2);
    expect(result.successPatterns[0].patternName).toBe('大規模案件_早期接触');
    expect(result.successPatterns[0].adoptionRate).toBe(0.78);
    expect(result.successPatterns[1].patternName).toBe('中堅企業_段階導入');
    expect(result.successPatterns[1].adoptionRate).toBe(0.65);
    expect(result.confidenceScore).toBe(87);
    expect(result.reasoningExplanation).toContain('過去24ヶ月');

    jest.useRealTimers();
  });
});