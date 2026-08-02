import { decidePrioritizationOrder } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-315
  test("改善指導優先順位の決定 - 複数営業担当者の優先度が複数件のとき、スコアの降順に応じて優先度が順序付けられる", () => {
    const input = [
      { salesPersonId: "A", score: 80 },
      { salesPersonId: "B", score: 65 },
      { salesPersonId: "C", score: 90 },
    ];

    const result = decidePrioritizationOrder(input);

    expect(result).toEqual([
      { rank: 1, salesPersonId: "C", score: 90 },
      { rank: 2, salesPersonId: "A", score: 80 },
      { rank: 3, salesPersonId: "B", score: 65 },
    ]);
  });
});