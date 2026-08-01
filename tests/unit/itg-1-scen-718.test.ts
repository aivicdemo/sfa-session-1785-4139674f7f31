import { evaluateApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-718: 同じ要因セットで2回承認基準判定を実行したとき、同じ結果が返される', () => {
    const successFactors = [
      { id: 'sf001', name: '初回接触から3日以内に提案', weight: 0.35 },
      { id: 'sf002', name: '提案時に顧客課題を3項目以上言及', weight: 0.30 },
      { id: 'sf003', name: 'フォローアップ間隔が7日以内', weight: 0.25 }
    ];

    const failureFactors = [
      { id: 'ff001', name: '提案から成約まで60日以上経過', weight: 0.50 },
      { id: 'ff002', name: 'フォローアップ回数が1回以下', weight: 0.50 }
    ];

    const evaluationCriteria = {
      minSuccessFactorScore: 0.75,
      maxFailureFactorScore: 0.40,
      approvalThreshold: 0.80
    };

    const firstResult = evaluateApprovalCriteria({
      successFactors,
      failureFactors,
      criteria: evaluationCriteria
    });

    const secondResult = evaluateApprovalCriteria({
      successFactors,
      failureFactors,
      criteria: evaluationCriteria
    });

    expect(firstResult.status).toBe(secondResult.status);
    expect(firstResult.score).toBe(secondResult.score);
    expect(firstResult.reason).toBe(secondResult.reason);
  });
});