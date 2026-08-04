import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('データ品質検証機能 - 合格ライン境界値テスト', () => {
  // SCEN-131
  test('データ品質スコアが合格ラインちょうど（80点）で検証が許可される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        scoreValue: 80,
        isPassingGrade: true,
      }),
    };

    const testDataset = {
      missingValueRate: 0,
      duplicateRecordRate: 0,
      dataTypeMatchRate: 100,
      outOfRangeValueCount: 0,
    };

    const passingThreshold = 80;

    const result = evaluatePatternRelevance(testDataset, mockAIEngine, passingThreshold);

    expect(result.qualityScore).toBe(80);
    expect(result.verificationStatus).toBe('許可');
    expect(result.displayMessage).toBe(
      'データ品質スコア:80/100点 - 基準を満たしています'
    );
    expect(result.canProceedToRecommendation).toBe(true);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      testDataset,
      passingThreshold
    );
  });
});