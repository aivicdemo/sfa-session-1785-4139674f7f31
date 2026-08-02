import { recordPurchaseResult } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-976
  test("購買結果記録時に重複候補が0件の場合、新規顧客として購買結果が確定状態で記録される", async () => {
    const existing_customer = {
      customer_id: "C001",
      customer_name: "既存顧客B",
      email: "existing-customer-b@example.com",
      phone: "090-1111-2222",
      company_name: "株式会社B",
      industry: "製造業",
      employee_count: 500,
      annual_revenue: 5000000000,
      created_at: new Date("2024-01-10T08:00:00Z"),
      updated_at: new Date("2024-01-10T08:00:00Z"),
      status: "active",
    };

    const purchase_data = {
      customer_name: "新規顧客A",
      email: "new-customer-a@example.com",
      phone: "090-3333-4444",
      company_name: "株式会社A",
      industry: "情報通信業",
      employee_count: 50,
      annual_revenue: 500000000,
      product_id: "PROD-001",
      quantity: 100,
      unit_price: 50000,
      total_amount: 5000000,
      purchase_date: new Date("2024-01-15T10:30:00Z"),
    };

    const result = await recordPurchaseResult({
      existing_customers: [existing_customer],
      purchase_data: purchase_data,
      duplicate_threshold: 0.85,
    });

    expect(result.duplicate_count).toBe(0);
    expect(result.purchase_record_saved).toBe(true);
    expect(result.purchase_record.customer_name).toBe("新規顧客A");
    expect(result.purchase_record.email).toBe("new-customer-a@example.com");
    expect(result.purchase_record.record_status).toBe("確定");
    expect(result.purchase_record.product_id).toBe("PROD-001");
    expect(result.purchase_record.quantity).toBe(100);
    expect(result.purchase_record.total_amount).toBe(5000000);
    expect(result.purchase_record.purchase_date).toEqual(
      new Date("2024-01-15T10:30:00Z")
    );
    expect(result.staging_table_synced).toBe(true);
    expect(result.staging_record.customer_name).toBe("新規顧客A");
    expect(result.staging_record.email).toBe("new-customer-a@example.com");
  });
});