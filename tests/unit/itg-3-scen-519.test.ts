import { aggregateQualityScores } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - データ品質スコア算出', () => {
  test('SCEN-519: 複数件のレコードを入力したとき、各レコードの個別品質スコアが平均値として集約される', () => {
    // 検証対象データの準備：3件の異なるレコード
    const recordA = {
      id: 'record_001',
      customerId: 'cust_A',
      dataField: 'company_name',
      value: '株式会社テスト',
      timestamp: new Date('2024-01-15T10:00:00Z'),
    };

    const recordB = {
      id: 'record_002',
      customerId: 'cust_B',
      dataField: 'email',
      value: 'contact@example.com',
      timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const recordC = {
      id: 'record_003',
      customerId: 'cust_C',
      dataField: 'phone',
      value: '090-1234-5678',
      timestamp: new Date('2024-01-15T12:00:00Z'),
    };

    // 各レコードの個別品質スコア
    const scoreA = 85;
    const scoreB = 90;
    const scoreC = 80;

    // 複数件のレコードを品質スコア算出機能に入力
    const records = [
      { ...recordA, qualityScore: scoreA },
      { ...recordB, qualityScore: scoreB },
      { ...recordC, qualityScore: scoreC },
    ];

    // スコア集約処理を実行
    const aggregatedScore = aggregateQualityScores(records);

    // 期待値：個別スコアの平均値
    const expectedAverageScore = (scoreA + scoreB + scoreC) / 3; // (85 + 90 + 80) / 3 = 85

    // 集約スコアが単一の数値として返却されることを確認
    expect(typeof aggregatedScore).toBe('number');

    // 集約後の結果が平均値として計算されていることを検証
    expect(aggregatedScore).toBe(expectedAverageScore);
  });
});