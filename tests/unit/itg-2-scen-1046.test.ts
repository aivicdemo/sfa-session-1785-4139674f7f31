import { applyNormalizationRules } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化 - 正規化ルール適用", () => {
  // SCEN-1046
  test("正規化ルールが存在しない顧客データ項目に対してスキップされる", () => {
    const normalizationRules = [
      {
        field_name: "電話番号",
        rule_id: "rule_phone_001",
        rule_type: "format_standardization",
        rule_definition: "0\\d{1,4}-?\\d{1,4}-?\\d{4}",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        field_name: "住所",
        rule_id: "rule_address_001",
        rule_type: "format_standardization",
        rule_definition: "^[都道府県]{1}[市区町村].*",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ];

    const customerData = {
      姓名: "山田太郎",
      メールアドレス: "yamada@example.com",
      電話番号: "090-1234-5678",
      住所: "東京都渋谷区道玄坂1-2-3",
      生年月日: "1990-05-15",
    };

    const result = applyNormalizationRules(customerData, normalizationRules);

    expect(result.姓名).toBe("山田太郎");
    expect(result.メールアドレス).toBe("yamada@example.com");
    expect(result.電話番号).not.toBe("090-1234-5678");
    expect(result.住所).not.toBe("東京都渋谷区道玄坂1-2-3");
    expect(result.生年月日).toBe("1990-05-15");
  });
});