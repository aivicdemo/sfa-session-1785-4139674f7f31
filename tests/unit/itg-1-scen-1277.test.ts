import { runTx10Imp1Agent } from '../../src/logic/it-1';

jest.mock('../../src/logic/it-1/ai-client');

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1277
  test('[normal] 営業データ入力から問題検出・通知までの自律実行 AIエージェント - 入力データと既存顧客データの重複・矛盾をチェックする', async () => {
    const mockAiClient = {
      checkDuplicateAndContradiction: jest.fn(),
      validateDataQuality: jest.fn(),
      analyzeProposalContent: jest.fn(),
      detectInappropriatePattern: jest.fn(),
      generateAlert: jest.fn(),
    };

    const inputData = {
      customerId: 'CUST-001',
      proposalAmount: 1000000,
      proposalType: '新規導入',
      salesRepId: 'SALES-042',
      timestamp: '2024-06-15T10:30:00Z',
    };

    const existingCustomerData = {
      customerId: 'CUST-001',
      customerName: '株式会社ABC',
      industry: '製造',
      lastProposalDate: '2024-01-15',
    };

    const checkDuplicateResult = {
      hasDuplicate: false,
      hasContradiction: false,
      details: '顧客ID一致、業種・提案種別に矛盾なし',
      confidenceScore: 0.98,
    };

    mockAiClient.checkDuplicateAndContradiction.mockResolvedValue(
      checkDuplicateResult
    );

    mockAiClient.validateDataQuality.mockResolvedValue({
      qualityScore: 0.96,
      missingFields: [],
    });

    mockAiClient.analyzeProposalContent.mockResolvedValue({
      successPatternMatch: 0.85,
      riskFactors: [],
    });

    mockAiClient.detectInappropriatePattern.mockResolvedValue({
      isInappropriate: false,
      riskScore: 0.12,
    });

    mockAiClient.generateAlert.mockResolvedValue({
      alertId: 'ALERT-20240615-001',
      status: 'generated',
    });

    const executionLog: Array<{ message: string; timestamp: string }> = [];

    const result = await runTx10Imp1Agent(
      inputData,
      existingCustomerData,
      mockAiClient,
      executionLog
    );

    expect(mockAiClient.checkDuplicateAndContradiction).toHaveBeenCalledWith(
      inputData,
      existingCustomerData
    );

    expect(mockAiClient.checkDuplicateAndContradiction).toHaveBeenCalledTimes(
      1
    );

    const checkMessage = executionLog.find((log) =>
      log.message.includes('重複・矛盾チェック完了')
    );
    expect(checkMessage).toBeDefined();
    expect(checkMessage?.message).toMatch(/重複なし/);
    expect(checkMessage?.message).toMatch(/矛盾なし/);

    expect(result).toEqual({
      success: true,
      checkDuplicateResult: {
        hasDuplicate: false,
        hasContradiction: false,
        details: '顧客ID一致、業種・提案種別に矛盾なし',
        confidenceScore: 0.98,
      },
      dataQualityResult: {
        qualityScore: 0.96,
        missingFields: [],
      },
      proposalAnalysisResult: {
        successPatternMatch: 0.85,
        riskFactors: [],
      },
      inappropriatePatternResult: {
        isInappropriate: false,
        riskScore: 0.12,
      },
      alertResult: {
        alertId: 'ALERT-20240615-001',
        status: 'generated',
      },
    });
  });
});