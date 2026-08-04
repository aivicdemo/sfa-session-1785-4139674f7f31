import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2518
  test('成功パターンが複数件のとき、すべてが構造化テンプレートに含まれる', async () => {
    const mockSuccessPatterns = [
      {
        patternId: 'PAT-001',
        customerIndustry: '製造業',
        dealAmount: 5000000,
        daysToClose: 45,
        proposalApproach: '段階的デモンストレーション',
        successFactor: 'IT部門との関係構築'
      },
      {
        patternId: 'PAT-002',
        customerIndustry: '金融業',
        dealAmount: 8000000,
        daysToClose: 60,
        proposalApproach: 'コンプライアンス重視プレゼン',
        successFactor: '規制対応実績の提示'
      },
      {
        patternId: 'PAT-003',
        customerIndustry: '小売業',
        dealAmount: 3000000,
        daysToClose: 30,
        proposalApproach: 'ROI即効性強調',
        successFactor: '競合他社比較資料'
      }
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSuccessPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const dealCondition = {
      customerIndustry: '製造業',
      dealAmount: 5500000,
      organizationSize: 'large'
    };

    const structuredTemplate = await findSimilarPatterns(dealCondition, mockAIEngine);

    expect(structuredTemplate.patterns).toHaveLength(3);
    expect(structuredTemplate.patterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          patternId: 'PAT-001',
          customerIndustry: '製造業',
          dealAmount: 5000000,
          daysToClose: 45,
          proposalApproach: '段階的デモンストレーション',
          successFactor: 'IT部門との関係構築'
        }),
        expect.objectContaining({
          patternId: 'PAT-002',
          customerIndustry: '金融業',
          dealAmount: 8000000,
          daysToClose: 60,
          proposalApproach: 'コンプライアンス重視プレゼン',
          successFactor: '規制対応実績の提示'
        }),
        expect.objectContaining({
          patternId: 'PAT-003',
          customerIndustry: '小売業',
          dealAmount: 3000000,
          daysToClose: 30,
          proposalApproach: 'ROI即効性強調',
          successFactor: '競合他社比較資料'
        })
      ])
    );

    const templatePatternIds = structuredTemplate.patterns.map((p: any) => p.patternId);
    expect(new Set(templatePatternIds).size).toBe(3);
    expect(templatePatternIds).toEqual(['PAT-001', 'PAT-002', 'PAT-003']);

    structuredTemplate.patterns.forEach((pattern: any) => {
      expect(pattern).toHaveProperty('patternId');
      expect(pattern).toHaveProperty('customerIndustry');
      expect(pattern).toHaveProperty('dealAmount');
      expect(pattern).toHaveProperty('daysToClose');
      expect(pattern).toHaveProperty('proposalApproach');
      expect(pattern).toHaveProperty('successFactor');
    });
  });
});