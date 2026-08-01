import { describe, test, expect } from '@jest/globals';
import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-375
  test('改善課題の数値化が正しく行われる', () => {
    const salesReps = [
      {
        id: 'A',
        name: '営業担当者A',
        visitCount: 45,
      },
      {
        id: 'B',
        name: '営業担当者B',
        visitCount: 32,
      },
      {
        id: 'C',
        name: '営業担当者C',
        visitCount: 28,
      },
    ];

    const targetVisitCount = 40;
    const analysisMonths = 3;

    const report = generateBehaviorPatternAnalysisReport({
      salesReps,
      targetVisitCount,
      analysisMonths,
    });

    expect(report).toEqual({
      improvementChallenges: [
        {
          salesRepId: 'A',
          salesRepName: '営業担当者A',
          achievementRate: 112.5,
          shortfall: 0,
        },
        {
          salesRepId: 'B',
          salesRepName: '営業担当者B',
          achievementRate: 80,
          shortfall: 8,
        },
        {
          salesRepId: 'C',
          salesRepName: '営業担当者C',
          achievementRate: 70,
          shortfall: 12,
        },
      ],
    });
  });
});