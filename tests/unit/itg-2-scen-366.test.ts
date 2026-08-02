import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-366
  test("顧客IDが重複している場合、データ不整合として検出される", () => {
    const inputDataset = [
      {
        customer_id: "CUST-00001",
        customer_name: "山田太郎",
        address: "東京都渋谷区1-1-1",
        phone: "03-1234-5678",
      },
      {
        customer_id: "CUST-00001",
        customer_name: "山田次郎",
        address: "東京都新宿区2-2-2",
        phone: "03-9876-5432",
      },
    ];

    const result = detectDuplicateCustomers(inputDataset);

    expect(result.detected_duplicates.length).toBeGreaterThanOrEqual(1);
    
    const duplicate_record = result.detected_duplicates[0];
    expect(duplicate_record.duplicate_customer_id).toBe("CUST-00001");
    expect(duplicate_record.duplicate_count).toBe(2);
    expect(duplicate_record.inconsistency_type).toBe("重複");
  });
});