import { confirmExtractionRange } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセスログ抽出範囲確定機能", () => {
  // SCEN-077
  test("確定した抽出範囲がIT部門への指示情報に正しく反映される", () => {
    const input = {
      startDateTime: "2024-01-01T00:00:00Z",
      endDateTime: "2024-01-31T23:59:00Z",
      targetDepartment: "営業部",
    };

    const result = confirmExtractionRange(input);

    expect(result).toEqual({
      startDateTime: "2024-01-01T00:00:00Z",
      endDateTime: "2024-01-31T23:59:00Z",
      targetDepartment: "営業部",
      instructionStatus: "confirmed",
    });

    expect(result.startDateTime).toBe("2024-01-01T00:00:00Z");
    expect(result.endDateTime).toBe("2024-01-31T23:59:00Z");
    expect(result.targetDepartment).toBe("営業部");
    expect(result.instructionStatus).toBe("confirmed");
  });
});