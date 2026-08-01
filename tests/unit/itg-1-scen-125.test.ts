import { convertProcessStandardToSystemRequirements } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-125: プロセス標準書のシステム要件変換機能 - プロセス段階が昇順に整理されて要件仕様に出力される", () => {
    // 前提: プロセス標準書データとして、段階が混順で含まれている
    const inputProcessStandard = {
      processStages: [
        {
          stageNumber: 1,
          stageName: "要件定義",
          description: "顧客の要件を定義する",
          criteria: "要件書を作成",
        },
        {
          stageNumber: 3,
          stageName: "テスト実行",
          description: "テストを実行する",
          criteria: "テスト結果を記録",
        },
        {
          stageNumber: 2,
          stageName: "設計",
          description: "システム設計を行う",
          criteria: "設計書を作成",
        },
        {
          stageNumber: 4,
          stageName: "本番リリース",
          description: "本番環境にリリースする",
          criteria: "リリース完了を確認",
        },
      ],
    };

    // 実行: システム要件変換機能を実行
    const result = convertProcessStandardToSystemRequirements(
      inputProcessStandard
    );

    // 検証: 出力結果にプロセス段階が昇順で整理されていることを確認
    expect(result.systemRequirements).toBeDefined();
    expect(result.systemRequirements.length).toBe(4);

    // プロセス段階が昇順（1 → 2 → 3 → 4）で並んでいることを確認
    expect(result.systemRequirements[0].stageNumber).toBe(1);
    expect(result.systemRequirements[0].stageName).toBe("要件定義");
    expect(result.systemRequirements[0].systemRequirement).toBe(
      "要件書を作成"
    );

    expect(result.systemRequirements[1].stageNumber).toBe(2);
    expect(result.systemRequirements[1].stageName).toBe("設計");
    expect(result.systemRequirements[1].systemRequirement).toBe(
      "設計書を作成"
    );

    expect(result.systemRequirements[2].stageNumber).toBe(3);
    expect(result.systemRequirements[2].stageName).toBe("テスト実行");
    expect(result.systemRequirements[2].systemRequirement).toBe(
      "テスト結果を記録"
    );

    expect(result.systemRequirements[3].stageNumber).toBe(4);
    expect(result.systemRequirements[3].stageName).toBe("本番リリース");
    expect(result.systemRequirements[3].systemRequirement).toBe(
      "リリース完了を確認"
    );
  });
});