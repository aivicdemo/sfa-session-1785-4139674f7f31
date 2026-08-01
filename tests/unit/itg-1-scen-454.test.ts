import { analyzeAndReportSalesActivityPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-454
  test('[normal] 提案実行の入力時刻と顧客対応記録の入力時刻が異なる場合、時系列に基づいて正しく関連付けられる', () => {
    const testData = {
      customerId: 'C001',
      recordA: {
        type: 'proposal_execution',
        recordedAt: new Date('2024-01-15T14:30:00Z'),
      },
      recordB: {
        type: 'customer_contact_record',
        recordedAt: new Date('2024-01-15T14:25:00Z'),
      },
    };

    const result = analyzeAndReportSalesActivityPatterns({
      customerId: testData.customerId,
      activities: [
        {
          id: 'activity_001',
          type: testData.recordA.type,
          customerId: testData.customerId,
          recordedAt: testData.recordA.recordedAt,
          content: 'Proposal for Product X',
        },
        {
          id: 'activity_002',
          type: testData.recordB.type,
          customerId: testData.customerId,
          recordedAt: testData.recordB.recordedAt,
          content: 'Customer responded positively',
        },
      ],
    });

    expect(result).toEqual({
      customerId: 'C001',
      activitySequence: [
        {
          id: 'activity_002',
          type: 'customer_contact_record',
          recordedAt: new Date('2024-01-15T14:25:00Z'),
          sequenceOrder: 1,
        },
        {
          id: 'activity_001',
          type: 'proposal_execution',
          recordedAt: new Date('2024-01-15T14:30:00Z'),
          sequenceOrder: 2,
        },
      ],
      chronologicallyOrdered: true,
      timeDifference: {
        milliseconds: 300000,
        seconds: 300,
        minutes: 5,
      },
      analysisReport: {
        activityPattern: 'customer_contact_then_proposal',
        timelineAccuracy: true,
        recordedSequence: [
          {
            order: 1,
            type: 'customer_contact_record',
            timestamp: '2024-01-15T14:25:00Z',
          },
          {
            order: 2,
            type: 'proposal_execution',
            timestamp: '2024-01-15T14:30:00Z',
          },
        ],
      },
    });
  });
});