import { evaluateScheduleAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - スケジュール適合判定', () => {
  // SCEN-1324
  test('[normal] 提案内容と顧客制約条件の自動照合機能 - スケジュール期間が提案実装期間より1日多いとき、スケジュール適合判定が肯定で返される', () => {
    const proposalStartDate = new Date('2026-01-01T00:00:00Z');
    const proposalEndDate = new Date('2026-01-10T23:59:59Z');
    const proposalDurationDays = 10;

    const customerScheduleStartDate = new Date('2026-01-01T00:00:00Z');
    const customerScheduleEndDate = new Date('2026-01-11T23:59:59Z');
    const customerScheduleDurationDays = 11;

    const proposalData = {
      proposalId: 'PROP-2026-001',
      implementationStartDate: proposalStartDate,
      implementationEndDate: proposalEndDate,
      durationDays: proposalDurationDays,
    };

    const customerConstraint = {
      customerId: 'CUST-2026-001',
      scheduleStartDate: customerScheduleStartDate,
      scheduleEndDate: customerScheduleEndDate,
      availableDurationDays: customerScheduleDurationDays,
    };

    const result = evaluateScheduleAlignment(proposalData, customerConstraint);

    expect(result.isScheduleAligned).toBe(true);
    expect(result.alignmentReason).toMatch(/スケジュール内に収まる|期間内|実装可能/);
  });
});