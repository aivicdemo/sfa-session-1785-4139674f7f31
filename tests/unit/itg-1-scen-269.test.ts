import { calculateCoachingPriority } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  test('SCEN-269: 行動パターン分析と改善指導優先順位判定機能 - 複数の改善指導対象者について、乖離度と成約実績の相関度に基づいて指導優先順位が正しく順序付けられる', () => {
    // 複数の改善指導対象者のテストデータを準備
    const salesRepresentatives = [
      {
        id: 'rep_A',
        name: '営業担当者A',
        deviationScore: 85,
        correlationWithClosureRate: 0.72,
      },
      {
        id: 'rep_B',
        name: '営業担当者B',
        deviationScore: 62,
        correlationWithClosureRate: 0.58,
      },
      {
        id: 'rep_C',
        name: '営業担当者C',
        deviationScore: 91,
        correlationWithClosureRate: 0.81,
      },
      {
        id: 'rep_D',
        name: '営業担当者D',
        deviationScore: 58,
        correlationWithClosureRate: 0.45,
      },
    ];

    // 優先順位判定ロジック（乖離度と成約実績相関度の積算値で順位付け）を実行
    const priorityResult = calculateCoachingPriority(salesRepresentatives);

    // 判定結果の優先順位リストを取得
    expect(priorityResult).toEqual({
      rankings: [
        {
          rank: 1,
          repId: 'rep_C',
          repName: '営業担当者C',
          deviationScore: 91,
          correlationWithClosureRate: 0.81,
          calculatedScore: 73.71,
        },
        {
          rank: 2,
          repId: 'rep_A',
          repName: '営業担当者A',
          deviationScore: 85,
          correlationWithClosureRate: 0.72,
          calculatedScore: 61.20,
        },
        {
          rank: 3,
          repId: 'rep_B',
          repName: '営業担当者B',
          deviationScore: 62,
          correlationWithClosureRate: 0.58,
          calculatedScore: 35.96,
        },
        {
          rank: 4,
          repId: 'rep_D',
          repName: '営業担当者D',
          deviationScore: 58,
          correlationWithClosureRate: 0.45,
          calculatedScore: 26.10,
        },
      ],
    });

    // 優先順位リストの順序を確認
    expect(priorityResult.rankings[0].rank).toBe(1);
    expect(priorityResult.rankings[0].repName).toBe('営業担当者C');
    expect(priorityResult.rankings[0].calculatedScore).toBe(73.71);

    expect(priorityResult.rankings[1].rank).toBe(2);
    expect(priorityResult.rankings[1].repName).toBe('営業担当者A');
    expect(priorityResult.rankings[1].calculatedScore).toBe(61.20);

    expect(priorityResult.rankings[2].rank).toBe(3);
    expect(priorityResult.rankings[2].repName).toBe('営業担当者B');
    expect(priorityResult.rankings[2].calculatedScore).toBe(35.96);

    expect(priorityResult.rankings[3].rank).toBe(4);
    expect(priorityResult.rankings[3].repName).toBe('営業担当者D');
    expect(priorityResult.rankings[3].calculatedScore).toBe(26.10);

    // 各営業担当者の算出スコアを確認
    expect(priorityResult.rankings[0].calculatedScore).toBeCloseTo(91 * 0.81, 1);
    expect(priorityResult.rankings[1].calculatedScore).toBeCloseTo(85 * 0.72, 1);
    expect(priorityResult.rankings[2].calculatedScore).toBeCloseTo(62 * 0.58, 1);
    expect(priorityResult.rankings[3].calculatedScore).toBeCloseTo(58 * 0.45, 1);
  });
});