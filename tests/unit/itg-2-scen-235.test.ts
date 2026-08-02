import { convertDataQualityRequirements } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-235
  test("[normal] データ項目が1件のとき、データ項目の要件仕様が正常に変換される", () => {
    const input = {
      dataItems: [
        {
          itemName: "顧客名",
          dataType: "文字列",
          isRequired: true,
          maxLength: 100,
        },
      ],
    };

    const result = convertDataQualityRequirements(input);

    expect(result.status).toBe("success");
    expect(result.errors).toEqual([]);
    expect(result.convertedRequirements).toHaveLength(1);
    expect(result.convertedRequirements[0]).toEqual({
      itemName: "顧客名",
      dataType: "string",
      isRequired: true,
      constraints: {
        maxLength: 100,
      },
    });
  });
});