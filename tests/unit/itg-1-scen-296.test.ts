import { recordCustomerReactions } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-296
  test('複数の異なる反応タイプを同時に記録できる', () => {
    const customerId = 'CUST-001';
    const recordedAt = new Date('2024-01-15T10:30:00Z');

    const reactions = [
      {
        type: 'PHONE_RESPONSE',
        content: '営業内容に関心あり',
        timestamp: recordedAt,
      },
      {
        type: 'EMAIL_REPLY',
        content: '見積依頼',
        timestamp: recordedAt,
      },
      {
        type: 'VISIT_REJECTION',
        content: '現在検討中',
        timestamp: recordedAt,
      },
    ];

    const result = recordCustomerReactions(customerId, reactions);

    expect(result).toEqual({
      customerId: 'CUST-001',
      recordCount: 3,
      records: [
        {
          id: expect.any(String),
          customerId: 'CUST-001',
          type: 'PHONE_RESPONSE',
          content: '営業内容に関心あり',
          timestamp: recordedAt,
          createdAt: expect.any(Date),
        },
        {
          id: expect.any(String),
          customerId: 'CUST-001',
          type: 'EMAIL_REPLY',
          content: '見積依頼',
          timestamp: recordedAt,
          createdAt: expect.any(Date),
        },
        {
          id: expect.any(String),
          customerId: 'CUST-001',
          type: 'VISIT_REJECTION',
          content: '現在検討中',
          timestamp: recordedAt,
          createdAt: expect.any(Date),
        },
      ],
      success: true,
    });

    expect(result.recordCount).toBe(3);
    expect(result.records).toHaveLength(3);
    expect(result.records[0].type).toBe('PHONE_RESPONSE');
    expect(result.records[0].content).toBe('営業内容に関心あり');
    expect(result.records[1].type).toBe('EMAIL_REPLY');
    expect(result.records[1].content).toBe('見積依頼');
    expect(result.records[2].type).toBe('VISIT_REJECTION');
    expect(result.records[2].content).toBe('現在検討中');
  });
});