import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-516
  test("推論精度監視の対象期間が月初日から開始される", () => {
    const mockCurrentDate = new Date("2024-03-15T10:30:00Z");
    const originalDateConstructor = global.Date;

    const DateMock = jest.fn((dateString?: string | number | Date) => {
      if (dateString === undefined) {
        return mockCurrentDate;
      }
      return new originalDateConstructor(dateString);
    }) as any;

    DateMock.prototype = originalDateConstructor.prototype;
    DateMock.now = () => mockCurrentDate.getTime();
    DateMock.UTC = originalDateConstructor.UTC;
    DateMock.parse = originalDateConstructor.parse;

    global.Date = DateMock;

    try {
      const { getMonitoringPeriodStart } = require("../../src/logic/it-1-br-2-1-1-1");

      const result = getMonitoringPeriodStart();

      expect(result).toBeInstanceOf(Date);

      const expectedStartDate = new originalDateConstructor("2024-03-01T00:00:00Z");
      expect(result.getUTCFullYear()).toBe(expectedStartDate.getUTCFullYear());
      expect(result.getUTCMonth()).toBe(expectedStartDate.getUTCMonth());
      expect(result.getUTCDate()).toBe(expectedStartDate.getUTCDate());

      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);

      expect(result.toISOString()).toBe("2024-03-01T00:00:00.000Z");
    } finally {
      global.Date = originalDateConstructor;
    }
  });
});