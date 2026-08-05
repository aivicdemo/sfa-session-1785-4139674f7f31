import { describe, it, expect, beforeEach } from '@jest/globals';
import { convertProcessRequirementToSystemRequirement } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-203
  it('[edge] 判定基準の精度が許容範囲上限値未満（例：+4.9%）のとき、要件として受け入れられる', () => {
    // Arrange
    const processRequirement = {
      processId: 'PROC-001',
      processName: '初回接触',
      judgeAccuracy: 4.9, // 許容範囲上限値(5.0%)未満
      judgeAccuracyThreshold: 5.0,
      decisionCriteria: {
        contactFrequencyMin: 1,
        contactFrequencyMax: 10,
        responseRateMin: 30,
      },
      dataItems: [
        {
          itemId: 'ITEM-001',
          itemName: '初回接触日',
          itemType: 'DATE',
        },
        {
          itemId: 'ITEM-002',
          itemName: '接触方法',
          itemType: 'STRING',
        },
      ],
    };

    // Act
    const result = convertProcessRequirementToSystemRequirement(processRequirement);

    // Assert
    expect(result.acceptanceStatus).toBe('ACCEPTED');
    expect(result.conversionStatus).toBe('success');
    expect(result.systemRequirement).toEqual({
      requirementId: expect.any(String),
      processId: 'PROC-001',
      processName: '初回接触',
      judgeAccuracy: 4.9,
      judgeAccuracyThreshold: 5.0,
      acceptanceStatus: 'ACCEPTED',
      decisionCriteria: {
        contactFrequencyMin: 1,
        contactFrequencyMax: 10,
        responseRateMin: 30,
      },
      systemDataItems: [
        {
          itemId: 'ITEM-001',
          itemName: '初回接触日',
          itemType: 'DATE',
          columnName: 'initial_contact_date',
          required: true,
          validation: {
            type: 'DATE',
            format: 'YYYY-MM-DD',
          },
        },
        {
          itemId: 'ITEM-002',
          itemName: '接触方法',
          itemType: 'STRING',
          columnName: 'contact_method',
          required: true,
          validation: {
            type: 'STRING',
            maxLength: 100,
          },
        },
      ],
      conversionTimestamp: expect.any(String),
      convertedBy: 'SYSTEM_AUTO',
    });
    expect(result.systemRequirement.judgeAccuracy).toBeLessThan(
      result.systemRequirement.judgeAccuracyThreshold
    );
  });
});