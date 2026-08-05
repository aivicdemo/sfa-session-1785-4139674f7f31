import { convertProcessStandardToRequirement } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-198: [edge] 営業プロセス標準書のシステム要件変換機能 - 判定基準の精度がちょうど許容範囲の下限値（例：±5%）のとき、要件として受け入れられる
  test('SCEN-198: 判定基準の精度が±5.0%（許容範囲の下限値）のとき、要件の受け入れ可否が「受け入れ可」でステータスが「システム要件として確定」に遷移する', () => {
    const processStandardData = {
      processId: 'PROC-20240115-001',
      processName: '初回接触プロセス',
      stage: '初回接触',
      judgmentCriteria: {
        judgmentCriteriaId: 'JC-001',
        criteriaName: '顧客接触頻度',
        criteriaType: 'contact_frequency',
        targetValue: 1,
        targetUnit: 'times_per_week',
        tolerance: 5.0,
        precision: -5.0,
      },
      dataItems: [
        {
          dataItemId: 'DI-001',
          dataItemName: '初回接触日時',
          dataType: 'datetime',
          required: true,
        },
        {
          dataItemId: 'DI-002',
          dataItemName: '接触方法',
          dataType: 'string',
          required: true,
        },
      ],
      processTransitionRules: [
        {
          ruleId: 'TR-001',
          fromStage: '初回接触',
          toStage: '提案',
          condition: 'contact_completed',
        },
      ],
      approvalStatus: 'pending_conversion',
    };

    const result = convertProcessStandardToRequirement(processStandardData);

    expect(result).toEqual({
      requirementId: expect.any(String),
      processId: 'PROC-20240115-001',
      processName: '初回接触プロセス',
      stage: '初回接触',
      systemRequirements: [
        {
          requirementId: expect.any(String),
          requirementName: '顧客接触頻度の監視要件',
          requirementType: 'monitoring',
          targetValue: 1,
          targetUnit: 'times_per_week',
          tolerance: 5.0,
          precision: -5.0,
          acceptanceFlag: true,
          status: 'confirmed_as_system_requirement',
          dataElements: [
            {
              dataElementId: expect.any(String),
              dataElementName: '初回接触日時',
              dataElementType: 'datetime',
              mandatory: true,
            },
            {
              dataElementId: expect.any(String),
              dataElementName: '接触方法',
              dataElementType: 'string',
              mandatory: true,
            },
          ],
        },
      ],
      processTransitionRules: [
        {
          ruleId: 'TR-001',
          fromStage: '初回接触',
          toStage: '提案',
          condition: 'contact_completed',
        },
      ],
      conversionTimestamp: expect.any(String),
      conversionStatus: 'completed',
    });

    expect(result.systemRequirements[0].acceptanceFlag).toBe(true);
    expect(result.systemRequirements[0].status).toBe('confirmed_as_system_requirement');
    expect(result.systemRequirements[0].precision).toBe(-5.0);
  });
});