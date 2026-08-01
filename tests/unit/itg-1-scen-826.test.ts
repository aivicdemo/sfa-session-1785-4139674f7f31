import { analyzeSellingProcessCompliancePattern } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-826
  test('営業プロセス定義のステップ順序情報が不正または欠落している場合、エラーを発生させる', () => {
    const processDefinitionWithNullStepOrder = {
      processDefinitionId: 'PD-001',
      processName: '標準営業プロセス',
      stepOrder: null,
      steps: [
        {
          stepId: 'STEP-001',
          stepName: '初回接触',
          sequenceNumber: 1,
        },
        {
          stepId: 'STEP-002',
          stepName: '提案',
          sequenceNumber: 2,
        },
      ],
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z'),
    };

    const analysisInput = {
      salesRepId: 'REP-001',
      periodStartDate: new Date('2024-01-01T00:00:00Z'),
      periodEndDate: new Date('2024-01-31T23:59:59Z'),
      processDefinition: processDefinitionWithNullStepOrder,
      activityRecords: [],
    };

    expect(() => analyzeSellingProcessCompliancePattern(analysisInput)).toThrow(
      /INVALID_STEP_ORDER/
    );

    try {
      analyzeSellingProcessCompliancePattern(analysisInput);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && 'level' in error) {
        const typedError = error as { code: string; message: string; level: string };
        expect(typedError.code).toBe('INVALID_STEP_ORDER');
        expect(typedError.message).toMatch(/営業プロセス定義のステップ順序情報が不正または欠落しています/);
        expect(typedError.level).toBe('ERROR');
      }
    }
  });
});