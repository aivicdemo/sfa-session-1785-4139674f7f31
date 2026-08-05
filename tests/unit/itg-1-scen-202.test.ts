import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能 - 判定基準精度検証', () => {
  // SCEN-202
  test('判定基準の精度が許容範囲上限値を超過（+5.1%）したとき、要件変換が却下される', () => {
    const processStandardBook = {
      id: 'proc_std_001',
      name: '営業プロセス標準書 - A部門',
      version: '1.0',
      status: 'draft',
      stages: [
        {
          stageId: 'stage_01',
          stageName: '初回接触',
          criteria: {
            criteriaId: 'crit_001',
            criteriaName: '顧客基本情報の取得',
            accuracy: 5.1,
            threshold: 85.0,
            description: '顧客企業規模・業種・経営課題を把握する'
          }
        }
      ],
      createdAt: new Date('2024-01-15T09:00:00Z').toISOString(),
      createdBy: 'user_001'
    };

    const result = convertProcessStandardToSystemRequirements(processStandardBook);

    expect(result.status).toBe('rejected');
    expect(result.rejectionReasons).toContain('判定基準の精度が許容範囲上限値を超過しています（+5.1% > +5.0%）');
    expect(result.requirementsGenerated).toBe(false);
    expect(result.systemRequirements).toBeNull();
  });
});