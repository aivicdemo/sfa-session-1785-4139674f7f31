import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-107
  test('プロセス標準書が未承認状態の場合、システム要件変換処理がエラーになる', async () => {
    const processStandardId = 'PS-001';
    const processStandardData = {
      id: processStandardId,
      name: '営業プロセス標準書_2024',
      status: 'draft',
      stages: [
        {
          stageName: '初回接触',
          description: '顧客との最初の接点を確立する',
          duration_days: 3
        },
        {
          stageName: '提案',
          description: '顧客ニーズに基づいた提案を実施',
          duration_days: 7
        },
        {
          stageName: '交渉',
          description: '条件調整と合意形成',
          duration_days: 5
        },
        {
          stageName: '成約',
          description: '契約締結',
          duration_days: 2
        }
      ],
      kpiCriteria: {
        minInitialContactFrequency: 2,
        targetProposalSuccessRate: 0.6,
        targetFollowupInterval: 3
      },
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-10T09:00:00Z'
    };

    await expect(
      convertProcessStandardToSystemRequirements(processStandardData)
    ).rejects.toThrow(/承認待ち/);
  });
});