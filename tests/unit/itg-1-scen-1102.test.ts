import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  analyzeBehaviorPatterns,
  type BehaviorPatternAnalysisInput,
  type BehaviorPatternAnalysisResult,
  type SalesRepBehaviorMetrics,
} from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1102: [normal] 営業担当者ごとの行動パターン分析・標準プロセス乖離分析機能
  it('should analyze behavior patterns for multiple sales reps with detailed metrics', async () => {
    const analysisInput: BehaviorPatternAnalysisInput = {
      salesRepIds: ['rep_001', 'rep_002', 'rep_003'],
      startDate: new Date('2024-01-01T00:00:00Z'),
      endDate: new Date('2024-01-31T23:59:59Z'),
      activityLogs: [
        // 営業担当者A (rep_001) の活動ログ: 5件以上
        {
          id: 'log_a001',
          salesRepId: 'rep_001',
          visitDate: new Date('2024-01-05T09:30:00Z'),
          customerName: '顧客X',
          activityType: 'visit',
          durationMinutes: 45,
          timeOfDay: 'morning',
        },
        {
          id: 'log_a002',
          salesRepId: 'rep_001',
          visitDate: new Date('2024-01-05T14:00:00Z'),
          customerName: '顧客Y',
          activityType: 'proposal',
          durationMinutes: 60,
          timeOfDay: 'afternoon',
        },
        {
          id: 'log_a003',
          salesRepId: 'rep_001',
          visitDate: new Date('2024-01-08T10:00:00Z'),
          customerName: '顧客Z',
          activityType: 'visit',
          durationMinutes: 50,
          timeOfDay: 'morning',
        },
        {
          id: 'log_a004',
          salesRepId: 'rep_001',
          visitDate: new Date('2024-01-12T13:30:00Z'),
          customerName: '顧客X',
          activityType: 'follow_up',
          durationMinutes: 30,
          timeOfDay: 'afternoon',
        },
        {
          id: 'log_a005',
          salesRepId: 'rep_001',
          visitDate: new Date('2024-01-15T09:00:00Z'),
          customerName: '顧客A',
          activityType: 'visit',
          durationMinutes: 55,
          timeOfDay: 'morning',
        },
        {
          id: 'log_a006',
          salesRepId: 'rep_001',
          visitDate: new Date('2024-01-18T15:00:00Z'),
          customerName: '顧客B',
          activityType: 'proposal',
          durationMinutes: 75,
          timeOfDay: 'afternoon',
        },
        // 営業担当者B (rep_002) の活動ログ: 5件以上
        {
          id: 'log_b001',
          salesRepId: 'rep_002',
          visitDate: new Date('2024-01-02T10:15:00Z'),
          customerName: '顧客C',
          activityType: 'visit',
          durationMinutes: 40,
          timeOfDay: 'morning',
        },
        {
          id: 'log_b002',
          salesRepId: 'rep_002',
          visitDate: new Date('2024-01-06T11:30:00Z'),
          customerName: '顧客D',
          activityType: 'visit',
          durationMinutes: 35,
          timeOfDay: 'morning',
        },
        {
          id: 'log_b003',
          salesRepId: 'rep_002',
          visitDate: new Date('2024-01-10T14:45:00Z'),
          customerName: '顧客E',
          activityType: 'proposal',
          durationMinutes: 50,
          timeOfDay: 'afternoon',
        },
        {
          id: 'log_b004',
          salesRepId: 'rep_002',
          visitDate: new Date('2024-01-14T13:00:00Z'),
          customerName: '顧客F',
          activityType: 'follow_up',
          durationMinutes: 25,
          timeOfDay: 'afternoon',
        },
        {
          id: 'log_b005',
          salesRepId: 'rep_002',
          visitDate: new Date('2024-01-20T09:45:00Z'),
          customerName: '顧客G',
          activityType: 'visit',
          durationMinutes: 48,
          timeOfDay: 'morning',
        },
        {
          id: 'log_b006',
          salesRepId: 'rep_002',
          visitDate: new Date('2024-01-25T16:00:00Z'),
          customerName: '顧客H',
          activityType: 'proposal',
          durationMinutes: 65,
          timeOfDay: 'afternoon',
        },
        // 営業担当者C (rep_003) の活動ログ: 5件以上
        {
          id: 'log_c001',
          salesRepId: 'rep_003',
          visitDate: new Date('2024-01-03T08:30:00Z'),
          customerName: '顧客I',
          activityType: 'visit',
          durationMinutes: 50,
          timeOfDay: 'morning',
        },
        {
          id: 'log_c002',
          salesRepId: 'rep_003',
          visitDate: new Date('2024-01-07T15:30:00Z'),
          customerName: '顧客J',
          activityType: 'proposal',
          durationMinutes: 55,
          timeOfDay: 'afternoon',
        },
        {
          id: 'log_c003',
          salesRepId: 'rep_003',
          visitDate: new Date('2024-01-11T10:00:00Z'),
          customerName: '顧客K',
          activityType: 'visit',
          durationMinutes: 42,
          timeOfDay: 'morning',
        },
        {
          id: 'log_c004',
          salesRepId: 'rep_003',
          visitDate: new Date('2024-01-16T14:15:00Z'),
          customerName: '顧客L',
          activityType: 'follow_up',
          durationMinutes: 35,
          timeOfDay: 'afternoon',
        },
        {
          id: 'log_c005',
          salesRepId: 'rep_003',
          visitDate: new Date('2024-01-22T11:00:00Z'),
          customerName: '顧客M',
          activityType: 'visit',
          durationMinutes: 48,
          timeOfDay: 'morning',
        },
        {
          id: 'log_c006',
          salesRepId: 'rep_003',
          visitDate: new Date('2024-01-28T13:45:00Z'),
          customerName: '顧客N',
          activityType: 'proposal',
          durationMinutes: 70,
          timeOfDay: 'afternoon',
        },
      ],
    };

    const result: BehaviorPatternAnalysisResult = await analyzeBehaviorPatterns(analysisInput);

    // 結果の基本構造を検証
    expect(result).toHaveProperty('analysisId');
    expect(result).toHaveProperty('periodStart');
    expect(result).toHaveProperty('periodEnd');
    expect(result).toHaveProperty('salesRepMetrics');

    // 分析期間が正しく記録されていることを確認
    expect(result.periodStart).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(result.periodEnd).toEqual(new Date('2024-01-31T23:59:59Z'));

    // 3人の営業担当者すべてについてメトリクスが存在することを確認
    expect(result.salesRepMetrics).toHaveLength(3);

    // 営業担当者A (rep_001) のメトリクス検証
    const repAMetrics: SalesRepBehaviorMetrics = result.salesRepMetrics.find(
      (m) => m.salesRepId === 'rep_001'
    )!;
    expect(repAMetrics).toBeDefined();
    expect(repAMetrics.averageVisitCount).toBe(3); // 訪問タイプが3件 (log_a001, log_a003, log_a005)
    expect(repAMetrics.averageDurationMinutes).toBe(52.5); // (45+60+50+30+55+75) / 6 = 52.5
    expect(repAMetrics.activityTypeDistribution).toHaveProperty('visit');
    expect(repAMetrics.activityTypeDistribution).toHaveProperty('proposal');
    expect(repAMetrics.activityTypeDistribution).toHaveProperty('follow_up');
    expect(repAMetrics.activityTypeDistribution.visit).toBe(3); // 訪問が3件
    expect(repAMetrics.activityTypeDistribution.proposal).toBe(2); // 提案が2件
    expect(repAMetrics.activityTypeDistribution.follow_up).toBe(1); // フォローアップが1件
    expect(repAMetrics.timeOfDayDistribution).toHaveProperty('morning');
    expect(repAMetrics.timeOfDayDistribution).toHaveProperty('afternoon');
    expect(repAMetrics.timeOfDayDistribution.morning).toBe(50); // (3/6)*100 = 50%
    expect(repAMetrics.timeOfDayDistribution.afternoon).toBe(50); // (3/6)*100 = 50%

    // 営業担当者A の詳細行動パターン
    expect(repAMetrics.detailedPatterns).toBeDefined();
    expect(Array.isArray(repAMetrics.detailedPatterns)).toBe(true);
    expect(repAMetrics.detailedPatterns.length).toBeGreaterThan(0);
    const repAPattern = repAMetrics.detailedPatterns[0];
    expect(repAPattern).toHaveProperty('description');
    expect(repAPattern).toHaveProperty('percentage');

    // 営業担当者B (rep_002) のメトリクス検証
    const repBMetrics: SalesRepBehaviorMetrics = result.salesRepMetrics.find(
      (m) => m.salesRepId === 'rep_002'
    )!;
    expect(repBMetrics).toBeDefined();
    expect(repBMetrics.averageVisitCount).toBe(3); // 訪問タイプが3件 (log_b001, log_b002, log_b005)
    expect(repBMetrics.averageDurationMinutes).toBe(43.833333); // (40+35+50+25+48+65) / 6 ≈ 43.83
    expect(repBMetrics.activityTypeDistribution.visit).toBe(3); // 訪問が3件
    expect(repBMetrics.activityTypeDistribution.proposal).toBe(2); // 提案が2件
    expect(repBMetrics.activityTypeDistribution.follow_up).toBe(1); // フォローアップが1件
    expect(repBMetrics.timeOfDayDistribution.morning).toBe(50); // (3/6)*100 = 50%
    expect(repBMetrics.timeOfDayDistribution.afternoon).toBe(50); // (3/6)*100 = 50%

    // 営業担当者C (rep_003) のメトリクス検証
    const repCMetrics: SalesRepBehaviorMetrics = result.salesRepMetrics.find(
      (m) => m.salesRepId === 'rep_003'
    )!;
    expect(repCMetrics).toBeDefined();
    expect(repCMetrics.averageVisitCount).toBe(3); // 訪問タイプが3件 (log_c001, log_c003, log_c005)
    expect(repCMetrics.averageDurationMinutes).toBe(50); // (50+55+42+35+48+70) / 6 = 50
    expect(repCMetrics.activityTypeDistribution.visit).toBe(3); // 訪問が3件
    expect(repCMetrics.activityTypeDistribution.proposal).toBe(2); // 提案が2件
    expect(repCMetrics.activityTypeDistribution.follow_up).toBe(1); // フォローアップが1件
    expect(repCMetrics.timeOfDayDistribution.morning).toBe(50); // (3/6)*100 = 50%
    expect(repCMetrics.timeOfDayDistribution.afternoon).toBe(50); // (3/6)*100 = 50%

    // 複数営業担当者の行動パターンが異なることを確認
    expect(repAMetrics.averageDurationMinutes).not.toBe(
      repBMetrics.averageDurationMinutes
    );
    expect(repBMetrics.averageDurationMinutes).not.toBe(
      repCMetrics.averageDurationMinutes
    );

    // 各営業担当者の詳細パターンが具体的に記述されていることを確認
    expect(repAMetrics.detailedPatterns[0].description).toMatch(/午前|午後|訪問|提案|活動/);
    expect(repBMetrics.detailedPatterns[0].description).toMatch(/午前|午後|訪問|提案|活動/);
    expect(repCMetrics.detailedPatterns[0].description).toMatch(/午前|午後|訪問|提案|活動/);

    // 結果が比較可能な状態にあることを確認
    expect(result.salesRepMetrics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          salesRepId: 'rep_001',
        }),
        expect.objectContaining({
          salesRepId: 'rep_002',
        }),
        expect.objectContaining({
          salesRepId: 'rep_003',
        }),
      ])
    );
  });
});