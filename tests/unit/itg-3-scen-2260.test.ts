import { analyzeProposalAndCustomerPattern } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2260
  test('[error] 提案内容と顧客対応パターン分析機能 - 営業担当者IDが未設定のとき、分析対象の特定に失敗してエラーになる', () => {
    const analysisInput = {
      salesPersonId: null,
      customerIndustry: '製造業',
      dealStage: '提案',
      budgetSize: 5000000,
      proposalContent: {
        productLine: 'クラウドERP',
        estimatedAmount: 4500000,
        implementationPeriod: 6
      },
      customerResponsePattern: {
        contactFrequency: 'weekly',
        decisionMakerEngagement: 'confirmed',
        technicalReviewStatus: 'in_progress'
      }
    };

    const stubAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    expect(() => {
      analyzeProposalAndCustomerPattern(analysisInput, stubAIEngine);
    }).toThrow(/営業担当者ID/);
  });
});