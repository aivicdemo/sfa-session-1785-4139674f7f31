import { mapProcessStandardDataItems } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-169
  test('should map all data items from standard process document to system-implementable format', () => {
    const standardProcessDocument = {
      dataItems: [
        { name: '顧客名', description: '顧客の正式な名称' },
        { name: '売上金額', description: '契約金額（税抜き）' },
        { name: '契約日', description: '営業契約の成立日' },
        { name: '部門コード', description: '顧客が属する営業部門' },
        { name: '営業担当者ID', description: '契約を担当した営業員の識別子' },
      ],
    };

    const result = mapProcessStandardDataItems(standardProcessDocument);

    expect(result.mappedItems).toHaveLength(5);
    expect(result.mappedItems).toEqual(
      expect.arrayContaining([
        {
          originalName: '顧客名',
          systemColumnName: 'customer_name',
          dataType: 'varchar',
          constraint: 'NOT NULL',
          format: 'text',
          maxLength: 255,
        },
        {
          originalName: '売上金額',
          systemColumnName: 'sales_amount',
          dataType: 'decimal',
          constraint: 'NOT NULL',
          format: 'numeric',
          precision: 15,
          scale: 2,
        },
        {
          originalName: '契約日',
          systemColumnName: 'contract_date',
          dataType: 'date',
          constraint: 'NOT NULL',
          format: 'ISO8601',
          pattern: 'YYYY-MM-DD',
        },
        {
          originalName: '部門コード',
          systemColumnName: 'department_code',
          dataType: 'varchar',
          constraint: 'NOT NULL',
          format: 'alphanumeric',
          length: 3,
          pattern: '^[A-Z0-9]{3}$',
        },
        {
          originalName: '営業担当者ID',
          systemColumnName: 'sales_rep_id',
          dataType: 'uuid',
          constraint: 'NOT NULL',
          format: 'uuid',
          pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        },
      ])
    );

    expect(result.conversionStatus).toBe('success');
    expect(result.failureCount).toBe(0);
    expect(result.successCount).toBe(5);
  });
});