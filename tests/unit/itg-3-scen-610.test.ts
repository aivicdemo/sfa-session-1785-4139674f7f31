import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動抽出・提案アプローチ推奨機能', () => {
  // SCEN-610
  test('OpenAI APIが正常応答した場合に類似パターン検索と推奨アプローチが生成される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_001',
          customerIndustry: '製造業',
          budgetScale: 50000000,
          implementationPeriod: 3,
          similarityScore: 0.92,
          successRate: 0.78,
          contractedAmount: 48000000,
          contractedDate: new Date('2023-06-15'),
        },
        {
          patternId: 'pattern_002',
          customerIndustry: '製造業',
          budgetScale: 55000000,
          implementationPeriod: 3,
          similarityScore: 0.88,
          successRate: 0.81,
          contractedAmount: 52000000,
          contractedDate: new Date('2023-08-20'),
        },
        {
          patternId: 'pattern_003',
          customerIndustry: '製造業',
          budgetScale: 48000000,
          implementationPeriod: 3,
          similarityScore: 0.85,
          successRate: 0.76,
          contractedAmount: 46500000,
          contractedDate: new Date('2023-10-10'),
        },
      ]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec_001',
        proposalStrategy: [
          {
            phase: 1,
            description: '段階的導入アプローチ',
            timeline: 4,
            targetAudience: 'IT部門長',
          },
          {
            phase: 2,
            description: 'キーマン3名への事前接触（経営企画部長、製造部長、購買部長）',
            timeline: 2,
            targetAudience: 'キーマン層',
          },
          {
            phase: 3,
            description: 'ROI試算資料による経営層説得',
            timeline: 3,
            targetAudience: '経営層',
          },
        ],
        estimatedContractAmount: 50000000,
        estimatedSuccessProbability: 0.79,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningExplanation:
          '過去同規模・同業種の案件では段階的導入により成約率が78%に達しており、導入期限3ヶ月という制約下での最適な手法です。キーマン層への事前接触を通じて意思決定プロセスを短縮し、経営層向けのROI資料で投資対効果を数値化することで、予算5000万円規模での成約可能性が高まります。',
      }),
    };

    const newCaseData = {
      customerIndustry: '製造業',
      budgetScale: 50000000,
      implementationPeriod: 3,
      salesDepartmentId: 'sales_dept_001',
    };

    const result = await generateRecommendation(newCaseData, mockAIRecommendationEngine);

    expect(result).toEqual({
      similarPatterns: [
        {
          patternId: 'pattern_001',
          customerIndustry: '製造業',
          budgetScale: 50000000,
          implementationPeriod: 3,
          similarityScore: 0.92,
          successRate: 0.78,
          contractedAmount: 48000000,
          contractedDate: new Date('2023-06-15'),
        },
        {
          patternId: 'pattern_002',
          customerIndustry: '製造業',
          budgetScale: 55000000,
          implementationPeriod: 3,
          similarityScore: 0.88,
          successRate: 0.81,
          contractedAmount: 52000000,
          contractedDate: new Date('2023-08-20'),
        },
        {
          patternId: 'pattern_003',
          customerIndustry: '製造業',
          budgetScale: 48000000,
          implementationPeriod: 3,
          similarityScore: 0.85,
          successRate: 0.76,
          contractedAmount: 46500000,
          contractedDate: new Date('2023-10-10'),
        },
      ],
      proposalApproach: {
        recommendationId: 'rec_001',
        proposalStrategy: [
          {
            phase: 1,
            description: '段階的導入アプローチ',
            timeline: 4,
            targetAudience: 'IT部門長',
          },
          {
            phase: 2,
            description: 'キーマン3名への事前接触（経営企画部長、製造部長、購買部長）',
            timeline: 2,
            targetAudience: 'キーマン層',
          },
          {
            phase: 3,
            description: 'ROI試算資料による経営層説得',
            timeline: 3,
            targetAudience: '経営層',
          },
        ],
        estimatedContractAmount: 50000000,
        estimatedSuccessProbability: 0.79,
      },
      reasoningExplanation:
        '過去同規模・同業種の案件では段階的導入により成約率が78%に達しており、導入期限3ヶ月という制約下での最適な手法です。キーマン層への事前接触を通じて意思決定プロセスを短縮し、経営層向けのROI資料で投資対効果を数値化することで、予算5000万円規模での成約可能性が高まります。',
    });

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(newCaseData);
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newCaseData,
      expect.any(Array),
    );
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId: 'rec_001',
      }),
      expect.any(Array),
    );
  });
});