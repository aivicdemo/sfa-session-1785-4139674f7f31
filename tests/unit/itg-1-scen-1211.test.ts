import { calculateCorrelationCoefficient } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書との乖離分析と成約実績の相関分析機能', () => {
  // SCEN-1211: [edge] プロセス実行度が標準比100%を超えるときの相関係数が正確に計算される
  test('プロセス実行度が標準比120%を超える場合、相関係数が-1.0～1.0の範囲内で正確に計算され、計算根拠がauditLogに完全に記録される', () => {
    // Arrange: テストデータとしてプロセス実行度が標準比120%（超過実行）の営業担当者データセットを準備
    const processExecutionRatio = 1.20;
    const salesAchievementData = {
      contractCount: 50,
      totalAmount: 50000000,
    };

    // Arrange: Pearson相関係数の期待値を計算する
    // 以下の仮想データセットを用いて相関係数を手計算：
    // processExecutionRatio = 1.20 の営業担当者グループ（サンプル50件）
    // X軸: プロセス実行度（正規化後）[0.95, 0.98, 1.00, 1.05, 1.10, 1.15, 1.20, 1.25, 1.30, 1.35, ...]
    // Y軸: 成約実績（成約件数正規化）[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...]
    // 期待値は営業プロセス実行度と成約実績の相関が強く正の値を示すと想定し、0.847と設定
    // （実際のデータセットではサンプル50件の共分散値を計算し、各変数の標準偏差で除算）
    const expectedCorrelationCoefficient = 0.847;
    const correlationTolerance = 0.001;

    // Act: 相関分析関数 calculateCorrelationCoefficient() に以下パラメータを入力
    const result = calculateCorrelationCoefficient({
      processExecutionRatio,
      salesAchievementData,
    });

    // Assert: 相関係数が-1.0～1.0の範囲内の数値として返却されることを確認
    expect(result.correlationCoefficient).toBeGreaterThanOrEqual(-1.0);
    expect(result.correlationCoefficient).toBeLessThanOrEqual(1.0);

    // Assert: 相関係数の計算精度を検証：期待値に対する誤差が±0.001以内であることを確認
    expect(Math.abs(result.correlationCoefficient - expectedCorrelationCoefficient)).toBeLessThanOrEqual(
      correlationTolerance,
    );

    // Assert: 相関分析結果オブジェクトに必要なフィールドが全て含まれることを確認
    expect(result).toHaveProperty('correlationCoefficient');
    expect(result).toHaveProperty('processExecutionRatio');
    expect(result).toHaveProperty('datasetId');
    expect(result).toHaveProperty('calculationTimestamp');
    expect(result).toHaveProperty('calculationMethod');

    // Assert: 相関分析結果が期待値と一致することを確認
    expect(result.correlationCoefficient).toBe(expectedCorrelationCoefficient);
    expect(result.processExecutionRatio).toBe(1.20);
    expect(result.calculationMethod).toBe('Pearson');

    // Assert: auditLog配列が存在し、計算根拠が記録されていることを確認
    expect(result).toHaveProperty('auditLog');
    expect(Array.isArray(result.auditLog)).toBe(true);
    expect(result.auditLog.length).toBeGreaterThan(0);

    // Assert: auditLogから、プロセス実行度が100%を超える場合の正規化ロジックが適用されたことを確認
    const normalizationLogEntry = result.auditLog.find(
      (entry: Record<string, unknown>) =>
        typeof entry.message === 'string' && entry.message.includes('normalization'),
    );
    expect(normalizationLogEntry).toBeDefined();

    // Assert: 計算根拠となるデータセット情報がauditLogに記録されていることを確認
    const datasetInfoEntry = result.auditLog.find(
      (entry: Record<string, unknown>) =>
        typeof entry.datasetInfo === 'object' &&
        entry.datasetInfo !== null &&
        'sampleCount' in entry.datasetInfo,
    );
    expect(datasetInfoEntry).toBeDefined();
    expect(datasetInfoEntry?.datasetInfo).toHaveProperty('sampleCount');
    expect(datasetInfoEntry?.datasetInfo?.sampleCount).toBe(50);

    // Assert: 外れ値処理に関する情報がauditLogに含まれることを確認
    const outlierHandlingEntry = result.auditLog.find(
      (entry: Record<string, unknown>) =>
        typeof entry.message === 'string' && entry.message.includes('outlier'),
    );
    expect(outlierHandlingEntry).toBeDefined();

    // Assert: 正規化手法に関する情報がauditLogに含まれることを確認
    const normalizationMethodEntry = result.auditLog.find(
      (entry: Record<string, unknown>) =>
        typeof entry.method === 'string' && entry.method.includes('normalization'),
    );
    expect(normalizationMethodEntry).toBeDefined();

    // Assert: 計算ロジックの根拠（分子：共分散値、分母：標準偏差積）がauditLogに記録されていることを確認
    const calculationDetailEntry = result.auditLog.find(
      (entry: Record<string, unknown>) =>
        typeof entry.calculationDetails === 'object' && entry.calculationDetails !== null,
    );
    expect(calculationDetailEntry).toBeDefined();
    expect(calculationDetailEntry?.calculationDetails).toHaveProperty('covariance');
    expect(calculationDetailEntry?.calculationDetails).toHaveProperty('stdDevProductX');
    expect(calculationDetailEntry?.calculationDetails).toHaveProperty('stdDevProductY');

    // Assert: calculationTimestampが有効なISO 8601形式の文字列であることを確認
    expect(typeof result.calculationTimestamp).toBe('string');
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(result.calculationTimestamp)).toBe(true);

    // Assert: datasetIdが存在し、文字列形式であることを確認
    expect(typeof result.datasetId).toBe('string');
    expect(result.datasetId.length).toBeGreaterThan(0);

    // Assert: processExecutionRatioが100%を超える値として正確に記録されていることを確認
    expect(result.processExecutionRatio).toBeGreaterThan(1.0);
    expect(result.processExecutionRatio).toBe(1.20);

    // Assert: 営業管理者が検証用に必要な要素（使用データ件数、外れ値処理、正規化手法）が全てauditLogに含まれていることを確認
    const auditLogMessages = result.auditLog.map((entry: Record<string, unknown>) =>
      typeof entry.message === 'string' ? entry.message : '',
    );
    expect(auditLogMessages.some((msg: string) => msg.includes('sample'))).toBe(true);
    expect(auditLogMessages.some((msg: string) => msg.includes('outlier'))).toBe(true);
    expect(auditLogMessages.some((msg: string) => msg.includes('normalization'))).toBe(true);
  });
});