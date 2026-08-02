import { approveModificationRule } from '../../src/logic/it-1-br-2-2-1-1';

describe('修正ルール承認判定機能', () => {
  // SCEN-585
  test('修正ルール案の承認判定日時が正確に記録される', async () => {
    const ruleId = 'RULE-001';
    const createdAt = new Date('2024-01-15T10:30:00Z');
    const approvalRequestTime = new Date('2024-01-15T14:45:23Z');

    const approvalRequest = {
      ruleId,
      approverUserId: 'ADMIN-001',
      approvalTimestamp: approvalRequestTime,
    };

    const result = await approveModificationRule(approvalRequest);

    expect(result).toEqual({
      ruleId: 'RULE-001',
      approvalStatus: 'approved',
      approvalTimestamp: new Date('2024-01-15T14:45:23Z'),
      approverUserId: 'ADMIN-001',
      timeDifferenceSeconds: expect.any(Number),
    });

    const timeDifference = Math.abs(
      result.approvalTimestamp.getTime() - approvalRequestTime.getTime()
    ) / 1000;
    expect(timeDifference).toBeLessThanOrEqual(2);
    expect(result.approvalTimestamp.toISOString()).toBe('2024-01-15T14:45:23.000Z');
  });
});