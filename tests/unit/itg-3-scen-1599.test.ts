import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件への提案アプローチを自動推奨', () => {
  // SCEN-1599
  test('類似顧客マッチング処理 - 過去顧客データが複数件のとき、すべての顧客に対して一致度判定が実行される', () => {
    // 準備: 過去顧客データベースに3件の顧客レコードを用意
    const pastCustomerA = {
      customerId: 'CUST-001',
      industry: '製造業',
      scale: '大企業',
      challenges: ['生産効率', 'コスト削減']
    };

    const pastCustomerB = {
      customerId: 'CUST-002',
      industry: '金融業',
      scale: '中堅企業',
      challenges: ['デジタル化', 'セキュリティ']
    };

    const pastCustomerC = {
      customerId: 'CUST-003',
      industry: '小売業',
      scale: '中小企業',
      challenges: ['在庫管理', '顧客体験']
    };

    const pastCustomerDatabase = [pastCustomerA, pastCustomerB, pastCustomerC];

    // 新規案件の条件を入力パラメータとして定義
    const newBusinessCondition = {
      industry: '製造業',
      scale: '大企業',
      challenges: ['生産効率', 'デジタル化']
    };

    // AIRecommendationEngineのスタブを作成
    let callCount = 0;
    const callLog: Array<{ customerId: string; callIndex: number }> = [];

    const mockAIRecommendationEngine = {
      findSimilarPatterns: (pastCustomer: typeof pastCustomerA, newCondition: typeof newBusinessCondition): number => {
        callCount++;
        callLog.push({
          customerId: pastCustomer.customerId,
          callIndex: callCount
        });

        // 一致度スコア（0～1の範囲）を返す
        if (pastCustomer.customerId === 'CUST-001') {
          return 0.85; // 業種が同じため高スコア
        } else if (pastCustomer.customerId === 'CUST-002') {
          return 0.42; // 業種が異なるため低スコア
        } else if (pastCustomer.customerId === 'CUST-003') {
          return 0.28; // 業種と規模が異なるため更に低スコア
        }
        return 0;
      }
    };

    // 類似顧客マッチング処理を実行
    const result = findSimilarPatterns(
      pastCustomerDatabase,
      newBusinessCondition,
      mockAIRecommendationEngine
    );

    // 検証: AIRecommendationEngine.findSimilarPatternsが過去顧客データの件数分（3回）呼び出されたことを確認
    expect(callCount).toBe(3);

    // 検証: 各呼び出しで異なる顧客IDが渡されていることを確認
    expect(callLog).toEqual([
      { customerId: 'CUST-001', callIndex: 1 },
      { customerId: 'CUST-002', callIndex: 2 },
      { customerId: 'CUST-003', callIndex: 3 }
    ]);

    // 検証: 戻り値に顧客A、顧客B、顧客Cのそれぞれについて一致度スコア（数値）を含む結果が返却されていることを確認
    expect(result).toEqual([
      {
        customerId: 'CUST-001',
        industry: '製造業',
        scale: '大企業',
        challenges: ['生産効率', 'コスト削減'],
        similarityScore: 0.85
      },
      {
        customerId: 'CUST-002',
        industry: '金融業',
        scale: '中堅企業',
        challenges: ['デジタル化', 'セキュリティ'],
        similarityScore: 0.42
      },
      {
        customerId: 'CUST-003',
        industry: '小売業',
        scale: '中小企業',
        challenges: ['在庫管理', '顧客体験'],
        similarityScore: 0.28
      }
    ]);

    // 検証: スコアが数値で、かつ0～1の範囲内であることを確認
    result.forEach((matchResult) => {
      expect(typeof matchResult.similarityScore).toBe('number');
      expect(matchResult.similarityScore).toBeGreaterThanOrEqual(0);
      expect(matchResult.similarityScore).toBeLessThanOrEqual(1);
    });
  });
});