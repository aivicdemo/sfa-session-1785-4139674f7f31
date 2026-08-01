import { describe, test, expect } from "@jest/globals";
import { selectAnalysisIndicators } from "../../src/logic/it-1-br-2-1-1";

describe("行動パターン分析対象指標の自動選定", () => {
  test("SCEN-742: 営業プロセス定義が0件の場合、分析対象指標が選定されない", () => {
    const processDefs: any[] = [];
    const result = selectAnalysisIndicators(processDefs);
    expect(result).toEqual([]);
  });
});