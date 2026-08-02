import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { integrateMultipleSalesRecordsWithPurchaseResult } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-970
  test('購買結果記録・営業データ統合機能 - 購買結果に関連する商談記録が複数件の場合にすべて統合される', () => {
    const purchase_id = 'PO-20240115-001';
    const deal_records = [
      {
        deal_id: 'DEAL-A001',
        purchase_id: purchase_id,
        sales_person_id: 'SP-001',
        sales_person_name: '担当者A',
        deal_amount: 500000,
        deal_status: '成約',
        contact_date: '2024-01-10T09:00:00Z'
      },
      {
        deal_id: 'DEAL-A002',
        purchase_id: purchase_id,
        sales_person_id: 'SP-002',
        sales_person_name: '担当者B',
        deal_amount: 300000,
        deal_status: '成約',
        contact_date: '2024-01-12T14:30:00Z'
      },
      {
        deal_id: 'DEAL-A003',
        purchase_id: purchase_id,
        sales_person_id: 'SP-003',
        sales_person_name: '担当者C',
        deal_amount: 200000,
        deal_status: '成約',
        contact_date: '2024-01-14T10:15:00Z'
      }
    ];

    const integrated_result = integrateMultipleSalesRecordsWithPurchaseResult({
      purchase_id: purchase_id,
      deal_records: deal_records
    });

    expect(integrated_result.purchase_id).toBe('PO-20240115-001');
    expect(integrated_result.integrated_deal_count).toBe(3);
    expect(integrated_result.integrated_sales_records).toHaveLength(3);

    const deal_ids = integrated_result.integrated_sales_records.map(r => r.deal_id);
    expect(deal_ids).toContain('DEAL-A001');
    expect(deal_ids).toContain('DEAL-A002');
    expect(deal_ids).toContain('DEAL-A003');

    const sales_person_names = integrated_result.integrated_sales_records.map(r => r.sales_person_name);
    expect(sales_person_names).toContain('担当者A');
    expect(sales_person_names).toContain('担当者B');
    expect(sales_person_names).toContain('担当者C');

    const deal_a001 = integrated_result.integrated_sales_records.find(r => r.deal_id === 'DEAL-A001');
    expect(deal_a001).toBeDefined();
    expect(deal_a001?.sales_person_id).toBe('SP-001');
    expect(deal_a001?.sales_person_name).toBe('担当者A');
    expect(deal_a001?.deal_amount).toBe(500000);

    const deal_a002 = integrated_result.integrated_sales_records.find(r => r.deal_id === 'DEAL-A002');
    expect(deal_a002).toBeDefined();
    expect(deal_a002?.sales_person_id).toBe('SP-002');
    expect(deal_a002?.sales_person_name).toBe('担当者B');
    expect(deal_a002?.deal_amount).toBe(300000);

    const deal_a003 = integrated_result.integrated_sales_records.find(r => r.deal_id === 'DEAL-A003');
    expect(deal_a003).toBeDefined();
    expect(deal_a003?.sales_person_id).toBe('SP-003');
    expect(deal_a003?.sales_person_name).toBe('担当者C');
    expect(deal_a003?.deal_amount).toBe(200000);

    expect(integrated_result.total_integrated_amount).toBe(1000000);
    expect(integrated_result.integration_status).toBe('completed');
  });
});