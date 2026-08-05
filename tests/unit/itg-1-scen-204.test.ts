import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  test('SCEN-204: データ項目の最大件数（1000項目）をちょうど含むプロセス標準書が要件に変換される', () => {
    // Setup: 1000件のデータ項目を持つモックプロセス標準書を作成
    const dataItems = Array.from({ length: 1000 }, (_, index) => ({
      itemId: `ITEM_${String(index + 1).padStart(4, '0')}`,
      itemName: `データ項目${index + 1}`,
      dataType: index % 3 === 0 ? 'string' : index % 3 === 1 ? 'number' : 'boolean',
      isRequired: index % 2 === 0,
      remarks: `備考${index + 1}`,
    }));

    const mockProcessStandard = {
      processId: 'PROC_001',
      processName: '営業プロセス標準書',
      version: '1.0.0',
      createdDate: '2024-01-15T10:00:00Z',
      approvedDate: '2024-01-15T11:00:00Z',
      processStages: [
        {
          stageId: 'STAGE_001',
          stageName: 'リード獲得',
          sequenceNumber: 1,
        },
        {
          stageId: 'STAGE_002',
          stageName: '初回接触',
          sequenceNumber: 2,
        },
      ],
      dataItems: dataItems,
      decisionCriteria: [
        {
          criteriaId: 'CRIT_001',
          criteriaName: '顧客属性確認',
          threshold: 80,
        },
      ],
    };

    // Execute: 要件変換機能を実行
    const systemRequirements = convertProcessStandardToSystemRequirements(mockProcessStandard);

    // Verify: 変換結果の総件数を検証
    expect(systemRequirements.dataItems.length).toBe(1000);

    // Verify: 各データ項目の属性が完全にマッピングされているか確認
    dataItems.forEach((originalItem, index) => {
      const convertedItem = systemRequirements.dataItems[index];

      expect(convertedItem.itemId).toBe(originalItem.itemId);
      expect(convertedItem.itemName).toBe(originalItem.itemName);
      expect(convertedItem.dataType).toBe(originalItem.dataType);
      expect(convertedItem.isRequired).toBe(originalItem.isRequired);
      expect(convertedItem.remarks).toBe(originalItem.remarks);
    });

    // Verify: 変換結果のメタデータが正しく保持されている
    expect(systemRequirements.processId).toBe('PROC_001');
    expect(systemRequirements.processName).toBe('営業プロセス標準書');
    expect(systemRequirements.version).toBe('1.0.0');
    expect(systemRequirements.createdDate).toBe('2024-01-15T10:00:00Z');

    // Verify: プロセスステージが正しくマッピングされている
    expect(systemRequirements.processStages.length).toBe(2);
    expect(systemRequirements.processStages[0].stageId).toBe('STAGE_001');
    expect(systemRequirements.processStages[0].stageName).toBe('リード獲得');
    expect(systemRequirements.processStages[1].stageId).toBe('STAGE_002');
    expect(systemRequirements.processStages[1].stageName).toBe('初回接触');

    // Verify: 判定基準が正しくマッピングされている
    expect(systemRequirements.decisionCriteria.length).toBe(1);
    expect(systemRequirements.decisionCriteria[0].criteriaId).toBe('CRIT_001');
    expect(systemRequirements.decisionCriteria[0].criteriaName).toBe('顧客属性確認');
    expect(systemRequirements.decisionCriteria[0].threshold).toBe(80);

    // Verify: データの欠落・重複・破損がないことを確認
    const uniqueItemIds = new Set(systemRequirements.dataItems.map(item => item.itemId));
    expect(uniqueItemIds.size).toBe(1000);

    // 最初の項目と最後の項目の属性を追加検証
    expect(systemRequirements.dataItems[0].itemName).toBe('データ項目1');
    expect(systemRequirements.dataItems[999].itemName).toBe('データ項目1000');
    expect(systemRequirements.dataItems[999].itemId).toBe('ITEM_1000');
  });
});