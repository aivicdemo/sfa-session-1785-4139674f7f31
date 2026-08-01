import { extractAndApproveSuccessFailureFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-699
  test('失敗要因が0件のとき、承認基準判定が正しく処理される', () => {
    const successFactors = [
      {
        id: 'factor_001',
        name: '営業担当者の提案力向上',
        description: '提案内容の充実により顧客ニーズへの対応度が向上',
        frequency: 1,
        extractionTimestamp: new Date('2024-01-15T10:00:00Z'),
      },
    ];

    const failureFactors: Array<{
      id: string;
      name: string;
      description: string;
      frequency: number;
      extractionTimestamp: Date;
    }> = [];

    const result = extractAndApproveSuccessFailureFactors({
      successFactors,
      failureFactors,
    });

    expect(result.approvalStatus).toBe('承認');
    expect(result.approvalReason).toBe('失敗要因が抽出されないため承認基準を満たす');
    expect(result.failureFactorCount).toBe(0);
    expect(result.successFactorCount).toBe(1);
  });
});