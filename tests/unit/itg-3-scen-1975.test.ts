import { extractApprovedProposalData } from '../../src/logic/it-1-br-3-3-2-1';

describe('経営層向け説得資料の自動生成 - 提案データ抽出', () => {
  // SCEN-1975
  test('照合評価完了済み提案データが正確に抽出され、資料生成入力スキーマに適合する', () => {
    // テスト用の照合評価完了済み提案データを事前登録
    const proposalId_1 = 'PROP-2024-001';
    const proposalId_2 = 'PROP-2024-002';
    const proposalId_3 = 'PROP-2024-003';

    const approvedProposal_1 = {
      proposalId: proposalId_1,
      status: 'EVALUATION_COMPLETED',
      customerInfo: {
        companyName: '株式会社テクノロジー',
        industry: 'IT',
        annualRevenue: 5000000000,
      },
      proposalContent: {
        challenge: '既存システムの保守負荷が高い',
        solution: 'クラウド基盤へのシステム移行',
        expectedEffect: '保守コスト40%削減、レスポンス時間50%短縮',
      },
      evaluationScore: 85,
      approvalTimestamp: '2024-01-15T10:30:00Z',
    };

    const approvedProposal_2 = {
      proposalId: proposalId_2,
      status: 'EVALUATION_COMPLETED',
      customerInfo: {
        companyName: '製造業株式会社',
        industry: '製造',
        annualRevenue: 8000000000,
      },
      proposalContent: {
        challenge: '生産効率の可視化ができていない',
        solution: 'IoTセンサとAI分析の導入',
        expectedEffect: '生産効率15%向上、歩留まり率3%改善',
      },
      evaluationScore: 92,
      approvalTimestamp: '2024-01-14T14:45:00Z',
    };

    const unapprovedProposal = {
      proposalId: proposalId_3,
      status: 'DRAFT',
      customerInfo: {
        companyName: '開発中提案企業',
        industry: 'サービス',
        annualRevenue: 3000000000,
      },
      proposalContent: {
        challenge: '未定',
        solution: '未定',
        expectedEffect: '未定',
      },
      evaluationScore: null,
      approvalTimestamp: null,
    };

    // モック用のデータベース（実装では実際のDBから取得）
    const mockDatabase = [approvedProposal_1, approvedProposal_2, unapprovedProposal];

    // 提案データ抽出関数を呼び出し - proposalId_1を抽出
    const extractedData = extractApprovedProposalData(proposalId_1);

    // 必須フィールドがすべて存在することを確認
    expect(extractedData).toHaveProperty('proposalId');
    expect(extractedData).toHaveProperty('customerInfo');
    expect(extractedData).toHaveProperty('proposalContent');
    expect(extractedData).toHaveProperty('evaluationScore');
    expect(extractedData).toHaveProperty('approvalTimestamp');

    // 抽出されたデータが正確に一致することを検証
    expect(extractedData.proposalId).toBe(proposalId_1);
    expect(extractedData.customerInfo.companyName).toBe('株式会社テクノロジー');
    expect(extractedData.customerInfo.industry).toBe('IT');
    expect(extractedData.customerInfo.annualRevenue).toBe(5000000000);
    expect(extractedData.proposalContent.challenge).toBe('既存システムの保守負荷が高い');
    expect(extractedData.proposalContent.solution).toBe('クラウド基盤へのシステム移行');
    expect(extractedData.proposalContent.expectedEffect).toBe('保守コスト40%削減、レスポンス時間50%短縮');

    // 数値フィールド(evaluationScore: 0～100)の正当性を検証
    expect(extractedData.evaluationScore).toBe(85);
    expect(typeof extractedData.evaluationScore).toBe('number');
    expect(extractedData.evaluationScore).toBeGreaterThanOrEqual(0);
    expect(extractedData.evaluationScore).toBeLessThanOrEqual(100);

    // 日時フィールド(ISO 8601形式)の正当性を検証
    expect(extractedData.approvalTimestamp).toBe('2024-01-15T10:30:00Z');
    expect(typeof extractedData.approvalTimestamp).toBe('string');
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(extractedData.approvalTimestamp)).toBe(true);

    // テキストフィールドがnull値を含まないことを検証
    expect(extractedData.customerInfo.companyName).not.toBeNull();
    expect(extractedData.customerInfo.industry).not.toBeNull();
    expect(extractedData.proposalContent.challenge).not.toBeNull();
    expect(extractedData.proposalContent.solution).not.toBeNull();
    expect(extractedData.proposalContent.expectedEffect).not.toBeNull();

    // 別の照合評価完了済み提案データ(proposalId_2)が正確に抽出されることを検証
    const extractedData_2 = extractApprovedProposalData(proposalId_2);
    expect(extractedData_2.proposalId).toBe(proposalId_2);
    expect(extractedData_2.customerInfo.companyName).toBe('製造業株式会社');
    expect(extractedData_2.evaluationScore).toBe(92);
    expect(extractedData_2.approvalTimestamp).toBe('2024-01-14T14:45:00Z');

    // 他のステータス提案(DRAFT)が混在しないことを検証
    // - unapprovedProposalをextractするとエラーになるか、またはnullが返るべき
    // 実装によっては例外をスロー、またはnullを返す
    // ここでは実装に合わせて検証（実装仕様に従う）
    expect(() => extractApprovedProposalData(proposalId_3)).toThrow(/EVALUATION_COMPLETED/);
  });
});