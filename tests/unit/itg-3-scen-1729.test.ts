import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1729
  test('推奨妥当性スコア算出機能 - 推奨時期が月をまたぐとき推奨スコアを正しく計算する', () => {
    // テスト入力データ：推奨時期が当月20日から翌月15日にまたがる商談条件
    const dealCondition = {
      customerId: 'CUST-001',
      dealStartDate: new Date('2024-01-20T00:00:00Z'),
      dealEndDate: new Date('2024-02-15T00:00:00Z'),
      industry: 'Technology',
      companySize: 'Large',
      dealValue: 500000,
    };

    // 当月（1月）の成功パターンマスタから3件の過去成功事例
    const januaryPatterns = [
      {
        patternId: 'PAT-JAN-001',
        customerId: 'CUST-SIMILAR-001',
        industry: 'Technology',
        companySize: 'Large',
        relevanceScore: 0.85,
        matchedDate: new Date('2024-01-15T00:00:00Z'),
      },
      {
        patternId: 'PAT-JAN-002',
        customerId: 'CUST-SIMILAR-002',
        industry: 'Technology',
        companySize: 'Large',
        relevanceScore: 0.78,
        matchedDate: new Date('2024-01-10T00:00:00Z'),
      },
      {
        patternId: 'PAT-JAN-003',
        customerId: 'CUST-SIMILAR-003',
        industry: 'Technology',
        companySize: 'Large',
        relevanceScore: 0.82,
        matchedDate: new Date('2024-01-25T00:00:00Z'),
      },
    ];

    // 翌月（2月）の成功パターンマスタから2件の過去成功事例
    const februaryPatterns = [
      {
        patternId: 'PAT-FEB-001',
        customerId: 'CUST-SIMILAR-004',
        industry: 'Technology',
        companySize: 'Large',
        relevanceScore: 0.80,
        matchedDate: new Date('2024-02-05T00:00:00Z'),
      },
      {
        patternId: 'PAT-FEB-002',
        customerId: 'CUST-SIMILAR-005',
        industry: 'Technology',
        companySize: 'Large',
        relevanceScore: 0.75,
        matchedDate: new Date('2024-02-12T00:00:00Z'),
      },
    ];

    // 全パターンを統合
    const allPatterns = [...januaryPatterns, ...februaryPatterns];

    // 推奨妥当性スコア算出関数を呼び出す
    const result = evaluatePatternRelevance(dealCondition, allPatterns);

    // 当月（1月）スコア：(0.85 + 0.78 + 0.82) / 3 = 0.8166...
    const januaryScore = (0.85 + 0.78 + 0.82) / 3;

    // 翌月（2月）スコア：(0.80 + 0.75) / 2 = 0.775
    const februaryScore = (0.80 + 0.75) / 2;

    // 当月日数：1月20日～1月31日 = 12日
    const januaryDays = 12;

    // 翌月日数：2月1日～2月15日 = 15日
    const februaryDays = 15;

    // 全日数
    const totalDays = januaryDays + februaryDays;

    // 総合スコア（月別関連度スコアの日数比率での加重平均）
    const expectedTotalScore = (januaryScore * januaryDays + februaryScore * februaryDays) / totalDays;

    // 返却されたスコア値を検証：0.0～1.0の範囲内
    expect(result.overallScore).toBeGreaterThanOrEqual(0.0);
    expect(result.overallScore).toBeLessThanOrEqual(1.0);

    // 当月スコアを検証
    expect(result.monthlyScores[0].score).toBeCloseTo(januaryScore, 4);
    expect(result.monthlyScores[0].month).toBe('2024-01');
    expect(result.monthlyScores[0].dayCount).toBe(januaryDays);

    // 翌月スコアを検証
    expect(result.monthlyScores[1].score).toBeCloseTo(februaryScore, 4);
    expect(result.monthlyScores[1].month).toBe('2024-02');
    expect(result.monthlyScores[1].dayCount).toBe(februaryDays);

    // 総合スコアが日数比率で加重平均されていることを検証
    expect(result.overallScore).toBeCloseTo(expectedTotalScore, 4);

    // 返却されたスコア内訳データの型を検証
    expect(typeof result.overallScore).toBe('number');
    expect(Array.isArray(result.monthlyScores)).toBe(true);
    expect(result.monthlyScores.length).toBe(2);
  });
});