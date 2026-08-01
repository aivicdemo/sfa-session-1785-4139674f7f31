import { convertProcessStandardToSystemRequirements } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセス標準書のシステム要件変換機能", () => {
  test("SCEN-126: プロセス段階が逆順で入力された場合も昇順に整理されて要件仕様に出力される", () => {
    // 入力: プロセス標準書データ（ステップを逆順で入力）
    const processStandardInput = {
      processStages: [
        {
          stepNumber: 4,
          stageName: "テスト",
          description: "品質確保のためのテスト実施",
          dataItems: ["テスト結果", "不具合報告"],
        },
        {
          stepNumber: 3,
          stageName: "実装",
          description: "システム実装作業",
          dataItems: ["実装コード", "実装ログ"],
        },
        {
          stepNumber: 2,
          stageName: "設計",
          description: "システム設計書作成",
          dataItems: ["設計書", "設計図"],
        },
        {
          stepNumber: 1,
          stageName: "要件定義",
          description: "要件定義書の策定",
          dataItems: ["要件リスト", "承認者"],
        },
      ],
      evaluationCriteria: [
        { criteriaId: "C01", description: "要件の完全性" },
        { criteriaId: "C02", description: "設計の実現可能性" },
      ],
    };

    // 機能を実行
    const result = convertProcessStandardToSystemRequirements(
      processStandardInput
    );

    // 期待結果: 要件仕様に含まれるプロセス段階が昇順に整理されている
    expect(result.systemRequirementSpecification).toBeDefined();
    expect(
      result.systemRequirementSpecification.processStages
    ).toBeDefined();

    // プロセス段階の順序を確認
    const stages = result.systemRequirementSpecification.processStages;
    expect(stages.length).toBe(4);

    // 昇順に整理されていることを確認（ステップ1→2→3→4）
    expect(stages[0].stepNumber).toBe(1);
    expect(stages[0].stageName).toBe("要件定義");
    expect(stages[0].description).toBe("要件定義書の策定");
    expect(stages[0].dataItems).toEqual(["要件リスト", "承認者"]);

    expect(stages[1].stepNumber).toBe(2);
    expect(stages[1].stageName).toBe("設計");
    expect(stages[1].description).toBe("システム設計書作成");
    expect(stages[1].dataItems).toEqual(["設計書", "設計図"]);

    expect(stages[2].stepNumber).toBe(3);
    expect(stages[2].stageName).toBe("実装");
    expect(stages[2].description).toBe("システム実装作業");
    expect(stages[2].dataItems).toEqual(["実装コード", "実装ログ"]);

    expect(stages[3].stepNumber).toBe(4);
    expect(stages[3].stageName).toBe("テスト");
    expect(stages[3].description).toBe("品質確保のためのテスト実施");
    expect(stages[3].dataItems).toEqual(["テスト結果", "不具合報告"]);

    // 段階の順序が入力順序に依存せず、常に昇順で並んでいることを確認
    for (let i = 0; i < stages.length - 1; i++) {
      expect(stages[i].stepNumber).toBeLessThan(stages[i + 1].stepNumber);
    }

    // 評価基準も正しく変換されていることを確認
    expect(result.systemRequirementSpecification.evaluationCriteria).toEqual([
      { criteriaId: "C01", description: "要件の完全性" },
      { criteriaId: "C02", description: "設計の実現可能性" },
    ]);
  });
});