import { generateRequirementSpecification } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-228
  test("プロセス段階情報が0件のとき、要件仕様が生成されない", () => {
    const processStages: any[] = [];

    const result = generateRequirementSpecification(processStages);

    expect(result).toEqual([]);
  });
});