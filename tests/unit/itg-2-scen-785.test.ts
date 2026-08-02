import { analyzeOperationalPerformance } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析エンジン", () => {
  test("SCEN-785: 成約実績データが欠落している場合、分析結果に null が含まれない", () => {
    // 成約実績データが空の状態を再現
    const emptyContractData = [];

    // 分析関数を呼び出す
    const analysisResult = analyzeOperationalPerformance(emptyContractData);

    // 分析結果全体に null が含まれないことを検証
    expect(analysisResult).toBeDefined();
    expect(analysisResult).not.toBeNull();

    // 各プロパティが null でなく、代替値が設定されていることを検証
    expect(analysisResult.contractCount).toBe(0);
    expect(analysisResult.contractRate).toBe(0);
    expect(analysisResult.avgDealAmount).toBe(0);
    expect(analysisResult.status).toBe("データ不足");

    // 分析結果オブジェクトのすべてのプロパティをトラバースして null チェック
    for (const key in analysisResult) {
      if (Object.prototype.hasOwnProperty.call(analysisResult, key)) {
        const value = analysisResult[key as keyof typeof analysisResult];
        expect(value).not.toBeNull();
      }
    }

    // 追加の検証: 数値フィールドが適切な型であることを確認
    expect(typeof analysisResult.contractCount).toBe("number");
    expect(typeof analysisResult.contractRate).toBe("number");
    expect(typeof analysisResult.avgDealAmount).toBe("number");
    expect(typeof analysisResult.status).toBe("string");
  });
});