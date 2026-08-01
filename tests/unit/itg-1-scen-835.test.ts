import { analyzeProcessDeviation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-835
  test('プロセスステップが1件の場合、その1ステップの相関を計算する', () => {
    const processSteps = [
      {
        stepId: 'STEP-001',
        stepName: '初回提案',
        sequenceOrder: 1,
        createdAt: new Date('2024-01-15T09:00:00Z')
      }
    ];

    const salesActivities = [
      {
        activityId: 'ACT-001',
        stepId: 'STEP-001',
        executedAt: new Date('2024-01-15T10:00:00Z'),
        salesPersonId: 'SP-001',
        activityContent: '顧客訪問、初回提案実施'
      },
      {
        activityId: 'ACT-002',
        stepId: 'STEP-001',
        executedAt: new Date('2024-01-15T11:30:00Z'),
        salesPersonId: 'SP-001',
        activityContent: '初回提案フォローアップ電話'
      },
      {
        activityId: 'ACT-003',
        stepId: 'STEP-001',
        executedAt: new Date('2024-01-16T09:15:00Z'),
        salesPersonId: 'SP-002',
        activityContent: '初回提案資料送付'
      },
      {
        activityId: 'ACT-004',
        stepId: 'STEP-001',
        executedAt: new Date('2024-01-16T14:00:00Z'),
        salesPersonId: 'SP-002',
        activityContent: '初回提案説明会'
      },
      {
        activityId: 'ACT-005',
        stepId: 'STEP-001',
        executedAt: new Date('2024-01-17T10:00:00Z'),
        salesPersonId: 'SP-001',
        activityContent: '初回提案フィードバック収集'
      },
      {
        activityId: 'ACT-006',
        stepId: 'STEP-001',
        executedAt: new Date('2024-01-17T15:30:00Z'),
        salesPersonId: 'SP-003',
        activityContent: '初回提案内容修正打ち合わせ'
      },
      {
        activityId: 'ACT-007',
        stepId: 'STEP-001',
        executedAt: new Date('2024-01-18T09:00:00Z'),
        salesPersonId: 'SP-003',
        activityContent: '初回提案修正版提出'
      },
      {
        activityId: 'ACT-008',
        stepId: 'STEP-001',
        executedAt: new Date('2024-01-18T13:00:00Z'),
        salesPersonId: 'SP-002',
        activityContent: '初回提案質疑応答'
      },
      {
        activityId: 'ACT-009',
        stepId: 'STEP-001',
        executedAt: new Date('2024-01-19T10:30:00Z'),
        salesPersonId: 'SP-001',
        activityContent: '初回提案最終確認'
      },
      {
        activityId: 'ACT-010',
        stepId: 'STEP-001',
        executedAt: new Date('2024-01-19T16:00:00Z'),
        salesPersonId: 'SP-003',
        activityContent: '初回提案承認取得'
      }
    ];

    const contractResults = {
      dealId: 'DEAL-001',
      isContracted: true,
      contractAmount: 5000000,
      contractDate: new Date('2024-01-25T17:00:00Z'),
      contractedBy: 'SP-001'
    };

    const analysisResult = analyzeProcessDeviation(
      processSteps,
      salesActivities,
      contractResults,
      'DS-20240115-001'
    );

    expect(analysisResult.stepName).toBe('初回提案');
    expect(analysisResult.sampleCount).toBe(10);
    expect(analysisResult.correlationCoefficient).toBe(0.72);
    expect(analysisResult.datasetId).toBe('DS-20240115-001');
    expect(analysisResult.calculationLogic).toBe('PearsonCorrelation-v1');
    expect(analysisResult.correlationCoefficient).toBeGreaterThanOrEqual(-1.0);
    expect(analysisResult.correlationCoefficient).toBeLessThanOrEqual(1.0);
  });
});