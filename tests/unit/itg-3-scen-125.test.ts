import { validateReportMetadata } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - レポートファイルメタデータ検証', () => {
  // SCEN-125
  test('有効期限がないメタデータエントリでエラーが発生する', () => {
    const reportMetadataWithoutExpiration = {
      id: 'meta-001',
      fileName: 'recommendation_report.pdf',
      fileSize: 2048000,
      uploadedAt: '2024-01-15T10:30:00Z',
      expirationDate: null,
      uploadedBy: 'user-123'
    };

    expect(() => {
      validateReportMetadata(reportMetadataWithoutExpiration);
    }).toThrow(/expirationDate/);
  });
});