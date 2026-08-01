import { determineLogExtractionRange } from '../../src/logic/it-1-br-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセスログ抽出範囲確定機能', () => {
  test('SCEN-070: 営業部長の承認ステータスが確認できないときエラーが発生して抽出範囲確定が実行されない', async () => {
    fetchMock.resetMocks();

    fetchMock.mockResponseOnce(
      JSON.stringify({ statusCode: 'APPROVAL_STATUS_UNAVAILABLE' }),
      { status: 500 }
    );

    const extraction_start_date = '2024-01-01';
    const extraction_end_date = '2024-01-31';

    const call_api = async () => {
      return determineLogExtractionRange({
        extraction_start_date,
        extraction_end_date,
      });
    };

    await expect(call_api()).rejects.toThrow(/営業部長の承認ステータス/);
  });
});