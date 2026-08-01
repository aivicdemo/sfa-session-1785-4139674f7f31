import { calculateImprovementPriorityScores } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-672: 改善優先度スコア算出機能 - 問題パターンリストに重複データが含まれるとき全件について優先度スコアが計算される', () => {
    const problemPatterns = [
      {
        problemId: 'P001',
        category: '品質',
        occurrenceFrequency: 5,
        impactDegree: 8,
        resolutionDifficulty: 6,
      },
      {
        problemId: 'P001',
        category: '品質',
        occurrenceFrequency: 5,
        impactDegree: 8,
        resolutionDifficulty: 6,
      },
      {
        problemId: 'P002',
        category: 'プロセス',
        occurrenceFrequency: 3,
        impactDegree: 7,
        resolutionDifficulty: 4,
      },
    ];

    const result = calculateImprovementPriorityScores(problemPatterns);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      problemId: 'P001',
      category: '品質',
      occurrenceFrequency: 5,
      impactDegree: 8,
      resolutionDifficulty: 6,
      priorityScore: expect.closeTo(6.67, 0.01),
    });
    expect(result[1]).toEqual({
      problemId: 'P001',
      category: '品質',
      occurrenceFrequency: 5,
      impactDegree: 8,
      resolutionDifficulty: 6,
      priorityScore: expect.closeTo(6.67, 0.01),
    });
    expect(result[2]).toEqual({
      problemId: 'P002',
      category: 'プロセス',
      occurrenceFrequency: 3,
      impactDegree: 7,
      resolutionDifficulty: 4,
      priorityScore: expect.closeTo(5.25, 0.01),
    });
  });
});