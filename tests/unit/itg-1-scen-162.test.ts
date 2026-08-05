import { convertProcessStageToSystemRequirement } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-162
  test('営業プロセス標準書のシステム要件変換機能 - 営業プロセス標準書から1個のステージを抽出して、1個のシステム要件に変換される', () => {
    const processBook = {
      id: 'PROC-BOOK-001',
      name: '営業プロセス標準書',
      version: '1.0',
      stages: [
        {
          stageId: 'STAGE-LEAD',
          stageName: 'リード獲得',
          description: 'リード情報を収集し、営業対象の初期選定を行う',
          kpiCriteria: 'リード数',
          dataItems: ['顧客名', '業種', '接触方法'],
        },
        {
          stageId: 'STAGE-PROPOSAL',
          stageName: '提案',
          description: '顧客への提案資料作成・送付・進捗追跡',
          kpiCriteria: '提案数・成功率',
          dataItems: ['提案内容', '提案資料', '顧客反応'],
        },
        {
          stageId: 'STAGE-CLOSE',
          stageName: 'クローズ',
          description: '契約締結と後続業務への引き継ぎ',
          kpiCriteria: '成約数・金額',
          dataItems: ['契約書', '請求書', '納品予定日'],
        },
      ],
    };

    const targetStageName = '提案';

    const result = convertProcessStageToSystemRequirement(
      processBook,
      targetStageName,
    );

    expect(result).toEqual({
      requirementId: 'REQ-PROPOSAL-001',
      requirementName: '営業提案プロセスの実行管理',
      requirementDescription: '顧客への提案資料作成・送付・進捗追跡機能',
      relatedStage: '提案',
      dataItems: ['提案内容', '提案資料', '顧客反応'],
      kpiMetrics: '提案数・成功率',
    });

    expect(Array.isArray(result)).toBe(false);
    expect(result.requirementId).toBe('REQ-PROPOSAL-001');
    expect(result.requirementName).toBe('営業提案プロセスの実行管理');
    expect(result.requirementDescription).toBe(
      '顧客への提案資料作成・送付・進捗追跡機能',
    );
    expect(result.relatedStage).toBe('提案');
  });
});