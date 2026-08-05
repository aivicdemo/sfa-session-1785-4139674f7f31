import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeProposalAndCustomerInteraction } from '../../src/logic/it-1-br-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('提案実行と顧客対応記録の入力によるAIエージェント分析開始', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  test('SCEN-665: 提案実行入力完了後にAIエージェント分析が開始され分析ジョブが処理中ステータスで登録される', async () => {
    // Arrange
    const proposalExecutionInput = {
      proposalId: 'PROP-2024-001',
      executionDateTime: '2024-01-15T10:30:00Z',
      proposalContent: '顧客の営業課題解決に向けた商品提案',
      proposalAmount: 500000,
      targetCustomerId: 'CUST-2024-0001',
    };

    const customerInteractionInput = {
      customerId: 'CUST-2024-0001',
      interactionDateTime: '2024-01-15T10:30:00Z',
      interactionContent: '提案内容について積極的な反応あり、次回フォローアップ予定',
      interactionType: 'PROPOSAL_PRESENTATION',
      salesRepresentativeId: 'SALES-001',
    };

    const mockAnalysisJobResponse = {
      analysisJobId: 'ANALYSIS-JOB-20240115-001',
      status: 'PROCESSING',
      createdAt: '2024-01-15T10:31:00Z',
      proposalId: 'PROP-2024-001',
      customerId: 'CUST-2024-0001',
    };

    const mockProposalAnalysisResponse = {
      deviationScore: 15,
      successPatternAlignment: 0.82,
      riskFactors: [],
      analysisTimestamp: '2024-01-15T10:31:05Z',
    };

    const mockCustomerInteractionAnalysisResponse = {
      successPatternMatch: true,
      interactionQualityScore: 0.88,
      anomaliesDetected: false,
      analysisTimestamp: '2024-01-15T10:31:10Z',
    };

    // Mock AI agent calls
    fetchMock.mockResponseOnce(
      JSON.stringify(mockAnalysisJobResponse),
      { status: 200 }
    );

    fetchMock.mockResponseOnce(
      JSON.stringify(mockProposalAnalysisResponse),
      { status: 200 }
    );

    fetchMock.mockResponseOnce(
      JSON.stringify(mockCustomerInteractionAnalysisResponse),
      { status: 200 }
    );

    // Act
    const result = await analyzeProposalAndCustomerInteraction(
      proposalExecutionInput,
      customerInteractionInput
    );

    // Assert
    expect(result).toEqual({
      analysisJobId: 'ANALYSIS-JOB-20240115-001',
      status: 'PROCESSING',
      createdAt: '2024-01-15T10:31:00Z',
      proposalId: 'PROP-2024-001',
      customerId: 'CUST-2024-0001',
      proposalAnalysis: {
        deviationScore: 15,
        successPatternAlignment: 0.82,
        riskFactors: [],
        analysisTimestamp: '2024-01-15T10:31:05Z',
      },
      customerInteractionAnalysis: {
        successPatternMatch: true,
        interactionQualityScore: 0.88,
        anomaliesDetected: false,
        analysisTimestamp: '2024-01-15T10:31:10Z',
      },
    });

    // Verify AI agent was called 3 times (create job, analyze proposal, analyze interaction)
    expect(fetchMock.mock.calls.length).toBe(3);

    // Verify first call created analysis job with correct payload
    expect(fetchMock.mock.calls[0][0]).toContain('/analysis-jobs');
    const firstCallBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(firstCallBody.proposalId).toBe('PROP-2024-001');
    expect(firstCallBody.customerId).toBe('CUST-2024-0001');
    expect(firstCallBody.executionDateTime).toBe('2024-01-15T10:30:00Z');

    // Verify second call analyzed proposal content
    expect(fetchMock.mock.calls[1][0]).toContain('/analyze-proposal');
    const secondCallBody = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(secondCallBody.proposalContent).toBe('顧客の営業課題解決に向けた商品提案');
    expect(secondCallBody.proposalAmount).toBe(500000);

    // Verify third call analyzed customer interaction
    expect(fetchMock.mock.calls[2][0]).toContain('/analyze-interaction');
    const thirdCallBody = JSON.parse(fetchMock.mock.calls[2][1].body);
    expect(thirdCallBody.interactionContent).toBe('提案内容について積極的な反応あり、次回フォローアップ予定');
    expect(thirdCallBody.interactionType).toBe('PROPOSAL_PRESENTATION');

    // Verify analysis job status is PROCESSING (not COMPLETED or FAILED)
    expect(result.status).toBe('PROCESSING');

    // Verify analysis job has been created with all necessary fields
    expect(result.analysisJobId).toBeDefined();
    expect(result.analysisJobId).toMatch(/^ANALYSIS-JOB-/);
    expect(result.createdAt).toBe('2024-01-15T10:31:00Z');
  });
});