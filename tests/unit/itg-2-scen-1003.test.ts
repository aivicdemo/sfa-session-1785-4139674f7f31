import { validateProposalAndCustomerContactRecord } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  test("SCEN-1003: 提案・顧客対応記録の必須項目検証 - 対応日時が空の場合に入力が受け付けられず警告が表示される", () => {
    const input_record = {
      customer_name: "サンプル顧客A",
      contact_datetime: "",
      contact_content: "新製品紹介と導入スケジュール相談",
      contact_type: "提案",
      sales_person_id: "SP001",
      notes: "顧客より積極的なご関心をいただいた"
    };

    const validation_error = expect(() =>
      validateProposalAndCustomerContactRecord(input_record)
    ).toThrow(/対応日時/);

    expect(validation_error).toBeDefined();
  });
});