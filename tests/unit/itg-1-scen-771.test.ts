import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateInferencePrecisionScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-771: [edge] AIエージェント推論精度評価機能 - AIエージェント推論実行期間が月末から月初にまたがるとき、期間境界を跨いだスコア算出が正しく実行される
  test('should correctly calculate inference precision score across month boundary', () => {
    const startDate = new Date('2024-12-28T00:00:00Z');
    const endDate = new Date('2025-01-03T23:59:59Z');

    const scoreDataset = [
      { date: new Date('2024-12-28T10:00:00Z'), score: 50 },
      { date: new Date('2024-12-29T10:00:00Z'), score: 50 },
      { date: new Date('2024-12-30T10:00:00Z'), score: 50 },
      { date: new Date('2024-12-31T10:00:00Z'), score: 50 },
      { date: new Date('2025-01-01T10:00:00Z'), score: 60 },
      { date: new Date('2025-01-02T10:00:00Z'), score: 60 },
      { date: new Date('2025-01-03T10:00:00Z'), score: 60 },
    ];

    const result = calculateInferencePrecisionScore({
      startDate,
      endDate,
      scoreDataset,
    });

    expect(result.totalScore).toBe(370);
    expect(result.dailyScoreBreakdown).toEqual({
      '2024-12-28': 50,
      '2024-12-29': 50,
      '2024-12-30': 50,
      '2024-12-31': 50,
      '2025-01-01': 60,
      '2025-01-02': 60,
      '2025-01-03': 60,
    });
    expect(result.monthlyAggregation).toEqual({
      '2024-12': {
        recordCount: 4,
        monthlyTotal: 200,
      },
      '2025-01': {
        recordCount: 3,
        monthlyTotal: 180,
      },
    });
    expect(result.boundaryIncluded).toBe(true);
  });
});