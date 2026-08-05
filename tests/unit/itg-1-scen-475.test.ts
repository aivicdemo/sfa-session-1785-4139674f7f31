import { generateSalesActivityPatternReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-475: 開始日が終了日より後の場合、エラーを返す", () => {
    // Arrange
    const start_date = "2024-12-31";
    const end_date = "2024-12-01";
    const sales_person_id = "SP001";

    // Act & Assert
    expect(() =>
      generateSalesActivityPatternReport({
        start_date,
        end_date,
        sales_person_id,
      })
    ).toThrow(/開始日は終了日以前である必要があります/);
  });
});