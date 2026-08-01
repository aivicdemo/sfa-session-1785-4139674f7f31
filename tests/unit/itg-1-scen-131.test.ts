import { transformProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-131
  test('同じ入力で2回実行した場合、同一の要件仕様が生成される', () => {
    const processStandardInput = {
      processDefinitionId: 'PROC_DEF_v1.0',
      processName: '営業プロセス定義書v1.0',
      processSteps: [
        {
          stepId: 'STEP_001',
          stepName: '初回接触',
          description: '顧客との初回接触を実施',
          sequence: 1,
        },
        {
          stepId: 'STEP_002',
          stepName: '課題ヒアリング',
          description: '顧客の経営課題をヒアリング',
          sequence: 2,
        },
        {
          stepId: 'STEP_003',
          stepName: '提案準備',
          description: '顧客ニーズに基づく提案資料を準備',
          sequence: 3,
        },
        {
          stepId: 'STEP_004',
          stepName: '提案実施',
          description: 'カスタマイズされた提案を実施',
          sequence: 4,
        },
        {
          stepId: 'STEP_005',
          stepName: '成約',
          description: '契約締結と成約実績の記録',
          sequence: 5,
        },
      ],
      constraints: [
        {
          constraintId: 'CONST_001',
          constraintName: '初回接触から提案実施までの期間制限',
          description: '初回接触から提案実施まで30日以内',
        },
        {
          constraintId: 'CONST_002',
          constraintName: '提案資料の品質基準',
          description: '提案資料はテンプレートに従い、顧客ニーズとの適合度80%以上',
        },
        {
          constraintId: 'CONST_003',
          constraintName: 'フォローアップ実施頻度',
          description: '提案後は1週間以内にフォローアップを実施',
        },
      ],
    };

    const response1 = transformProcessStandardToSystemRequirements(processStandardInput);
    const response2 = transformProcessStandardToSystemRequirements(processStandardInput);

    expect(response1).toEqual(response2);

    expect(response1.requirements).toHaveLength(5);
    expect(response2.requirements).toHaveLength(5);

    for (let i = 0; i < 5; i++) {
      const req1 = response1.requirements[i];
      const req2 = response2.requirements[i];

      expect(req1.requirementId).toBe(req2.requirementId);
      expect(req1.requirementType).toBe(req2.requirementType);
      expect(req1.requirementDescription).toBe(req2.requirementDescription);
      expect(req1.priority).toBe(req2.priority);
      expect(req1.constraints).toEqual(req2.constraints);
      expect(req1.implementationModule).toBe(req2.implementationModule);
    }

    expect(response1.requirements[0].requirementId).toBe('REQ_001');
    expect(response1.requirements[0].requirementType).toBe('process_step');
    expect(response1.requirements[0].requirementDescription).toBe('顧客との初回接触を実施');
    expect(response1.requirements[0].priority).toBe(1);
    expect(response1.requirements[0].constraints).toEqual([
      {
        constraintId: 'CONST_001',
        constraintName: '初回接触から提案実施までの期間制限',
      },
    ]);
    expect(response1.requirements[0].implementationModule).toBe('営業プロセス監査・分析管理システム');

    expect(response1.requirements[1].requirementId).toBe('REQ_002');
    expect(response1.requirements[1].requirementType).toBe('process_step');
    expect(response1.requirements[1].requirementDescription).toBe('顧客の経営課題をヒアリング');
    expect(response1.requirements[1].priority).toBe(2);
    expect(response1.requirements[1].constraints).toEqual([
      {
        constraintId: 'CONST_001',
        constraintName: '初回接触から提案実施までの期間制限',
      },
    ]);
    expect(response1.requirements[1].implementationModule).toBe('営業プロセス監査・分析管理システム');

    expect(response1.requirements[2].requirementId).toBe('REQ_003');
    expect(response1.requirements[2].requirementType).toBe('process_step');
    expect(response1.requirements[2].requirementDescription).toBe('顧客ニーズに基づく提案資料を準備');
    expect(response1.requirements[2].priority).toBe(3);
    expect(response1.requirements[2].constraints).toEqual([
      {
        constraintId: 'CONST_001',
        constraintName: '初回接触から提案実施までの期間制限',
      },
      {
        constraintId: 'CONST_002',
        constraintName: '提案資料の品質基準',
      },
    ]);
    expect(response1.requirements[2].implementationModule).toBe('AIエージェント推奨支援システム');

    expect(response1.requirements[3].requirementId).toBe('REQ_004');
    expect(response1.requirements[3].requirementType).toBe('process_step');
    expect(response1.requirements[3].requirementDescription).toBe('カスタマイズされた提案を実施');
    expect(response1.requirements[3].priority).toBe(4);
    expect(response1.requirements[3].constraints).toEqual([
      {
        constraintId: 'CONST_002',
        constraintName: '提案資料の品質基準',
      },
      {
        constraintId: 'CONST_003',
        constraintName: 'フォローアップ実施頻度',
      },
    ]);
    expect(response1.requirements[3].implementationModule).toBe('AIエージェント推奨支援システム');

    expect(response1.requirements[4].requirementId).toBe('REQ_005');
    expect(response1.requirements[4].requirementType).toBe('process_step');
    expect(response1.requirements[4].requirementDescription).toBe('契約締結と成約実績の記録');
    expect(response1.requirements[4].priority).toBe(5);
    expect(response1.requirements[4].constraints).toEqual([
      {
        constraintId: 'CONST_003',
        constraintName: 'フォローアップ実施頻度',
      },
    ]);
    expect(response1.requirements[4].implementationModule).toBe('営業プロセス監査・分析管理システム');
  });
});