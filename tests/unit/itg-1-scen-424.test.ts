import { recordCustomerReaction } from "../../src/logic/it-1-br-2-1-1";

describe("顧客反応の標準化分類・記録機能", () => {
  // SCEN-424
  test("同じ顧客反応を2回記録しても一貫した結果が得られる", () => {
    const customer_id = "CUST_00001";
    const contact_date_time = new Date("2024-01-15T14:30:00Z");
    const handler_id = "EMP_00042";
    const classification_code = "P001";
    const classification_name = "前向き";

    // 1回目の記録
    const first_record = recordCustomerReaction({
      customer_id,
      contact_date_time,
      handler_id,
      classification_code,
      classification_name,
    });

    // 2回目の記録（同じ顧客ID、同じ対応日時で『前向き』を再度選択）
    const second_record = recordCustomerReaction({
      customer_id,
      contact_date_time,
      handler_id,
      classification_code,
      classification_name,
    });

    // 1回目の記録内容を照会
    expect(first_record).toEqual({
      record_id: expect.any(String),
      customer_id,
      contact_date_time,
      handler_id,
      classification_code: "P001",
      classification_name: "前向き",
      recorded_at: expect.any(Date),
    });

    // 2回目の記録内容を照会
    expect(second_record).toEqual({
      record_id: expect.any(String),
      customer_id,
      contact_date_time,
      handler_id,
      classification_code: "P001",
      classification_name: "前向き",
      recorded_at: expect.any(Date),
    });

    // 1回目と2回目の記録データを比較
    // 分類コード、分類名、顧客ID、対応者ID、対応日時が完全に一致
    expect(first_record.classification_code).toBe(second_record.classification_code);
    expect(first_record.classification_name).toBe(second_record.classification_name);
    expect(first_record.customer_id).toBe(second_record.customer_id);
    expect(first_record.handler_id).toBe(second_record.handler_id);
    expect(first_record.contact_date_time).toEqual(second_record.contact_date_time);

    // record_id は異なるが、その他の属性は同一
    expect(first_record.record_id).not.toBe(second_record.record_id);
  });
});