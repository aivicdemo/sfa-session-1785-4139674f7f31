import { recordCustomerReaction } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応の標準化分類記録機能', () => {
  // SCEN-444
  test('顧客反応の記録タイムスタンプが月末日をまたぐとき正しく分類される', async () => {
    // システム時刻を 2024-01-31 23:59:59 に設定
    const firstTimestamp = new Date('2024-01-31T23:59:59Z');
    
    // 最初の顧客反応データを記録
    const firstReactionResult = await recordCustomerReaction({
      customerId: 'C001',
      reactionContent: '提案資料確認済み',
      timestamp: firstTimestamp
    });

    // システム時刻を 2024-02-01 00:00:01 に進める
    const secondTimestamp = new Date('2024-02-01T00:00:01Z');
    
    // 追加の顧客反応データを記録
    const secondReactionResult = await recordCustomerReaction({
      customerId: 'C002',
      reactionContent: '見積依頼',
      timestamp: secondTimestamp
    });

    // 第1件の反応検証: タイムスタンプと月別分類
    expect(firstReactionResult.timestamp).toBe('2024-01-31T23:59:59Z');
    expect(firstReactionResult.monthlyClassification).toBe('2024年1月');
    
    // 第2件の反応検証: タイムスタンプと月別分類
    expect(secondReactionResult.timestamp).toBe('2024-02-01T00:00:01Z');
    expect(secondReactionResult.monthlyClassification).toBe('2024年2月');
  });
});