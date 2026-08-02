import { calculatePurchaseSignal } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-770
  test("購買シグナル算出全体 - 同じ顧客データで2回実行しても信号検出根拠が同じ結果になる", () => {
    const customer_data = {
      customer_id: "CUST-001",
      company_name: "テスト商社",
      inquiry_count_30days: 5,
      proposal_download_count: 2,
      email_open_rate: 0.65,
    };

    const first_result = calculatePurchaseSignal(customer_data);

    const signal_type_1 = first_result.signal_type;
    const inquiry_count_evidence_1 = first_result.evidence.inquiry_count;
    const download_count_evidence_1 = first_result.evidence.download_count;
    const email_open_rate_evidence_1 = first_result.evidence.email_open_rate;
    const weight_inquiry_1 = first_result.weights.inquiry_weight;
    const weight_download_1 = first_result.weights.download_weight;
    const weight_email_1 = first_result.weights.email_weight;
    const signal_score_1 = first_result.signal_score;

    const second_result = calculatePurchaseSignal(customer_data);

    const signal_type_2 = second_result.signal_type;
    const inquiry_count_evidence_2 = second_result.evidence.inquiry_count;
    const download_count_evidence_2 = second_result.evidence.download_count;
    const email_open_rate_evidence_2 = second_result.evidence.email_open_rate;
    const weight_inquiry_2 = second_result.weights.inquiry_weight;
    const weight_download_2 = second_result.weights.download_weight;
    const weight_email_2 = second_result.weights.email_weight;
    const signal_score_2 = second_result.signal_score;

    expect(signal_type_1).toBe(signal_type_2);
    expect(signal_type_1).toBe("high_frequency_contact");

    expect(inquiry_count_evidence_1).toBe(inquiry_count_evidence_2);
    expect(inquiry_count_evidence_1).toBe(5);

    expect(download_count_evidence_1).toBe(download_count_evidence_2);
    expect(download_count_evidence_1).toBe(2);

    expect(email_open_rate_evidence_1).toBe(email_open_rate_evidence_2);
    expect(email_open_rate_evidence_1).toBe(0.65);

    expect(weight_inquiry_1).toBe(weight_inquiry_2);
    expect(weight_inquiry_1).toBe(0.4);

    expect(weight_download_1).toBe(weight_download_2);
    expect(weight_download_1).toBe(0.35);

    expect(weight_email_1).toBe(weight_email_2);
    expect(weight_email_1).toBe(0.25);

    expect(signal_score_1).toBe(signal_score_2);
    expect(signal_score_1).toBe(3.75);
  });
});