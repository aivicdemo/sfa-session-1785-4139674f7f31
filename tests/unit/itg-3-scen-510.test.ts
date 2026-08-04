import { validateGuidanceDateFormat } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 営業担当者への指導方針決定", () => {
  // SCEN-510
  test("指導実施期限が不正な日付形式のとき、エラーが発生する", () => {
    const invalidDateFormats = [
      "2026-13-45",
      "2026/13/45",
      "invalid-date",
      "2026年13月45日",
      "2026-1-1",
      "2026-01-32",
      "2026-02-30",
      "",
      "not-a-date",
      "2026.01.01",
    ];

    for (const invalidFormat of invalidDateFormats) {
      expect(() => validateGuidanceDateFormat(invalidFormat)).toThrow(
        /指導実施期限/
      );
    }
  });
});