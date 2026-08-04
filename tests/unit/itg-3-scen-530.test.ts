import { calculateImprovementPriorityRank } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-530
  test('改善優先度ランク算出機能 - 影響度スコアが欠落しているときランク算出が失敗する', () => {
    const input = {
      improvementId: 'IMP-001',
      importanceScore: 8.5,
      implementationDifficultyScore: 3.2,
      userSatisfactionScore: 7.0,
    };

    expect(() => {
      calculateImprovementPriorityRank(input);
    }).toThrow(/影響度スコア/);
  });
});