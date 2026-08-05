import { convertProcessDefinitionToRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-186
  test('判定基準で参照されるデータ項目がデータ項目仕様に存在しないときReferentialIntegrityErrorが発生する', () => {
    const processDefinition = {
      id: 'proc_def_001',
      name: '営業段階評価ルール',
      version: '1.0.0',
      judgmentCriteria: [
        {
          id: 'rule_001',
          name: '初期接触評価',
          conditions: [
            {
              dataItemName: '顧客信用スコア',
              operator: 'greaterThanOrEqual',
              threshold: 70
            }
          ]
        }
      ]
    };

    const dataItemSpecification = [
      {
        id: 'data_item_001',
        name: '営業段階',
        dataType: 'string'
      },
      {
        id: 'data_item_002',
        name: '商談金額',
        dataType: 'number'
      }
    ];

    expect(() => 
      convertProcessDefinitionToRequirements(processDefinition, dataItemSpecification)
    ).toThrow(/顧客信用スコア/);
  });
});