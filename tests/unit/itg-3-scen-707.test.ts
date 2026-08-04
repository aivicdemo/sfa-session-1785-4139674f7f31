import { validateDealScheduleDate } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-707
  test("商談予定日が本日以降の日付のとき、日付データは妥当と判定される", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const resultToday = validateDealScheduleDate(today);
    expect(resultToday.isValid).toBe(true);
    expect(resultToday.validationStatus).toBe("VALID");

    const resultTomorrow = validateDealScheduleDate(tomorrow);
    expect(resultTomorrow.isValid).toBe(true);
    expect(resultTomorrow.validationStatus).toBe("VALID");

    const resultThirtyDaysLater = validateDealScheduleDate(thirtyDaysLater);
    expect(resultThirtyDaysLater.isValid).toBe(true);
    expect(resultThirtyDaysLater.validationStatus).toBe("VALID");
  });
});