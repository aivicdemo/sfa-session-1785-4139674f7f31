import { describe, test, expect, beforeEach } from '@jest/globals';
import { decideSalesGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者への指導方針決定', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-511
  test('指導実施期限が過去日時のとき、エラーが発生する', () => {
    const pastDeadline = '2025-01-01T10:00:00Z';
    const currentTime = new Date('2025-01-15T14:30:00Z');
    
    jest.useFakeTimers();
    jest.setSystemTime(currentTime);

    const guidanceRequest = {
      salesRepId: 'SR001',
      customerId: 'C001',
      customerName: '株式会社テスト',
      industry: '製造業',
      companySize: '従業員500名',
      dealCondition: {
        dealId: 'D001',
        dealStage: '提案中',
        dealAmount: 5000000,
      },
      guidanceDeadline: pastDeadline,
    };

    expect(() => decideSalesGuidancePolicy(guidanceRequest)).toThrow(/INVALID_DEADLINE_PAST|指導実施期限/);

    jest.useRealTimers();
  });
});