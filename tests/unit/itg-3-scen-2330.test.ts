import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2330
  test('成功パターンの抽出対象期間が年度をまたぐとき複数年度の商談が正しく抽出される', () => {
    // 年度2024年度の成功商談データ（2024年4月1日～2025年3月31日）
    const fy2024DealData = [
      {
        dealId: 'DEAL-2024-001',
        dealDate: new Date('2024-06-15'),
        customerId: 'CUST-A',
        customerName: '株式会社A',
        successReason: 'ニーズ合致'
      },
      {
        dealId: 'DEAL-2024-002',
        dealDate: new Date('2024-12-20'),
        customerId: 'CUST-B',
        customerName: '株式会社B',
        successReason: 'タイミング最適'
      },
      {
        dealId: 'DEAL-2024-003',
        dealDate: new Date('2025-02-10'),
        customerId: 'CUST-C',
        customerName: '株式会社C',
        successReason: '提案内容適切'
      }
    ];

    // 年度2025年度の成功商談データ（2025年4月1日～2026年3月31日）
    const fy2025DealData = [
      {
        dealId: 'DEAL-2025-001',
        dealDate: new Date('2025-05-08'),
        customerId: 'CUST-D',
        customerName: '株式会社D',
        successReason: 'リスク対応'
      },
      {
        dealId: 'DEAL-2025-002',
        dealDate: new Date('2025-06-15'),
        customerId: 'CUST-E',
        customerName: '株式会社E',
        successReason: '経営課題解決'
      }
    ];

    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue({
        patterns: [
          ...fy2024DealData.filter(
            (deal) =>
              deal.dealDate >= new Date('2025-01-01') &&
              deal.dealDate <= new Date('2025-06-30')
          ),
          ...fy2025DealData.filter(
            (deal) =>
              deal.dealDate >= new Date('2025-01-01') &&
              deal.dealDate <= new Date('2025-06-30')
          )
        ],
        totalCount: 3
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // 抽出対象期間を「2025年1月1日～2025年6月30日」に設定
    const extractionStartDate = new Date('2025-01-01');
    const extractionEndDate = new Date('2025-06-30');

    // findSimilarPatternsメソッドを呼び出し
    const result = findSimilarPatterns(
      mockAIEngine,
      extractionStartDate,
      extractionEndDate
    );

    // 抽出結果の検証
    expect(result.patterns).toHaveLength(3);

    // 2024年度から抽出対象期間内の商談を検証
    const fy2024MatchedPatterns = result.patterns.filter(
      (pattern) =>
        pattern.dealDate >= new Date('2024-04-01') &&
        pattern.dealDate < new Date('2025-04-01')
    );
    expect(fy2024MatchedPatterns).toHaveLength(1);
    expect(fy2024MatchedPatterns[0].dealId).toBe('DEAL-2024-003');
    expect(fy2024MatchedPatterns[0].dealDate).toEqual(new Date('2025-02-10'));

    // 2025年度から抽出対象期間内の商談を検証
    const fy2025MatchedPatterns = result.patterns.filter(
      (pattern) =>
        pattern.dealDate >= new Date('2025-04-01') &&
        pattern.dealDate < new Date('2026-04-01')
    );
    expect(fy2025MatchedPatterns).toHaveLength(2);
    expect(fy2025MatchedPatterns[0].dealId).toBe('DEAL-2025-001');
    expect(fy2025MatchedPatterns[0].dealDate).toEqual(new Date('2025-05-08'));
    expect(fy2025MatchedPatterns[1].dealId).toBe('DEAL-2025-002');
    expect(fy2025MatchedPatterns[1].dealDate).toEqual(new Date('2025-06-15'));

    // 抽出された商談の商談日付がすべて対象期間内に収まっているか検証
    result.patterns.forEach((pattern) => {
      expect(pattern.dealDate.getTime()).toBeGreaterThanOrEqual(
        extractionStartDate.getTime()
      );
      expect(pattern.dealDate.getTime()).toBeLessThanOrEqual(
        extractionEndDate.getTime()
      );
    });

    // 各商談オブジェクトに必要なフィールドが含まれていることを検証
    result.patterns.forEach((pattern) => {
      expect(pattern).toHaveProperty('dealId');
      expect(pattern).toHaveProperty('dealDate');
      expect(pattern).toHaveProperty('customerId');
      expect(pattern).toHaveProperty('customerName');
      expect(pattern).toHaveProperty('successReason');
    });

    // 対象期間外の商談が除外されているか検証
    const outOfRangePatterns = result.patterns.filter(
      (pattern) =>
        pattern.dealDate < extractionStartDate ||
        pattern.dealDate > extractionEndDate
    );
    expect(outOfRangePatterns).toHaveLength(0);

    // 総件数が正しいか検証
    expect(result.totalCount).toBe(3);
  });
});