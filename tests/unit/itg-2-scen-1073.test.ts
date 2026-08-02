import { defineBusinessCaseCollectionRule } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業事例データ収集定義エンジン', () => {
  // SCEN-1073
  test('必須データ項目が複数個で設定される', () => {
    const collectionRuleDefinition = {
      ruleId: 'rule-001',
      ruleName: '営業事例基本収集ルール',
      requiredDataItems: [
        {
          itemId: 'item-001',
          itemName: '顧客名',
          isRequired: true,
          dataType: 'string',
          description: '顧客企業の正式名称'
        },
        {
          itemId: 'item-002',
          itemName: '案件金額',
          isRequired: true,
          dataType: 'number',
          description: '受注案件の金額'
        },
        {
          itemId: 'item-003',
          itemName: '受注日',
          isRequired: true,
          dataType: 'date',
          description: '受注確定日'
        }
      ],
      collectionPeriodStart: new Date('2024-01-01T00:00:00Z'),
      collectionPeriodEnd: new Date('2024-12-31T23:59:59Z'),
      minimumCasesRequired: 10,
      status: 'active',
      createdAt: new Date('2024-01-10T09:00:00Z')
    };

    const result = defineBusinessCaseCollectionRule(collectionRuleDefinition);

    expect(result.ruleId).toBe('rule-001');
    expect(result.requiredDataItems).toHaveLength(3);
    expect(result.requiredDataItems[0].itemName).toBe('顧客名');
    expect(result.requiredDataItems[0].isRequired).toBe(true);
    expect(result.requiredDataItems[1].itemName).toBe('案件金額');
    expect(result.requiredDataItems[1].isRequired).toBe(true);
    expect(result.requiredDataItems[2].itemName).toBe('受注日');
    expect(result.requiredDataItems[2].isRequired).toBe(true);
  });
});