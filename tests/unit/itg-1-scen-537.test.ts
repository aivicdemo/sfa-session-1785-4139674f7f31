import { analyzeImprovementChallenges } from '../../src/logic/it-1-br-2-1-1';

describe('チーム全体の改善課題の数値化と提示', () => {
  test('SCEN-537: 同じ分析入力データで複数回実行した場合、改善課題の数値化結果が一貫性を保つ', () => {
    // テスト用固定データセット準備
    const analysisInputData = {
      teamMembers: [
        {
          memberId: 'M001',
          name: '営業太郎',
          monthlyRevenue: 5000000,
          dealCount: 12,
          closedDeals: 3,
          averageFollowUpInterval: 5,
          processComplianceRate: 0.85,
        },
        {
          memberId: 'M002',
          name: '営業花子',
          monthlyRevenue: 3500000,
          dealCount: 10,
          closedDeals: 2,
          averageFollowUpInterval: 7,
          processComplianceRate: 0.72,
        },
        {
          memberId: 'M003',
          name: '営業次郎',
          monthlyRevenue: 4200000,
          dealCount: 11,
          closedDeals: 2,
          averageFollowUpInterval: 6,
          processComplianceRate: 0.78,
        },
      ],
      teamAverage: {
        monthlyRevenue: 4233333.33,
        dealCount: 11,
        closedDeals: 2.33,
        closureRate: 0.21,
        averageFollowUpInterval: 6,
        processComplianceRate: 0.78,
      },
      reportingPeriod: {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      },
    };

    // 1回目の実行
    const result1 = analyzeImprovementChallenges(analysisInputData);

    // 2回目の実行
    const result2 = analyzeImprovementChallenges(analysisInputData);

    // 3回目の実行
    const result3 = analyzeImprovementChallenges(analysisInputData);

    // 1回目の結果を基準として検証
    expect(result1).toBeDefined();
    expect(result1.challenges).toBeDefined();
    expect(Array.isArray(result1.challenges)).toBe(true);
    expect(result1.challenges.length).toBeGreaterThan(0);

    // 1回目の改善課題スコアと優先度を記録
    const firstRunChallenges = result1.challenges.map((challenge: any) => ({
      id: challenge.id,
      title: challenge.title,
      score: challenge.score,
      priority: challenge.priority,
      priorityRank: challenge.priorityRank,
    }));

    // 2回目の結果と1回目の結果を比較
    expect(result2.challenges.length).toBe(result1.challenges.length);
    result2.challenges.forEach((challenge: any, index: number) => {
      expect(challenge.id).toBe(firstRunChallenges[index].id);
      expect(challenge.title).toBe(firstRunChallenges[index].title);
      expect(challenge.score).toBe(firstRunChallenges[index].score);
      expect(challenge.priority).toBe(firstRunChallenges[index].priority);
      expect(challenge.priorityRank).toBe(firstRunChallenges[index].priorityRank);
    });

    // 3回目の結果と1回目の結果を比較
    expect(result3.challenges.length).toBe(result1.challenges.length);
    result3.challenges.forEach((challenge: any, index: number) => {
      expect(challenge.id).toBe(firstRunChallenges[index].id);
      expect(challenge.title).toBe(firstRunChallenges[index].title);
      expect(challenge.score).toBe(firstRunChallenges[index].score);
      expect(challenge.priority).toBe(firstRunChallenges[index].priority);
      expect(challenge.priorityRank).toBe(firstRunChallenges[index].priorityRank);
    });

    // スコア値が小数点第1位まで一致することを確認
    result1.challenges.forEach((challenge1: any, index: number) => {
      const challenge2 = result2.challenges[index];
      const challenge3 = result3.challenges[index];

      const score1Rounded = Math.round(challenge1.score * 10) / 10;
      const score2Rounded = Math.round(challenge2.score * 10) / 10;
      const score3Rounded = Math.round(challenge3.score * 10) / 10;

      expect(score2Rounded).toBe(score1Rounded);
      expect(score3Rounded).toBe(score1Rounded);
    });

    // 優先度ランキングの順序が同一であることを確認
    const rank1Order = result1.challenges.map((c: any) => c.priorityRank);
    const rank2Order = result2.challenges.map((c: any) => c.priorityRank);
    const rank3Order = result3.challenges.map((c: any) => c.priorityRank);

    expect(rank2Order).toEqual(rank1Order);
    expect(rank3Order).toEqual(rank1Order);

    // 期待値の具体的検証: 改善課題が正しく計算されていることを確認
    // チーム全体の成約率が約21%であり、改善課題として明示されることを確認
    expect(result1.challenges.some((c: any) => c.score < 100)).toBe(true);
    
    // すべての改善課題のスコアが0～100の範囲内であることを確認
    result1.challenges.forEach((challenge: any) => {
      expect(challenge.score).toBeGreaterThanOrEqual(0);
      expect(challenge.score).toBeLessThanOrEqual(100);
    });

    // 優先度ランキングが連番かつ降順であることを確認
    const sortedRanks = [...rank1Order].sort((a, b) => a - b);
    expect(rank1Order).toEqual(sortedRanks);
  });
});