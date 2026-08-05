import { monitorAiInferencePrecision } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-346
  test("AIエージェント推論ログが空のとき、エラーが発生する", () => {
    const emptyInferenceLogs: any[] = [];

    expect(() => {
      monitorAiInferencePrecision(emptyInferenceLogs);
    }).toThrow(/推論ログ/);
  });
});