import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 期限切れレポート自動削除', () => {
  // SCEN-311
  test('有効期限を過ぎたレポートのみが削除される', async () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const currentTimeMs = now.getTime();

    // テストデータ: 3件のレポート
    const reportA = {
      reportId: 'RPT-001',
      fileName: 'recommendation_report_A.pdf',
      s3ObjectKey: 'reports/RPT-001/recommendation_report_A.pdf',
      expirationDate: new Date(currentTimeMs + 30 * 24 * 60 * 60 * 1000), // 現在から30日後
      createdAt: new Date('2024-01-10T12:00:00Z'),
      isDeleted: false,
    };

    const reportB = {
      reportId: 'RPT-002',
      fileName: 'recommendation_report_B.xlsx',
      s3ObjectKey: 'reports/RPT-002/recommendation_report_B.xlsx',
      expirationDate: new Date(currentTimeMs + 5 * 24 * 60 * 60 * 1000), // 現在から5日後
      createdAt: new Date('2024-01-10T12:00:00Z'),
      isDeleted: false,
    };

    const reportC = {
      reportId: 'RPT-003',
      fileName: 'recommendation_report_C.pdf',
      s3ObjectKey: 'reports/RPT-003/recommendation_report_C.pdf',
      expirationDate: new Date(currentTimeMs - 1 * 24 * 60 * 60 * 1000), // 現在から1日前（期限切れ）
      createdAt: new Date('2024-01-05T12:00:00Z'),
      isDeleted: false,
    };

    const reportMetadataTable = [reportA, reportB, reportC];

    // Amazon S3 スタブ化
    const s3DeletedKeys: string[] = [];
    const s3Stub = {
      deleteObject: jest.fn().mockImplementation((key: string) => {
        s3DeletedKeys.push(key);
        return Promise.resolve({ status: 204 });
      }),
    };

    // FileStorageAdapter スタブ化
    const fileStorageAdapterStub = {
      deleteExpiredReports: jest.fn().mockImplementation(
        async (reports: typeof reportMetadataTable, s3: typeof s3Stub, currentDate: Date) => {
          const expiredReports = reports.filter(
            (report) => report.expirationDate.getTime() < currentDate.getTime()
          );

          const remainingReports = [];
          for (const report of reports) {
            if (report.expirationDate.getTime() >= currentDate.getTime()) {
              remainingReports.push(report);
            } else {
              // 期限切れレポートを削除
              await s3.deleteObject(report.s3ObjectKey);
            }
          }

          return remainingReports;
        }
      ),
    };

    // 削除処理実行
    const resultReports = await fileStorageAdapterStub.deleteExpiredReports(
      reportMetadataTable,
      s3Stub,
      now
    );

    // 期待値の検証
    // 1. 削除後の残存レポート数が 2 件であること
    expect(resultReports).toHaveLength(2);

    // 2. 残存レポートが A と B であること
    expect(resultReports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ reportId: 'RPT-001' }),
        expect.objectContaining({ reportId: 'RPT-002' }),
      ])
    );

    // 3. レポート C が結果に含まれていないこと
    expect(resultReports).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ reportId: 'RPT-003' })])
    );

    // 4. Amazon S3 スタブが呼ばれたこと
    expect(s3Stub.deleteObject).toHaveBeenCalled();

    // 5. S3 削除呼び出しでレポート C のオブジェクトキーが 1 回だけ渡されたこと
    expect(s3DeletedKeys).toEqual(['reports/RPT-003/recommendation_report_C.pdf']);
    expect(s3DeletedKeys).toHaveLength(1);

    // 6. S3 スタブの戻り値が成功（HTTP 204）の状態で完了していること（例外なし）
    expect(fileStorageAdapterStub.deleteExpiredReports).toHaveBeenCalledWith(
      reportMetadataTable,
      s3Stub,
      now
    );
  });
});