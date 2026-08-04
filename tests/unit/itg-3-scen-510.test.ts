import { validateInstructionDeadline } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者への指導方針決定', () => {
  test('SCEN-510: 指導実施期限が不正な日付形式のとき、エラーが発生する', () => {
    const invalidDateFormats = [
      '2026-13-45',
      '2026/13/45',
      'invalid-date',
      '2026年13月45日',
      '2026-02-30',
      '2026-13-01',
      '2026-00-15',
      'abc-def-ghi',
      '2026-1-15',
      '2026-01-1',
    ];

    invalidDateFormats.forEach((invalidDate) => {
      expect(() =>
        validateInstructionDeadline({
          instructionDeadline: invalidDate,
          instructionPolicy: '提案資料の修正方法に関する指導',
          targetSalesRepId: 'SR-001',
        })
      ).toThrow(/日付形式/);
    });
  });
});