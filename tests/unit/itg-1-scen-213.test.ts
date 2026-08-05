import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能 - 複数月対応', () => {
  // SCEN-213
  test('変換期間が月をまたぐとき、複数月のプロセス標準書が一貫性を保ちながら変換される', () => {
    const conversionStartDate = new Date('2024-11-01T00:00:00Z');
    const conversionEndDate = new Date('2024-12-31T23:59:59Z');

    const november2024StandardBook = {
      version: '2024-11',
      effectiveFrom: new Date('2024-11-01T00:00:00Z'),
      effectiveTo: new Date('2024-11-30T23:59:59Z'),
      processes: [
        {
          processId: 'P-SALES-001',
          processName: '営業提案プロセス',
          stages: [
            {
              stageId: 'STAGE-001',
              stageName: '初回接触',
              sequenceOrder: 1,
              description: '顧客への初回連絡',
            },
            {
              stageId: 'STAGE-002',
              stageName: '提案',
              sequenceOrder: 2,
              description: '商品提案の実施',
            },
            {
              stageId: 'STAGE-003',
              stageName: '交渉',
              sequenceOrder: 3,
              description: '条件交渉',
            },
          ],
          kpiCriteria: {
            targetConversionRate: 0.35,
            maxFollowupDays: 7,
          },
        },
      ],
    };

    const december2024StandardBook = {
      version: '2024-12',
      effectiveFrom: new Date('2024-12-01T00:00:00Z'),
      effectiveTo: new Date('2024-12-31T23:59:59Z'),
      processes: [
        {
          processId: 'P-SALES-001',
          processName: '営業提案プロセス',
          stages: [
            {
              stageId: 'STAGE-001',
              stageName: '初回接触',
              sequenceOrder: 1,
              description: '顧客への初回連絡',
            },
            {
              stageId: 'STAGE-002',
              stageName: '提案',
              sequenceOrder: 2,
              description: '商品提案の実施（拡張版）',
            },
            {
              stageId: 'STAGE-003',
              stageName: '交渉',
              sequenceOrder: 3,
              description: '条件交渉',
            },
            {
              stageId: 'STAGE-004',
              stageName: '成約',
              sequenceOrder: 4,
              description: '契約締結',
            },
          ],
          kpiCriteria: {
            targetConversionRate: 0.38,
            maxFollowupDays: 5,
          },
        },
      ],
    };

    const result = convertProcessStandardToSystemRequirements(
      [november2024StandardBook, december2024StandardBook],
      conversionStartDate,
      conversionEndDate
    );

    // 変換結果が2つの月別データセットを含むことを確認
    expect(result.monthlyDatasets).toHaveLength(2);

    // 11月データセット検証
    const novemberDataset = result.monthlyDatasets[0];
    expect(novemberDataset.monthVersion).toBe('2024-11');
    expect(novemberDataset.applicableFrom).toEqual(
      new Date('2024-11-01T00:00:00Z')
    );
    expect(novemberDataset.applicableTo).toEqual(
      new Date('2024-11-30T23:59:59Z')
    );

    // 11月のプロセス要素検証
    expect(novemberDataset.processElements).toHaveLength(1);
    const novemberProcess = novemberDataset.processElements[0];
    expect(novemberProcess.processId).toBe('P-SALES-001');
    expect(novemberProcess.systemStages).toHaveLength(3);

    // 11月のステップ順序検証
    expect(novemberProcess.systemStages[0].stageId).toBe('STAGE-001');
    expect(novemberProcess.systemStages[0].sequenceOrder).toBe(1);
    expect(novemberProcess.systemStages[1].stageId).toBe('STAGE-002');
    expect(novemberProcess.systemStages[1].sequenceOrder).toBe(2);
    expect(novemberProcess.systemStages[2].stageId).toBe('STAGE-003');
    expect(novemberProcess.systemStages[2].sequenceOrder).toBe(3);

    // 11月のKPI基準検証
    expect(novemberProcess.systemKpiCriteria.targetConversionRate).toBe(0.35);
    expect(novemberProcess.systemKpiCriteria.maxFollowupDays).toBe(7);

    // 12月データセット検証
    const decemberDataset = result.monthlyDatasets[1];
    expect(decemberDataset.monthVersion).toBe('2024-12');
    expect(decemberDataset.applicableFrom).toEqual(
      new Date('2024-12-01T00:00:00Z')
    );
    expect(decemberDataset.applicableTo).toEqual(
      new Date('2024-12-31T23:59:59Z')
    );

    // 12月のプロセス要素検証
    expect(decemberDataset.processElements).toHaveLength(1);
    const decemberProcess = decemberDataset.processElements[0];
    expect(decemberProcess.processId).toBe('P-SALES-001');
    expect(decemberProcess.systemStages).toHaveLength(4);

    // 12月のステップ順序検証（月をまたいでも同一プロセスIDで一貫性維持）
    expect(decemberProcess.systemStages[0].stageId).toBe('STAGE-001');
    expect(decemberProcess.systemStages[0].sequenceOrder).toBe(1);
    expect(decemberProcess.systemStages[1].stageId).toBe('STAGE-002');
    expect(decemberProcess.systemStages[1].sequenceOrder).toBe(2);
    expect(decemberProcess.systemStages[2].stageId).toBe('STAGE-003');
    expect(decemberProcess.systemStages[2].sequenceOrder).toBe(3);
    expect(decemberProcess.systemStages[3].stageId).toBe('STAGE-004');
    expect(decemberProcess.systemStages[3].sequenceOrder).toBe(4);

    // 12月のKPI基準検証
    expect(decemberProcess.systemKpiCriteria.targetConversionRate).toBe(0.38);
    expect(decemberProcess.systemKpiCriteria.maxFollowupDays).toBe(5);

    // 月をまたぐプロセス要素の依存関係・順序一貫性検証
    const novemberProposalStage = novemberProcess.systemStages.find(
      (s) => s.stageId === 'STAGE-002'
    );
    const decemberProposalStage = decemberProcess.systemStages.find(
      (s) => s.stageId === 'STAGE-002'
    );
    expect(novemberProposalStage.sequenceOrder).toBe(
      decemberProposalStage.sequenceOrder
    );

    // 監査ログ検証
    expect(result.auditLog).toBeDefined();
    expect(result.auditLog.conversionExecutions).toHaveLength(2);

    // 11月変換の監査ログ
    const novemberAuditEntry = result.auditLog.conversionExecutions[0];
    expect(novemberAuditEntry.standardBookVersion).toBe('2024-11');
    expect(novemberAuditEntry.executionTimestamp).toBeDefined();
    expect(
      novemberAuditEntry.executionTimestamp >= conversionStartDate
    ).toBe(true);
    expect(
      novemberAuditEntry.executionTimestamp <=
        new Date('2024-11-30T23:59:59Z')
    ).toBe(true);

    // 12月変換の監査ログ
    const decemberAuditEntry = result.auditLog.conversionExecutions[1];
    expect(decemberAuditEntry.standardBookVersion).toBe('2024-12');
    expect(decemberAuditEntry.executionTimestamp).toBeDefined();
    expect(
      decemberAuditEntry.executionTimestamp >=
        new Date('2024-12-01T00:00:00Z')
    ).toBe(true);
    expect(
      decemberAuditEntry.executionTimestamp <= conversionEndDate
    ).toBe(true);

    // 変換結果の全体的な構造検証
    expect(result.systemRequirementDefinition).toBeDefined();
    expect(result.systemRequirementDefinition.totalProcessCount).toBe(1);
    expect(result.systemRequirementDefinition.totalStageCount).toBe(7); // 11月3段階 + 12月4段階
    expect(result.conversionStatus).toBe('SUCCESS');
  });
});