import { validateDownloadUrlExpiry } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - ダウンロードURL有効期限管理", () => {
  // SCEN-1178
  test("生成されたダウンロードURLの有効期限がデフォルト値正確に設定されるとき、期限内はアクセス可能と判定する", () => {
    // デフォルト有効期限（秒）
    const DEFAULT_EXPIRY_SECONDS = 3600;

    // 基準時刻（固定値）
    const baseTime = new Date("2026-08-01T08:09:40.805Z");
    const baseTimeMs = baseTime.getTime();

    // ダウンロードURL生成時刻
    const generatedAtMs = baseTimeMs;

    // 期限内の時刻（基準時刻+1800秒後）
    const accessTimeWithinExpiry = new Date(baseTimeMs + 1800 * 1000);

    // 期限外の時刻（基準時刻+3601秒後）
    const accessTimeAfterExpiry = new Date(baseTimeMs + 3601 * 1000);

    // ダウンロードURL有効期限（基準時刻+3600秒）
    const expiryAtMs = generatedAtMs + DEFAULT_EXPIRY_SECONDS * 1000;

    // 期限内アクセスの検証
    const isValidWithinExpiry = validateDownloadUrlExpiry(
      generatedAtMs,
      expiryAtMs,
      accessTimeWithinExpiry.getTime()
    );

    expect(isValidWithinExpiry).toBe(true);

    // 期限外アクセスの検証
    const isValidAfterExpiry = validateDownloadUrlExpiry(
      generatedAtMs,
      expiryAtMs,
      accessTimeAfterExpiry.getTime()
    );

    expect(isValidAfterExpiry).toBe(false);

    // 有効期限がデフォルト値と一致することを確認
    const actualExpirySeconds = (expiryAtMs - generatedAtMs) / 1000;
    expect(actualExpirySeconds).toBe(DEFAULT_EXPIRY_SECONDS);
  });
});