import { integratePurchaseDataToSalesDatabase } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-959
  test('購買結果記録・営業データ統合機能 - 購買確定通知から営業データの統合記録までの一連の処理が正常に完了する', async () => {
    const fetchMock = require('jest-fetch-mock');
    fetchMock.resetMocks();

    const purchase_notification = {
      purchase_id: 'PO-20240115-001',
      customer_id: 'CUST-5678',
      purchase_amount: 250000,
      purchase_datetime: '2024-01-15T10:30:00Z'
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({
        purchase_id: 'PO-20240115-001',
        settlement_status: 'completed'
      }),
      { status: 200 }
    );

    const result = await integratePurchaseDataToSalesDatabase(purchase_notification);

    expect(result).toEqual({
      sales_transaction_created: true,
      transaction_record: {
        customer_id: 'CUST-5678',
        purchase_amount: 250000,
        purchase_datetime: '2024-01-15T10:30:00Z',
        status: 'confirmed'
      },
      pipeline_stage_updated: true,
      updated_pipeline_stage: 'closed_won',
      previous_pipeline_stage: 'negotiation'
    });

    expect(result.sales_transaction_created).toBe(true);
    expect(result.transaction_record.customer_id).toBe('CUST-5678');
    expect(result.transaction_record.purchase_amount).toBe(250000);
    expect(result.transaction_record.purchase_datetime).toBe('2024-01-15T10:30:00Z');
    expect(result.transaction_record.status).toBe('confirmed');
    expect(result.pipeline_stage_updated).toBe(true);
    expect(result.updated_pipeline_stage).toBe('closed_won');
    expect(result.previous_pipeline_stage).toBe('negotiation');
  });
});