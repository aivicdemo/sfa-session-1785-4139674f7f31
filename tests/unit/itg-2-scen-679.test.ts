import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { visualizeRecommendationRationale } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  let originalDateNow: typeof Date.now;

  beforeEach(() => {
    originalDateNow = Date.now;
    Date.now = jest.fn(() => new Date("2024-01-15T14:30:00Z").getTime());
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  test("SCEN-679: 推奨根拠が作成日時から現在日時までちょうど1日のとき根拠として含まれる", () => {
    const createdAt = new Date("2024-01-14T14:30:00Z");
    const currentTime = new Date("2024-01-15T14:30:00Z");
    const elapsedHours = 24;

    const rationaleInput = {
      id: "rationale-001",
      createdAt: createdAt,
      content: "Past successful case with similar customer profile",
      validityStatus: "active" as const,
      sourceType: "historical_case" as const,
    };

    const result = visualizeRecommendationRationale({
      rationale: rationaleInput,
      currentTime: currentTime,
      maxAgeHours: 24,
    });

    expect(result.isIncluded).toBe(true);
    expect(result.elapsedHours).toBe(elapsedHours);
    expect(result.rationale.id).toBe("rationale-001");
    expect(result.rationale.content).toBe(
      "Past successful case with similar customer profile"
    );
    expect(result.rationale.validityStatus).toBe("active");
    expect(result.rationale.createdAt).toEqual(createdAt);
    expect(result.displayDetails).toEqual({
      createdAt: "2024-01-14T14:30:00Z",
      content: "Past successful case with similar customer profile",
      validityStatus: "active",
      elapsedTime: "24 hours",
      sourceType: "historical_case",
    });
  });
});