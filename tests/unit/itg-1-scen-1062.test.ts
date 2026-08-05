import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  // SCEN-1062
  test('同じ営業プロセス標準書と成約実績で2回実行した場合、同じ分析対象指標リストが返される', () => {
    const processDefinition = {
      processId: 'proc_2024_v1',
      processName: '2024年度標準プロセスver1',
      stages: [
        {
          stageId: 'stage_initial',
          stageName: '初回接触',
          order: 1,
          criteria: {
            minContactCount: 1,
            targetDaysToComplete: 3,
          },
        },
        {
          stageId: 'stage_proposal',
          stageName: '提案',
          order: 2,
          criteria: {
            minProposalCount: 1,
            targetDaysToComplete: 7,
          },
        },
        {
          stageId: 'stage_negotiation',
          stageName: '交渉',
          order: 3,
          criteria: {
            minNegotiationCount: 1,
            targetDaysToComplete: 14,
          },
        },
        {
          stageId: 'stage_contract',
          stageName: '成約',
          order: 4,
          criteria: {
            minContractCount: 1,
            targetDaysToComplete: 21,
          },
        },
      ],
      kpiBaseline: {
        targetContractRate: 0.25,
        targetProposalSuccessRate: 0.6,
        targetFollowupSuccessRate: 0.5,
      },
    };

    const contractResults = {
      periodStart: '2024-01-01',
      periodEnd: '2024-03-31',
      totalContracts: 120,
      contracts: [
        {
          contractId: 'contract_001',
          salesPersonId: 'sp_001',
          initialContactDate: '2024-01-05',
          proposalDate: '2024-01-12',
          negotiationStartDate: '2024-01-19',
          contractDate: '2024-02-02',
          daysToContract: 28,
          initialContactToProposalDays: 7,
          proposalToNegotiationDays: 7,
          negotiationToContractDays: 14,
          proposalCount: 2,
          followupCount: 3,
          customerId: 'cust_001',
          contractAmount: 500000,
          isSuccessful: true,
        },
        {
          contractId: 'contract_002',
          salesPersonId: 'sp_002',
          initialContactDate: '2024-01-10',
          proposalDate: '2024-01-20',
          negotiationStartDate: '2024-01-27',
          contractDate: '2024-02-10',
          daysToContract: 31,
          initialContactToProposalDays: 10,
          proposalToNegotiationDays: 7,
          negotiationToContractDays: 14,
          proposalCount: 1,
          followupCount: 2,
          customerId: 'cust_002',
          contractAmount: 300000,
          isSuccessful: true,
        },
        {
          contractId: 'contract_003',
          salesPersonId: 'sp_001',
          initialContactDate: '2024-02-01',
          proposalDate: '2024-02-08',
          negotiationStartDate: '2024-02-15',
          contractDate: '2024-03-01',
          daysToContract: 29,
          initialContactToProposalDays: 7,
          proposalToNegotiationDays: 7,
          negotiationToContractDays: 15,
          proposalCount: 2,
          followupCount: 3,
          customerId: 'cust_003',
          contractAmount: 450000,
          isSuccessful: true,
        },
      ],
    };

    // 1回目実行
    const firstExecutionResult = selectAnalysisIndicators({
      processDefinition,
      contractResults,
    });

    // 2回目実行
    const secondExecutionResult = selectAnalysisIndicators({
      processDefinition,
      contractResults,
    });

    // 分析対象指標リストが完全に一致することを検証
    expect(firstExecutionResult.indicatorList).toEqual(secondExecutionResult.indicatorList);
    expect(firstExecutionResult.indicatorList.length).toBe(firstExecutionResult.indicatorList.length);

    // 指標の内容を詳細に検証
    expect(firstExecutionResult.indicatorList).toEqual([
      {
        indicatorId: 'ind_initial_contact_rate',
        indicatorName: '初回接触率',
        description: '営業担当者が潜在顧客に対して初回接触を実施した割合',
        formula: 'successful_initial_contacts / total_opportunities',
        expectedValue: 0.95,
        correlationWithContractRate: 0.78,
        priority: 1,
      },
      {
        indicatorId: 'ind_proposal_avg_days',
        indicatorName: '提案平均日数',
        description: '初回接触から提案実施までの平均日数',
        formula: 'avg(proposal_date - initial_contact_date)',
        expectedValue: 8,
        correlationWithContractRate: 0.65,
        priority: 2,
      },
      {
        indicatorId: 'ind_deal_rate',
        indicatorName: '商談化率',
        description: '提案実施後に商談に進んだ案件の割合',
        formula: 'successful_negotiations / total_proposals',
        expectedValue: 0.72,
        correlationWithContractRate: 0.82,
        priority: 3,
      },
      {
        indicatorId: 'ind_negotiation_avg_days',
        indicatorName: '交渉期間平均日数',
        description: '提案から成約までの平均交渉期間',
        formula: 'avg(contract_date - proposal_date)',
        expectedValue: 21,
        correlationWithContractRate: 0.58,
        priority: 4,
      },
      {
        indicatorId: 'ind_followup_success_rate',
        indicatorName: 'フォローアップ成功率',
        description: 'フォローアップ実施後に顧客反応があった割合',
        formula: 'positive_responses / total_followups',
        expectedValue: 0.68,
        correlationWithContractRate: 0.71,
        priority: 5,
      },
    ]);

    // 指標の並び順が同じことを検証
    expect(firstExecutionResult.indicatorList.map((ind) => ind.indicatorId)).toEqual(
      secondExecutionResult.indicatorList.map((ind) => ind.indicatorId),
    );

    // パラメータ設定値が同じことを検証
    expect(firstExecutionResult.indicatorList[0].expectedValue).toBe(
      secondExecutionResult.indicatorList[0].expectedValue,
    );
    expect(firstExecutionResult.indicatorList[1].expectedValue).toBe(
      secondExecutionResult.indicatorList[1].expectedValue,
    );
    expect(firstExecutionResult.indicatorList[2].expectedValue).toBe(
      secondExecutionResult.indicatorList[2].expectedValue,
    );
    expect(firstExecutionResult.indicatorList[3].expectedValue).toBe(
      secondExecutionResult.indicatorList[3].expectedValue,
    );
    expect(firstExecutionResult.indicatorList[4].expectedValue).toBe(
      secondExecutionResult.indicatorList[4].expectedValue,
    );

    // 実行メタデータも同じであることを検証
    expect(firstExecutionResult.executionMetadata.processDefinitionId).toBe(
      secondExecutionResult.executionMetadata.processDefinitionId,
    );
    expect(firstExecutionResult.executionMetadata.contractResultsPeriodStart).toBe(
      secondExecutionResult.executionMetadata.contractResultsPeriodStart,
    );
    expect(firstExecutionResult.executionMetadata.contractResultsPeriodEnd).toBe(
      secondExecutionResult.executionMetadata.contractResultsPeriodEnd,
    );
  });
});