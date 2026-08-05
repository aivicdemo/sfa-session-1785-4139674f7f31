import { runTx10Imp1Agent } from '../../src/logic/it-1';

// Mock AI client
interface Tx10Imp1AiClient {
  validateRequiredFields(input: unknown): Promise<{ status: string; message: string }>;
  checkDuplicateAndContradiction(input: unknown): Promise<{ status: string; message: string }>;
  judgeSuccessPatternFitness(input: unknown): Promise<{ fitnessScore: number; message: string }>;
  detectInappropriatePatterns(input: unknown): Promise<{ detected: boolean; message: string }>;
  scoreDataQuality(input: unknown): Promise<{ score: number; message: string }>;
  judgeAlertGeneration(input: unknown): Promise<{ shouldGenerate: boolean; message: string }>;
}

interface SalesDataInput {
  id: string;
  customerName: string;
  proposalContent: string;
  amount: number;
  deadline: string;
  executionTimestamp: string;
}

interface Tx10Imp1AgentOutput {
  status: string;
  dataQualityScore: number;
  alertGenerated: boolean;
  humanReviewRequired: boolean;
  processingTimeMs: number;
  auditId: string;
  stepResults: Record<string, unknown>;
}

describe('営業プロセス実行状況の監査ダッシュボード - AIエージェント自律実行テスト', () => {
  // SCEN-1275
  test('正常な営業データを受け取り、全6ステップを人の確認なく自律実行完了する', async () => {
    const salesDataInput: SalesDataInput = {
      id: 'DATA_001',
      customerName: 'テスト顧客A',
      proposalContent: '標準的な提案パターン_初回接触フォロー',
      amount: 500000,
      deadline: '2024-02-15',
      executionTimestamp: '2024-01-15T10:30:00Z',
    };

    const mockAiClient: Tx10Imp1AiClient = {
      validateRequiredFields: jest.fn().mockResolvedValue({
        status: '必須項目完全性: 合格',
        message: 'すべての必須項目が入力されています',
      }),
      checkDuplicateAndContradiction: jest.fn().mockResolvedValue({
        status: '重複・矛盾チェック: 問題なし',
        message: '既存顧客データとの矛盾は検出されません',
      }),
      judgeSuccessPatternFitness: jest.fn().mockResolvedValue({
        fitnessScore: 85,
        message: '成功パターンとの適合度: 85%',
      }),
      detectInappropriatePatterns: jest.fn().mockResolvedValue({
        detected: false,
        message: '不適切パターン: 検出なし',
      }),
      scoreDataQuality: jest.fn().mockResolvedValue({
        score: 92,
        message: 'データ品質スコア: 92点',
      }),
      judgeAlertGeneration: jest.fn().mockResolvedValue({
        shouldGenerate: false,
        message: 'アラート生成: 不要（正常案件）',
      }),
    };

    const result: Tx10Imp1AgentOutput = await runTx10Imp1Agent(
      salesDataInput,
      mockAiClient,
    );

    expect(result.status).toBe('COMPLETED');
    expect(result.dataQualityScore).toBe(92);
    expect(result.alertGenerated).toBe(false);
    expect(result.humanReviewRequired).toBe(false);
    expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
    expect(result.auditId).toMatch(/^AUDIT_[0-9A-F]{32}$/);

    expect(mockAiClient.validateRequiredFields).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: 'テスト顧客A',
        proposalContent: '標準的な提案パターン_初回接触フォロー',
        amount: 500000,
        deadline: '2024-02-15',
      }),
    );

    expect(mockAiClient.checkDuplicateAndContradiction).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: 'テスト顧客A',
      }),
    );

    expect(mockAiClient.judgeSuccessPatternFitness).toHaveBeenCalledWith(
      expect.objectContaining({
        proposalContent: '標準的な提案パターン_初回接触フォロー',
      }),
    );

    expect(mockAiClient.detectInappropriatePatterns).toHaveBeenCalledWith(
      expect.any(Object),
    );

    expect(mockAiClient.scoreDataQuality).toHaveBeenCalledWith(
      expect.any(Object),
    );

    expect(mockAiClient.judgeAlertGeneration).toHaveBeenCalledWith(
      expect.objectContaining({
        dataQualityScore: 92,
        fitnessScore: 85,
        inappropriatePatternDetected: false,
      }),
    );

    expect(result.stepResults).toEqual(
      expect.objectContaining({
        step1_validateRequiredFields: {
          status: '必須項目完全性: 合格',
          message: 'すべての必須項目が入力されています',
        },
        step2_checkDuplicateAndContradiction: {
          status: '重複・矛盾チェック: 問題なし',
          message: '既存顧客データとの矛盾は検出されません',
        },
        step3_judgeSuccessPatternFitness: {
          fitnessScore: 85,
          message: '成功パターンとの適合度: 85%',
        },
        step4_detectInappropriatePatterns: {
          detected: false,
          message: '不適切パターン: 検出なし',
        },
        step5_scoreDataQuality: {
          score: 92,
          message: 'データ品質スコア: 92点',
        },
        step6_judgeAlertGeneration: {
          shouldGenerate: false,
          message: 'アラート生成: 不要（正常案件）',
        },
      }),
    );

    expect(result.stepResults.auditLogRecorded).toBe(true);
  });
});