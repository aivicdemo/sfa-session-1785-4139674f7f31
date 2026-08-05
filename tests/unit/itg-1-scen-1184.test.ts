import { analyzeCareerPatternBySalesId } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-1184: 営業担当者IDが空文字列のとき処理がエラーになる', () => {
    // 空文字列の営業担当者ID
    const salesIdEmpty = '';
    // 正常な分析期間
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');
    // 対象データ種別
    const targetDataTypes = ['contact', 'proposal'];

    // 関数の実行結果を検証
    const result = analyzeCareerPatternBySalesId(
      salesIdEmpty,
      analysisStartDate,
      analysisEndDate,
      targetDataTypes
    );

    // エラーオブジェクトが返却されていることを確認
    expect(result).toHaveProperty('error');
    expect(result.error).toBe(true);

    // エラーコードが正確に『INVALID_SALES_ID_EMPTY』であることを確認
    expect(result.errorCode).toBe('INVALID_SALES_ID_EMPTY');

    // エラーメッセージが正確に『営業担当者IDは空文字列では指定できません』であることを確認
    expect(result.errorMessage).toBe('営業担当者IDは空文字列では指定できません');

    // 分析結果データベースへのレコード登録が実行されないことを確認
    expect(result.analysisResultId).toBeUndefined();
    expect(result.analysisData).toBeUndefined();
  });
});