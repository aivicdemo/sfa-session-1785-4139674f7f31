import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 経営層向け説得資料生成', () => {
  // SCEN-2025
  test('提案妥当性スコアが小数点を含む値（87.5）のとき、丸め処理が適切に行われて表示される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(87.5),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const customerInfo = {
      industry: '製造業',
      salesScale: '中堅企業',
    };

    const proposalContent = {
      title: 'システム導入提案',
      description: 'ERPシステム導入による業務効率化',
    };

    const analysisResult = {
      recommendedTiming: '2024-Q3',
      recommendedQuantity: 5,
      confidenceScore: 87.5,
      reasoningBasis: ['過去事例との合致度が高い'],
    };

    const result = generateExecutivePersuasionMaterial(
      customerInfo,
      proposalContent,
      analysisResult,
      mockAIRecommendationEngine
    );

    expect(result).toBeDefined();
    expect(result.proposalAppropriateness).toBe(88);
    expect(result.materialContent).toContain('88%');
    expect(result.materialContent).not.toContain('87.5%');
    expect(result.materialContent).not.toContain('87.50%');
    expect(result.materialContent).not.toContain('87.5000%');
    expect(result.materialContent).not.toContain('87%');

    const scoreSections = result.materialContent.match(/\d+%/g) || [];
    scoreSections.forEach((scoreDisplay) => {
      expect(scoreDisplay).toBe('88%');
    });
  });
});