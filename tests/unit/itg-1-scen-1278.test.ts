import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import type { Tx10Imp1AiClient } from '../../src/agents/tx-10-imp-1/types';
import { runTx10Imp1Agent } from '../../src/agents/tx-10-imp-1/orchestrator';

// Mock AI client interface
interface MockTx10Imp1AiClient extends Tx10Imp1AiClient {
  analyzeProposalContent: jest.Mock;
}

// SCEN-1278
describe('営業データ入力から問題検出・通知までの自律実行 - 提案内容分析と成功パターンマッチング', () => {
  let mockAiClient: MockTx10Imp1AiClient;
  let mockDatabase: any;
  let mockLogger: any;

  beforeEach(() => {
    // Initialize mock AI client
    mockAiClient = {
      analyzeProposalContent: jest.fn(),
    } as any;

    // Initialize mock database
    mockDatabase = {
      saveAnalysisResult: jest.fn().mockResolvedValue({ id: 'proposal_001' }),
      getSuccessPatternRules: jest.fn().mockResolvedValue({
        patterns: [
          {
            id: 'pattern_001',
            name: '既存顧客向け提案',
            conditions: {
              customer_type: 'existing',
              min_transaction_years: 3,
              max_contract_amount: 10000000,
              min_contract_amount: 100000,
            },
            threshold_score: 70,
          },
        ],
      }),
      recordLog: jest.fn().mockResolvedValue({ id: 'log_001' }),
    };

    // Initialize mock logger
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute autonomous proposal content analysis and match success pattern correctly', async () => {
    // Setup test data
    const proposalInput = {
      proposal_id: 'proposal_001',
      customer_name: '株式会社A',
      customer_type: 'existing',
      proposal_content: '既存顧客向け追加契約',
      contract_amount: 5000000,
      proposal_rationale: '過去3年の取引実績と同業他社事例',
      transaction_years: 3,
      timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
    };

    const successPatternRules = {
      patterns: [
        {
          id: 'pattern_001',
          name: '既存顧客向け提案',
          conditions: {
            customer_type: 'existing',
            min_transaction_years: 3,
            max_contract_amount: 10000000,
            min_contract_amount: 100000,
          },
          threshold_score: 70,
        },
      ],
    };

    // Setup mock AI client response
    const aiAnalysisResponse = {
      proposal_id: 'proposal_001',
      compatibility_score: 85,
      matching_pattern: 'pattern_001',
      pattern_name: '既存顧客向け提案',
      recommendation: '推奨提案',
      confidence: 0.92,
      analysis_details: {
        customer_type_match: true,
        transaction_years_match: true,
        contract_amount_match: true,
        rationale_strength: 'strong',
      },
    };

    mockAiClient.analyzeProposalContent.mockResolvedValueOnce(aiAnalysisResponse);

    // Setup mock database response
    mockDatabase.getSuccessPatternRules.mockResolvedValueOnce(successPatternRules);

    const analysisResult = {
      proposal_id: 'proposal_001',
      compatibility_score: 85,
      judgment: '推奨提案',
      pattern_id: 'pattern_001',
      completed_at: new Date('2024-01-15T11:05:00Z').toISOString(),
      threshold_met: true,
    };

    mockDatabase.saveAnalysisResult.mockResolvedValueOnce(analysisResult);

    // Execute the agent
    const result = await runTx10Imp1Agent(
      proposalInput,
      mockAiClient,
      mockDatabase,
      mockLogger
    );

    // Verify AI client was called with correct prompt
    expect(mockAiClient.analyzeProposalContent).toHaveBeenCalledTimes(1);
    expect(mockAiClient.analyzeProposalContent).toHaveBeenCalledWith(
      expect.objectContaining({
        proposal_id: 'proposal_001',
        customer_name: '株式会社A',
        proposal_content: '既存顧客向け追加契約',
        contract_amount: 5000000,
        proposal_rationale: '過去3年の取引実績と同業他社事例',
      })
    );

    // Verify success pattern rules were retrieved
    expect(mockDatabase.getSuccessPatternRules).toHaveBeenCalledTimes(1);

    // Verify compatibility score is 85
    expect(result.compatibility_score).toBe(85);

    // Verify threshold is met (85 >= 70)
    expect(result.threshold_met).toBe(true);

    // Verify judgment is correct
    expect(result.judgment).toBe('推奨提案');

    // Verify pattern matching was successful
    expect(result.pattern_id).toBe('pattern_001');

    // Verify analysis result was saved to database
    expect(mockDatabase.saveAnalysisResult).toHaveBeenCalledTimes(1);
    expect(mockDatabase.saveAnalysisResult).toHaveBeenCalledWith(
      expect.objectContaining({
        proposal_id: 'proposal_001',
        compatibility_score: 85,
        judgment: '推奨提案',
        pattern_id: 'pattern_001',
      })
    );

    // Verify log record was created with required fields
    expect(mockDatabase.recordLog).toHaveBeenCalledTimes(1);
    expect(mockDatabase.recordLog).toHaveBeenCalledWith(
      expect.objectContaining({
        proposal_id: 'proposal_001',
        compatibility_score: 85,
        judgment: '推奨提案',
        completed_at: expect.any(String),
      })
    );

    // Verify response status
    expect(result.status).toBe(200);

    // Verify completed_at timestamp is recorded
    expect(result.completed_at).toBe(analysisResult.completed_at);

    // Verify analysis details are included in response
    expect(result).toHaveProperty('proposal_id', 'proposal_001');
    expect(result).toHaveProperty('compatibility_score', 85);
    expect(result).toHaveProperty('judgment', '推奨提案');
  });
});