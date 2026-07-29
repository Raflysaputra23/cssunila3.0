export const generateVerificationEmailHtml = (
  email: string,
  code: string,
  fullName: string
) => {
  const domainUrl = process.env.NEXT_PUBLIC_DOMAIN_URL ?? "http://localhost:3000";
  const displayName = fullName?.trim() || "Peserta";
  const digits = code.split("");

  const digitCell = (d: string) => `
    <td style="padding:0 5px;">
      <div style="
        width:48px;
        height:60px;
        background:#1a2035;
        border:2px solid #3ab5d4;
        border-radius:12px;
        text-align:center;
        line-height:60px;
        font-size:32px;
        font-weight:800;
        color:#3ab5d4;
        font-family:'Courier New',Courier,monospace;
      ">${d}</div>
    </td>`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Verifikasi Email — CSS 3.0</title>
</head>
<body style="margin:0;padding:0;background-color:#0c0f1e;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0c0f1e;">
    <tr>
      <td align="center" style="padding:48px 16px;">

        <!-- Card wrapper -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:540px;">

          <!-- ===== HEADER ===== -->
          <tr>
            <td style="
              background:linear-gradient(135deg,#4a2ec2 0%,#2a9dbf 55%,#1e8a5e 100%);
              border-radius:20px 20px 0 0;
              padding:40px 40px 36px;
              text-align:center;
            ">
              <img
                src="cid:csslogo"
                alt="CSS 3.0 Logo"
                width="72"
                height="72"
                style="display:block;margin:0 auto 18px;height:72px;width:auto;"
              />
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.02em;">
                Computer Science Showdown
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.72);font-size:13px;letter-spacing:0.03em;">
                CSS 3.0 &mdash; HIMAKOM FMIPA Universitas Lampung
              </p>
            </td>
          </tr>

          <!-- ===== BODY ===== -->
          <tr>
            <td style="
              background:#121728;
              border-left:1px solid rgba(255,255,255,0.07);
              border-right:1px solid rgba(255,255,255,0.07);
              padding:40px 40px 36px;
            ">
              <!-- Greeting -->
              <h2 style="margin:0 0 10px;color:#e2e8f0;font-size:20px;font-weight:600;">
                Halo, ${displayName}! &#x1F44B;
              </h2>
              <p style="margin:0 0 32px;color:#94a3b8;font-size:15px;line-height:1.75;">
                Kami menerima permintaan pembuatan akun CSS 3.0 dengan email
                <strong style="color:#e2e8f0;">${email}</strong>.
                Masukkan kode verifikasi di bawah untuk mengaktifkan akun Anda:
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                style="margin:0 0 32px;">
                <tr>
                  <td style="
                    background:linear-gradient(135deg,rgba(74,46,194,0.18),rgba(42,157,191,0.18));
                    border:1px solid rgba(58,181,212,0.28);
                    border-radius:16px;
                    padding:32px 24px;
                    text-align:center;
                  ">
                    <p style="margin:0 0 20px;color:#64748b;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;">
                      Kode Verifikasi
                    </p>

                    <!-- Digit boxes -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                      style="margin:0 auto;">
                      <tr>
                        ${digits.map(digitCell).join("")}
                      </tr>
                    </table>

                    <p style="margin:22px 0 0;color:#64748b;font-size:13px;">
                      &#x23F0; Berlaku selama
                      <strong style="color:#94a3b8;">15 menit</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                style="margin:0 0 24px;">
                <tr>
                  <td style="height:1px;background:rgba(255,255,255,0.07);"></td>
                </tr>
              </table>

              <!-- Warning -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="
                    background:rgba(245,158,11,0.08);
                    border:1px solid rgba(245,158,11,0.18);
                    border-radius:10px;
                    padding:14px 18px;
                  ">
                    <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.7;">
                      &#x26A0;&#xFE0F;
                      Jika Anda tidak mendaftar akun CSS 3.0, abaikan email ini.
                      Kode akan otomatis kadaluarsa dan tidak ada tindakan lebih lanjut yang diperlukan.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ===== FOOTER ===== -->
          <tr>
            <td style="
              background:#0a0d1a;
              border:1px solid rgba(255,255,255,0.05);
              border-top:none;
              border-radius:0 0 20px 20px;
              padding:24px 40px;
              text-align:center;
            ">
              <p style="margin:0 0 4px;color:#475569;font-size:12px;">
                &copy; 2026 Computer Science Showdown &mdash; HIMAKOM FMIPA Universitas Lampung
              </p>
              <p style="margin:0;color:#334155;font-size:11px;">
                Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
