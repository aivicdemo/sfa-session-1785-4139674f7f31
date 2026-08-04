import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 期限切れレポート削除', () => {
  test('SCEN-092: 有効期限内のレポートが削除されない', async () => {
    const now = new Date('2024-02-15T00:00:00Z');
    const baseTime = now.getTime();

    // テスト用レポートデータの作成
    const reportA = {
      id: 'report-A',
      fileName: 'report_A.pdf',
      s3Key: 'recommendations/report-A',
      createdAt: new Date(baseTime),
      expiresAt: new Date(baseTime + 30 * 24 * 60 * 60 * 1000),
      deleted: false,
    };

    const reportB = {
      id: 'report-B',
      fileName: 'report_B.pdf',
      s3Key: 'recommendations/report-B',
      createdAt: new Date(baseTime - 40 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(baseTime - 40 * 24 * 60 * 60 * 1000 + 30 * 24 * 60 * 60 * 1000),
      deleted: false,
    };

    const reportC = {
      id: 'report-C',
      fileName: 'report_C.pdf',
      s3Key: 'recommendations/report-C',
      createdAt: new Date(baseTime - 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(baseTime - 7 * 24 * 60 * 60 * 1000 + 30 * 24 * 60 * 60 * 1000),
      deleted: false,
    };

    const allReports = [reportA, reportB, reportC];
    const s3DeletedKeys: string[] = [];

    // FileStorageAdapterのスタブ化
    const fileStorageAdapterStub = {
      deleteFromS3: async (s3Key: string): Promise<void> => {
        s3DeletedKeys.push(s3Key);
      },
      queryReportMetadata: async (): Promise<typeof allReports> => {
        return allReports.filter((r) => !r.deleted);
      },
      markReportAsDeleted: async (reportId: string): Promise<void> => {
        const report = allReports.find((r) => r.id === reportId);
        if (report) {
          report.deleted = true;
        }
      },
    };

    // deleteExpiredReportsメソッドを呼び出す
    await deleteExpiredReports(fileStorageAdapterStub, now);

    // 削除状態の検証
    const remainingReports = allReports.filter((r) => !r.deleted);
    const deletedReports = allReports.filter((r) => r.deleted);

    // レポートA（有効期限内）が残存していることを確認
    expect(remainingReports.some((r) => r.id === 'report-A')).toBe(true);

    // レポートB（期限切れ）が削除されていることを確認
    expect(deletedReports.some((r) => r.id === 'report-B')).toBe(true);

    // レポートC（有効期限内）が残存していることを確認
    expect(remainingReports.some((r) => r.id === 'report-C')).toBe(true);

    // S3削除呼び出しに期限切れレポートBのキーのみが含まれることを確認
    expect(s3DeletedKeys).toEqual(['recommendations/report-B']);
    expect(s3DeletedKeys).toHaveLength(1);

    // 残存レポート数が2つであることを確認
    expect(remainingReports).toHaveLength(2);

    // 削除されたレポート数が1つであることを確認
    expect(deletedReports).toHaveLength(1);
  });
});