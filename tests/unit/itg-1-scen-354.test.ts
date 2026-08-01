import { describe, test, expect } from '@jest/globals';
import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-354: [normal] 営業担当者の行動ログが複数件のとき、行動パターンが正しく抽出される', () => {
    const salesPersonId = 'SP-001';
    const activityLogs = [
      {
        id: 'AL-001',
        salesPersonId: salesPersonId,
        activityType: '訪問',
        timestamp: new Date('2024-01-15T09:00:00Z'),
      },
      {
        id: 'AL-002',
        salesPersonId: salesPersonId,
        activityType: '電話',
        timestamp: new Date('2024-01-15T10:30:00Z'),
      },
      {
        id: 'AL-003',
        salesPersonId: salesPersonId,
        activityType: 'メール',
        timestamp: new Date('2024-01-15T11:00:00Z'),
      },
      {
        id: 'AL-004',
        salesPersonId: salesPersonId,
        activityType: '提案',
        timestamp: new Date('2024-01-15T13:00:00Z'),
      },
      {
        id: 'AL-005',
        salesPersonId: salesPersonId,
        activityType: '見積作成',
        timestamp: new Date('2024-01-15T14:30:00Z'),
      },
    ];

    const result = generateBehaviorPatternAnalysisReport(salesPersonId, activityLogs);

    expect(result).toEqual({
      salesPersonId: salesPersonId,
      totalActivities: 5,
      activityFrequencies: {
        訪問: 20,
        電話: 20,
        メール: 20,
        提案: 20,
        見積作成: 20,
      },
      mostFrequentPattern: '訪問→提案→見積作成',
      patternOccurrences: 1,
    });
  });
});