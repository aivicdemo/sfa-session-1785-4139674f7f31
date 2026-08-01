import { classifyProblem } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-564: 問題分類結果の一貫性検証機能 - 異なる入力で実行した場合、異なる分類結果が返される', () => {
    // データセットAの準備：営業提案資料の遅延報告
    const datasetA = {
      problemDescription: '営業提案資料が顧客への提案期限に間に合わず、提案日程を1週間遅延した。',
      reportedAt: '2024-01-15T10:30:00Z',
      relatedEntityId: 'proposal_001',
      context: {
        entityType: 'proposal',
        status: 'delayed',
        originalDueDate: '2024-01-15T17:00:00Z',
        actualSubmissionDate: '2024-01-22T10:00:00Z'
      }
    };

    // データセットBの準備：顧客対応漏れの報告
    const datasetB = {
      problemDescription: '顧客からの問い合わせメールに対する返信がされず、2日間の対応漏れが発生した。',
      reportedAt: '2024-01-15T11:00:00Z',
      relatedEntityId: 'followup_002',
      context: {
        entityType: 'followup',
        status: 'missed',
        inquiryReceivedAt: '2024-01-13T14:30:00Z',
        missedDurationHours: 48
      }
    };

    // データセットAの分類を実行
    const resultA = classifyProblem(datasetA);

    // データセットBの分類を実行
    const resultB = classifyProblem(datasetB);

    // resultAの検証：DELAY_PROPOSALに分類されること
    expect(resultA.classificationCode).toBe('DELAY_PROPOSAL');
    expect(typeof resultA.confidenceScore).toBe('number');
    expect(resultA.confidenceScore).toBeGreaterThanOrEqual(0.0);
    expect(resultA.confidenceScore).toBeLessThanOrEqual(1.0);

    // resultBの検証：MISSED_FOLLOWUPに分類されること
    expect(resultB.classificationCode).toBe('MISSED_FOLLOWUP');
    expect(typeof resultB.confidenceScore).toBe('number');
    expect(resultB.confidenceScore).toBeGreaterThanOrEqual(0.0);
    expect(resultB.confidenceScore).toBeLessThanOrEqual(1.0);

    // 2つの結果が異なることを確認
    expect(resultA.classificationCode).not.toBe(resultB.classificationCode);

    // 各分類結果に信頼度スコアが含まれていることを確認
    expect(resultA).toHaveProperty('confidenceScore');
    expect(resultB).toHaveProperty('confidenceScore');
  });
});