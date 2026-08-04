import { extractAndStructurizeSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2524
  test('成功パターン抽出・構造化機能 - 失敗要因の件数が閾値直上のとき、テンプレートから除外されない', () => {
    const failureReasonThreshold = 3;
    const templateId = 'template_001';
    const templateName = '新規企業向け導入提案';
    
    const successPatternTemplate = {
      id: templateId,
      name: templateName,
      failureReasons: [],
      excludedFlag: false,
      status: 'active'
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 85,
        failureReasonCount: failureReasonThreshold
      })
    };

    const result = extractAndStructurizeSuccessPatterns(
      {
        template: successPatternTemplate,
        failureReasonThreshold: failureReasonThreshold
      },
      mockAIRecommendationEngine
    );

    expect(result.template.id).toBe(templateId);
    expect(result.template.excludedFlag).toBe(false);
    expect(result.template.status).toBe('active');
    expect(result.isIncludedInRecommendations).toBe(true);
    expect(result.evaluationResult.failureReasonCount).toBe(3);
  });
});