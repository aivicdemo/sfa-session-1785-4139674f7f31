import { validateAndSaveProposalRecord } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1008
  test("提案・顧客対応記録の必須項目検証 - 同じ記録データで2回保存処理を実行しても同じ結果になる", async () => {
    const test_record = {
      customer_name: "山田太郎",
      proposal_date: "2024-01-15",
      response_content: "製品Aの提案実施",
      status: "進行中",
    };

    const first_result = await validateAndSaveProposalRecord(test_record);
    expect(first_result).toHaveProperty("record_id");
    const first_record_id = first_result.record_id;

    const second_result = await validateAndSaveProposalRecord(test_record);
    expect(second_result).toHaveProperty("record_id");
    const second_record_id = second_result.record_id;

    expect(first_record_id).toBe(second_record_id);

    expect(second_result).toEqual({
      record_id: first_record_id,
      customer_name: "山田太郎",
      proposal_date: "2024-01-15",
      response_content: "製品Aの提案実施",
      status: "進行中",
      created_at: expect.any(String),
    });

    expect(second_result.customer_name).toBe("山田太郎");
    expect(second_result.proposal_date).toBe("2024-01-15");
    expect(second_result.response_content).toBe("製品Aの提案実施");
    expect(second_result.status).toBe("進行中");
  });
});