import { detectDuplicateProposalRecords } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-915
  test('[normal] 顧客購買検討データ入力検証機能 - 提案内容データに重複レコードが含まれるとき重複を検出して通知する', () => {
    const duplicate_record_1 = {
      customer_id: 'C001',
      product_id: 'P123',
      proposal_date: '2024-01-15',
      amount: 50000,
    };

    const duplicate_record_2 = {
      customer_id: 'C001',
      product_id: 'P123',
      proposal_date: '2024-01-15',
      amount: 50000,
    };

    const proposal_data = [duplicate_record_1, duplicate_record_2];

    const validation_result = detectDuplicateProposalRecords(proposal_data);

    expect(validation_result.duplicate_detected).toBe(true);
    expect(validation_result.duplicate_details).toContain(
      'レコード1と2が重複しています。顧客ID:C001、商品ID:P123、提案日:2024-01-15'
    );
    expect(validation_result.notification_sent).toBe(true);
    expect(validation_result.notification_type).toBe('DUPLICATE_RECORD_WARNING');
  });
});