import { analyzeProcessDeviation } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-783
  test('標準プロセスからの乖離度が閾値超過の場合、改善対象として判定される', () => {
    const standardProcess = {
      stages: 5,
      stageDefinitions: [
        { stage: '初期接触', standardDays: 3 },
        { stage: '提案', standardDays: 5 },
        { stage: '交渉', standardDays: 7 },
        { stage: '合意', standardDays: 3 },
        { stage: 'クローズ', standardDays: 2 },
      ],
    };

    const deviationThreshold = 20;

    const actualData = {
      caseId: 'CASE-001',
      actualStages: [
        { stage: '初期接触', actualDays: 5 },
        { stage: '提案', actualDays: 8 },
        { stage: '交渉', actualDays: 12 },
        { stage: '合意', actualDays: 4 },
        { stage: 'クローズ', actualDays: 3 },
      ],
    };

    const result = analyzeProcessDeviation({
      standardProcess,
      deviationThreshold,
      actualData,
    });

    expect(result.needsImprovement).toBe(true);
    expect(result.deviationPercentage).toBe(25);
    expect(result.deviationReason).toBe('乖離度が閾値20%を超過');
  });
});