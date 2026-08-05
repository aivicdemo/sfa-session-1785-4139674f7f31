import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-957: 改善優先度スコア算出機能 - 問題パターンの発生頻度が過去月末と当月初にまたがるとき、集計期間が正しく区切られてスコアが算出される', () => {
    // モックデータ: 前月末（2月28日）に問題パターンA（営業プロセス逸脱）が3件発生
    const feb_28_records = [
      {
        id: 'prob_001',
        patternCategory: '営業プロセス逸脱',
        patternName: 'pattern_A',
        occurrenceDate: new Date('2024-02-28T09:00:00Z'),
        frequency: 1,
        impactLevel: 'high',
      },
      {
        id: 'prob_002',
        patternCategory: '営業プロセス逸脱',
        patternName: 'pattern_A',
        occurrenceDate: new Date('2024-02-28T10:30:00Z'),
        frequency: 1,
        impactLevel: 'high',
      },
      {
        id: 'prob_003',
        patternCategory: '営業プロセス逸脱',
        patternName: 'pattern_A',
        occurrenceDate: new Date('2024-02-28T14:00:00Z'),
        frequency: 1,
        impactLevel: 'high',
      },
    ];

    // モックデータ: 当月初（3月1日）に同じ問題パターンA が2件発生
    const mar_01_records = [
      {
        id: 'prob_004',
        patternCategory: '営業プロセス逸脱',
        patternName: 'pattern_A',
        occurrenceDate: new Date('2024-03-01T08:15:00Z'),
        frequency: 1,
        impactLevel: 'high',
      },
      {
        id: 'prob_005',
        patternCategory: '営業プロセス逸脱',
        patternName: 'pattern_A',
        occurrenceDate: new Date('2024-03-01T11:45:00Z'),
        frequency: 1,
        impactLevel: 'high',
      },
    ];

    // 全レコードを統合（実際のシステムでは複数月分が一度に渡されることを想定）
    const allRecords = [...feb_28_records, ...mar_01_records];

    // 集計期間を定義：2月1日～2月末日、3月1日～3月末日
    const aggregationPeriods = [
      {
        periodName: 'February2024',
        startDate: new Date('2024-02-01T00:00:00Z'),
        endDate: new Date('2024-02-29T23:59:59Z'),
      },
      {
        periodName: 'March2024',
        startDate: new Date('2024-03-01T00:00:00Z'),
        endDate: new Date('2024-03-31T23:59:59Z'),
      },
    ];

    // テスト対象の改善優先度スコア算出機能を実行
    const result = calculateImprovementPriorityScore({
      problemRecords: allRecords,
      aggregationPeriods: aggregationPeriods,
    });

    // 期待結果の検証
    // 前月月末（2月28日）の問題パターンA が2月集計に3件として分類されること
    const februaryResult = result.find(
      (r) => r.periodName === 'February2024'
    );
    expect(februaryResult).toBeDefined();
    expect(februaryResult?.aggregatedProblems).toBeDefined();

    const febPatternA = februaryResult?.aggregatedProblems?.find(
      (p) => p.patternName === 'pattern_A'
    );
    expect(febPatternA).toBeDefined();
    expect(febPatternA?.recordCount).toBe(3);
    expect(febPatternA?.occurrenceDates).toContain(new Date('2024-02-28T09:00:00Z').toISOString());
    expect(febPatternA?.occurrenceDates).toContain(new Date('2024-02-28T10:30:00Z').toISOString());
    expect(febPatternA?.occurrenceDates).toContain(new Date('2024-02-28T14:00:00Z').toISOString());

    // 当月月初（3月1日）の問題パターンA が3月集計に2件として分類されること
    const marchResult = result.find(
      (r) => r.periodName === 'March2024'
    );
    expect(marchResult).toBeDefined();
    expect(marchResult?.aggregatedProblems).toBeDefined();

    const marPatternA = marchResult?.aggregatedProblems?.find(
      (p) => p.patternName === 'pattern_A'
    );
    expect(marPatternA).toBeDefined();
    expect(marPatternA?.recordCount).toBe(2);
    expect(marPatternA?.occurrenceDates).toContain(new Date('2024-03-01T08:15:00Z').toISOString());
    expect(marPatternA?.occurrenceDates).toContain(new Date('2024-03-01T11:45:00Z').toISOString());

    // スコア算出結果の検証
    // 各月の改善優先度スコアが正確に計算されていること
    expect(februaryResult?.priorityScore).toBeGreaterThan(0);
    expect(marchResult?.priorityScore).toBeGreaterThan(0);

    // 月末と月初で重複せずに各月に分離されていること
    const febRecordIds = feb_28_records.map((r) => r.id);
    const marRecordIds = mar_01_records.map((r) => r.id);
    const febResultIds = februaryResult?.aggregatedProblems
      ?.flatMap((p) => p.recordIds ?? []) ?? [];
    const marResultIds = marchResult?.aggregatedProblems
      ?.flatMap((p) => p.recordIds ?? []) ?? [];

    expect(febResultIds.sort()).toEqual(febRecordIds.sort());
    expect(marResultIds.sort()).toEqual(marRecordIds.sort());
    expect(new Set(febResultIds).size).toBe(febResultIds.length);
    expect(new Set(marResultIds).size).toBe(marResultIds.length);
    expect(
      febResultIds.some((id) => marResultIds.includes(id))
    ).toBe(false);
  });
});