import { evaluateProposalScheduleConstraintCompliance } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 提案スケジュール制約照合', () => {
  // SCEN-1359
  test('提案スケジュールが顧客の制約期間を超えているとき不適合を示す', () => {
    const customerConstraint = {
      constraintStartDate: new Date('2026-01-01T00:00:00Z'),
      constraintEndDate: new Date('2026-03-31T00:00:00Z'),
    };

    const proposalSchedule = {
      scheduleStartDate: new Date('2026-03-15T00:00:00Z'),
      scheduleEndDate: new Date('2026-05-30T00:00:00Z'),
    };

    const result = evaluateProposalScheduleConstraintCompliance(
      customerConstraint,
      proposalSchedule
    );

    expect(result.complianceStatus).toBe('不適合');
    expect(result.message).toBe(
      '提案スケジュール（終了日：2026年5月30日）が顧客の制約期間（終了日：2026年3月31日）を60日間超過しています。スケジュール短縮または顧客との制約期間再協議が必要です。'
    );
    expect(result.excessDays).toBe(60);
    expect(result.excessPeriodStartDate).toEqual(new Date('2026-04-01T00:00:00Z'));
    expect(result.excessPeriodEndDate).toEqual(new Date('2026-05-30T00:00:00Z'));
  });
});