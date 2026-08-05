import { convertProcessStandardToSystemRequirement } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-183
  test('プロセス標準書の承認ステータスが「承認待ち」以外のとき、ステータス不正エラーが発生する', () => {
    const invalidStatuses = ['承認済み', '却下', '下書き', 'draft', 'approved'];

    invalidStatuses.forEach((status) => {
      const processStandardBook = {
        id: 'proc_std_001',
        title: '営業プロセス標準書_2024',
        description: '営業プロセスの標準フロー定義',
        approvalStatus: status,
        stages: [
          {
            stageId: 'stage_001',
            stageName: '初回接触',
            description: '顧客への初回接触プロセス',
            kpiCriteria: {
              targetValue: 10,
              unit: '件/月',
            },
          },
        ],
        transitionRules: [
          {
            fromStage: 'stage_001',
            toStage: 'stage_002',
            condition: '提案実施',
          },
        ],
        createdAt: new Date('2024-01-01T09:00:00Z').toISOString(),
        updatedAt: new Date('2024-01-15T11:00:00Z').toISOString(),
      };

      expect(() => convertProcessStandardToSystemRequirement(processStandardBook)).toThrow(
        /ステータス不正/
      );
    });
  });
});