import { initializeCollectionDefinition } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業事例データ品質検証エンジン", () => {
  // SCEN-1069
  test("最小収集件数が1件で設定される", () => {
    fetchMock.resetMocks();

    const minCollectionCount = 1;
    const collectionDefinition = initializeCollectionDefinition({
      minCollectionCount,
    });

    expect(collectionDefinition.minCollectionCount).toBe(1);
    expect(typeof collectionDefinition.minCollectionCount).toBe("number");
  });
});