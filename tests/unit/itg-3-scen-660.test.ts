import { validateDealScheduleDateAgainstToday } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-660
  test('顧客情報入力検証機能 - 商談予定日が本日より前のとき、該当項目の修正を促す', () => {
    const today = new Date('2026-08-02T00:00:00Z');
    const yesterdayInput = '2026-08-01';
    const customerName = 'テスト株式会社';
    const dealContent = '新規システム導入提案';

    const validationInput = {
      customerName,
      dealContent,
      scheduledDealDate: yesterdayInput,
      referenceDate: today,
    };

    const result = validateDealScheduleDateAgainstToday(validationInput);

    expect(result.isValid).toBe(false);
    expect(result.hasDateError).toBe(true);
    expect(result.fieldErrors).toContainEqual(
      expect.objectContaining({
        fieldName: 'scheduledDealDate',
        errorMessage: '商談予定日は本日以降の日付を選択してください',
        shouldHighlight: true,
      })
    );
    expect(result.shouldBlockSubmission).toBe(true);
  });
});