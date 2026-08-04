import { generateExplanationFromReasons } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-685
  test('推奨根拠が複数件のとき、すべての根拠を含めた説明文を生成する', () => {
    const recommendationId = 'REC-2025-001';
    const recommendedApproach = 'クラウドネイティブ移行パッケージ提案';
    
    const reasons = [
      {
        reasonId: 'R001',
        pattern: '顧客規模が1000名以上',
        matchScore: 0.95,
        successRate: 0.92
      },
      {
        reasonId: 'R002',
        pattern: '導入期間が6ヶ月以内',
        matchScore: 0.88,
        successRate: 0.87
      },
      {
        reasonId: 'R003',
        pattern: '既存システムがクラウド基盤',
        matchScore: 0.82,
        successRate: 0.84
      }
    ];

    const result = generateExplanationFromReasons({
      recommendationId,
      recommendedApproach,
      reasons
    });

    expect(result.explanationText).toContain('顧客規模が1000名以上');
    expect(result.explanationText).toContain('95%');
    expect(result.explanationText).toContain('92%');
    
    expect(result.explanationText).toContain('導入期間が6ヶ月以内');
    expect(result.explanationText).toContain('88%');
    expect(result.explanationText).toContain('87%');
    
    expect(result.explanationText).toContain('既存システムがクラウド基盤');
    expect(result.explanationText).toContain('82%');
    expect(result.explanationText).toContain('84%');

    expect(result.reasonsIncluded).toBe(3);
    expect(result.reasonsIncluded).toEqual(reasons.length);
  });
});