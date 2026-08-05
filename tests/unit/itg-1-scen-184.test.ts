import { convertProcessStandardToRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-184
  test('プロセス標準書の承認ステータスが null のとき、ステータス未設定エラーが発生する', () => {
    const processStandard = {
      id: 'proc_std_001',
      name: '営業プロセス標準書_2024',
      approvalStatus: null,
      stages: [
        {
          stageId: 'stage_001',
          stageName: '初回接触',
          requiredActions: ['顧客情報確認', '初期提案'],
          successCriteria: '初回ミーティング実施',
        },
        {
          stageId: 'stage_002',
          stageName: '提案',
          requiredActions: ['提案資料作成', '提案実施'],
          successCriteria: '顧客からフィードバック取得',
        },
      ],
      kpiThresholds: {
        targetConversionRate: 0.3,
        targetFollowUpInterval: 3,
      },
      version: 1,
    };

    expect(() => {
      convertProcessStandardToRequirements(processStandard);
    }).toThrow(/ステータス|STATUS_NOT_DEFINED/);
  });
});