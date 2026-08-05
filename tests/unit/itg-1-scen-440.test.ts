import { recordCustomerReactionClassifications } from "../../src/logic/it-1-br-2-1-1";

describe("顧客反応の標準化分類記録機能", () => {
  // SCEN-440
  test("顧客反応の分類パターンが最大許容値と一致するとき完全に記録される", async () => {
    const MAX_CLASSIFICATION_PATTERNS = 256;

    const classification_patterns = Array.from(
      { length: MAX_CLASSIFICATION_PATTERNS },
      (_, index) => ({
        pattern_id: `pattern_${index + 1}`,
        pattern_name: `反応パターン_${index + 1}`,
        pattern_definition: `顧客反応タイプ: ${index + 1}`,
        created_at: new Date("2024-01-15T10:00:00Z"),
      })
    );

    const result = await recordCustomerReactionClassifications(
      classification_patterns
    );

    expect(result.recorded_count).toBe(MAX_CLASSIFICATION_PATTERNS);
    expect(result.total_patterns).toBe(MAX_CLASSIFICATION_PATTERNS);
    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();

    expect(result.stored_patterns).toHaveLength(MAX_CLASSIFICATION_PATTERNS);

    result.stored_patterns.forEach((stored_pattern, index) => {
      expect(stored_pattern.pattern_id).toBe(`pattern_${index + 1}`);
      expect(stored_pattern.pattern_name).toBe(`反応パターン_${index + 1}`);
      expect(stored_pattern.pattern_definition).toBe(
        `顧客反応タイプ: ${index + 1}`
      );
      expect(stored_pattern.created_at).toEqual(
        new Date("2024-01-15T10:00:00Z")
      );
    });

    expect(result.stored_patterns.every((p) => p.pattern_id)).toBe(true);
    expect(result.stored_patterns.every((p) => p.pattern_name)).toBe(true);
    expect(result.stored_patterns.every((p) => p.pattern_definition)).toBe(
      true
    );
  });
});