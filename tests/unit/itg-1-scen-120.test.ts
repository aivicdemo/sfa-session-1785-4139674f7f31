import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-120
  test('プロセス標準書のシステム要件変換機能 - 必須データ項目が複数件の場合、全件分のデータ項目仕様が生成される', () => {
    const processStandard = {
      id: 'PS-001',
      name: '営業プロセス標準書',
      description: '標準営業プロセス',
      requiredDataItems: [
        {
          itemId: 'ITEM-001',
          itemName: '顧客ID',
          dataType: 'string',
          length: 10,
          required: true,
          description: '顧客を識別するID'
        },
        {
          itemId: 'ITEM-002',
          itemName: '受注日',
          dataType: 'date',
          format: 'YYYY-MM-DD',
          required: true,
          description: '受注が成立した日付'
        },
        {
          itemId: 'ITEM-003',
          itemName: '商品コード',
          dataType: 'string',
          length: 8,
          required: true,
          description: '商品を識別するコード'
        }
      ],
      stages: [
        {
          stageId: 'STAGE-001',
          stageName: '初回接触',
          sequenceNumber: 1
        }
      ],
      kpiCriteria: []
    };

    const systemRequirements = convertProcessStandardToSystemRequirements(processStandard);

    expect(systemRequirements.dataItemSpecifications).toHaveLength(3);

    const customerIdSpec = systemRequirements.dataItemSpecifications[0];
    expect(customerIdSpec.itemName).toBe('顧客ID');
    expect(customerIdSpec.dataType).toBe('string');
    expect(customerIdSpec.length).toBe(10);
    expect(customerIdSpec.required).toBe(true);

    const orderDateSpec = systemRequirements.dataItemSpecifications[1];
    expect(orderDateSpec.itemName).toBe('受注日');
    expect(orderDateSpec.dataType).toBe('date');
    expect(orderDateSpec.format).toBe('YYYY-MM-DD');
    expect(orderDateSpec.required).toBe(true);

    const productCodeSpec = systemRequirements.dataItemSpecifications[2];
    expect(productCodeSpec.itemName).toBe('商品コード');
    expect(productCodeSpec.dataType).toBe('string');
    expect(productCodeSpec.length).toBe(8);
    expect(productCodeSpec.required).toBe(true);
  });
});