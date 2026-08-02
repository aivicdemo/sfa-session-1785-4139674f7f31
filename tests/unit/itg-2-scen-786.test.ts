import { calculateProcessDeviation } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析機能", () => {
  // SCEN-786
  test("標準プロセス定義が欠落している場合、乖離度計算がエラーになる", () => {
    const executed_process_data = {
      sales_steps: [
        { step_name: "初回接触", duration_minutes: 120 },
        { step_name: "提案", duration_minutes: 180 },
        { step_name: "交渉", duration_minutes: 180 }
      ],
      total_duration_minutes: 480
    };

    const standard_process_definition = null;

    expect(() =>
      calculateProcessDeviation(executed_process_data, standard_process_definition)
    ).toThrow(/標準プロセス定義/);
  });
});