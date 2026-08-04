import { decideSalesCoachingPolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア null エラー処理', () => {
  // SCEN-500: [error] 営業担当者への指導方針の決定機能 - データ品質スコアが null のとき、エラーが発生する
  test('should throw error when data quality score is null', () => {
    const salesPersonId = 'SP-001';
    const salesPersonName = '営業太郎';
    const department = '営業部第一課';
    const dataQualityScore = null;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
    };

    expect(() =>
      decideSalesCoachingPolicy(
        {
          sales_person_id: salesPersonId,
          sales_person_name: salesPersonName,
          department: department,
          data_quality_score: dataQualityScore,
        },
        mockAIRecommendationEngine
      )
    ).toThrow(/データ品質スコア/);
  });
});