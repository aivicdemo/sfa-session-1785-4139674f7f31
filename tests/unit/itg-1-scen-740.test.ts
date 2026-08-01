import { describe, it, expect, beforeEach } from '@jest/globals';
import { validateSubmissionDatesBeforeDistribution } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-740
  it('成功パターン適用ガイドラインの周知完了判定機能 - ガイドライン配布日より前の提出日時を持つレコードが存在するときエラーが発生する', () => {
    const distributionDate = new Date('2024-04-01T00:00:00Z');
    const submissionRecords = [
      {
        id: 'rec_001',
        submissionDateTime: new Date('2024-03-25T10:30:00Z'),
        employeeId: 'emp_001',
        status: 'pending',
      },
    ];

    expect(() =>
      validateSubmissionDatesBeforeDistribution(
        distributionDate,
        submissionRecords
      )
    ).toThrow(/配布日/);
  });
});