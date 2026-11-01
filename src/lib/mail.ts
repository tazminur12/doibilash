/**
 * Doi Bilash Email Service
 * Powered by Resend API
 */

interface SendWelcomeEmailParams {
  name: string;
  toEmail: string;
}

export async function sendWelcomeEmail({ name, toEmail }: SendWelcomeEmailParams): Promise<{
  ok: boolean;
  id?: string;
  error?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Mail] RESEND_API_KEY is not defined in environment variables. Email skipping.");
    return { ok: false, error: "RESEND_API_KEY is missing" };
  }

  // Sender email address from environment or fallback
  const fromEmail = process.env.RESEND_DOMIAN_INFO || "info@doibilash.com";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://doibilash.com";
  const shopUrl = `${appUrl}/shop`;

  const safeName = name ? name.trim() : "সম্মানিত গ্রাহক";

  const html = `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>দই বিলাসে আপনাকে স্বাগতম</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF6F0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #351C1B;
      line-height: 1.6;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #FAF6F0;
      padding: 30px 15px;
    }
    .main-table {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(53, 28, 27, 0.08);
      border: 1px solid #EFE4D6;
    }
    .header {
      background: linear-gradient(135deg, #2A1413 0%, #351C1B 50%, #4A2725 100%);
      padding: 40px 30px;
      text-align: center;
      position: relative;
    }
    .logo-container {
      display: inline-block;
      margin-bottom: 12px;
    }
    .brand-title {
      color: #FFFFFF;
      font-size: 28px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .brand-title span {
      color: #E2A76F;
    }
    .brand-subtitle {
      color: #F3DECB;
      font-size: 13px;
      margin: 6px 0 0 0;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 36px 32px 30px 32px;
    }
    .greeting {
      font-size: 22px;
      font-weight: 700;
      color: #351C1B;
      margin-top: 0;
      margin-bottom: 14px;
    }
    .message-body {
      font-size: 15px;
      color: #5A4746;
      margin-bottom: 24px;
      line-height: 1.7;
    }
    .coupon-box {
      background: linear-gradient(135deg, #FFF9F2 0%, #FBF1E4 100%);
      border: 2px dashed #C48A4E;
      border-radius: 16px;
      padding: 22px 20px;
      text-align: center;
      margin: 26px 0;
    }
    .coupon-tag {
      display: inline-block;
      background-color: #C48A4E;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 20px;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    .coupon-code {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 3px;
      color: #351C1B;
      font-family: monospace;
      margin: 4px 0;
    }
    .coupon-desc {
      font-size: 13px;
      color: #8C5D30;
      margin: 6px 0 0 0;
      font-weight: 600;
    }
    .features-table {
      width: 100%;
      margin: 28px 0;
      border-top: 1px solid #F0E6D8;
      border-bottom: 1px solid #F0E6D8;
      padding: 16px 0;
    }
    .feature-item {
      padding: 12px 10px;
      text-align: center;
      vertical-align: top;
      width: 33.33%;
    }
    .feature-title {
      font-size: 13px;
      font-weight: 700;
      color: #351C1B;
      margin: 6px 0 3px 0;
    }
    .feature-desc {
      font-size: 11px;
      color: #7D6B6A;
      margin: 0;
    }
    .cta-container {
      text-align: center;
      margin: 30px 0 20px 0;
    }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #A95E35 0%, #C48A4E 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 700;
      padding: 15px 36px;
      border-radius: 50px;
      box-shadow: 0 10px 24px rgba(169, 94, 53, 0.35);
    }
    .footer {
      background-color: #FAF4EB;
      border-top: 1px solid #EFE4D6;
      padding: 24px 30px;
      text-align: center;
      font-size: 12px;
      color: #8A7A78;
    }
    .footer a {
      color: #C48A4E;
      text-decoration: none;
      font-weight: 600;
    }
    .footer-divider {
      margin: 12px 0;
      color: #D6C8B8;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main-table" align="center" width="100%">
      <!-- Header -->
      <tr>
        <td class="header">
          <div class="logo-container">
            <h1 class="brand-title">দই <span>বিলাস</span></h1>
            <p class="brand-subtitle">বগুড়ার খাঁটি ঐতিহ্যের আদি স্বাদ</p>
          </div>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td class="content">
          <h2 class="greeting">স্বাগতম, ${safeName}!</h2>
          <p class="message-body">
            দই বিলাস পরিবারে আপনাকে আন্তরিক স্বাগতম। বগুড়ার ঐতিহ্যবাহী মাটির পাত্রের খাঁটি সরার দই, রসমালাই, কাঁচাগোল্লা ও খাঁটি গাওয়া ঘিয়ের অনন্য স্বাদ আপনার দোরগোড়ায় পৌঁছে দিতে আমরা প্রতিশ্রুতিবদ্ধ।
          </p>

          <!-- Welcome Coupon -->
          <div class="coupon-box">
            <span class="coupon-tag">স্পেশাল ওয়েলকাম গিফট</span>
            <div class="coupon-code">WELCOME10</div>
            <p class="coupon-desc">প্রথম যেকোনো অর্ডারে ১০% বিশেষ ছাড় উপভোগ করুন</p>
          </div>

          <!-- Pillars -->
          <table class="features-table" width="100%">
            <tr>
              <td class="feature-item">
                <div style="font-size: 24px;">🥛</div>
                <div class="feature-title">১০০% খাঁটি দুধ</div>
                <p class="feature-desc">গাভীর খাঁটি দুধ ও প্রাকৃতিক উপাদানে তৈরি</p>
              </td>
              <td class="feature-item">
                <div style="font-size: 24px;">🏺</div>
                <div class="feature-title">ঐতিহ্যবাহী স্বাদ</div>
                <p class="feature-desc">বগুড়ার আদি মাটির সরার ঐতিহ্য</p>
              </td>
              <td class="feature-item">
                <div style="font-size: 24px;">🚀</div>
                <div class="feature-title">দ্রুত ডেলিভারি</div>
                <p class="feature-desc">নিরাপদ ও স্বাস্থ্যসম্মত হোম ডেলিভারি</p>
              </td>
            </tr>
          </table>

          <!-- CTA Button -->
          <div class="cta-container">
            <a href="${shopUrl}" class="cta-btn" target="_blank">
              আমাদের পণ্যসমূহ দেখুন ও অর্ডার করুন
            </a>
          </div>

          <p style="font-size: 13px; color: #7D6B6A; text-align: center; margin-top: 24px;">
            যেকোনো তথ্য বা সরাসরি অর্ডারের জন্য আমাদের হেল্পলাইনে যোগাযোগ করতে পারেন: <br>
            <strong style="color: #351C1B;">📞 +880 1712-345678</strong> | ✉️ <strong>${fromEmail}</strong>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td class="footer">
          <p style="margin: 0 0 6px 0;"><strong>দই বিলাস</strong> — বগুড়া ও ঢাকা, বাংলাদেশ</p>
          <p style="margin: 0;">
            <a href="${appUrl}">ওয়েবসাইট ভিজিট করুন</a> | 
            <a href="${appUrl}/profile">আমার অ্যাকাউন্ট</a> | 
            <a href="${appUrl}/terms">শর্তাবলী</a>
          </p>
          <div class="footer-divider">• • •</div>
          <p style="margin: 0; font-size: 11px; color: #A69795;">
            আপনি দই বিলাসে সাইন-আপ করার কারণে এই ইমেইলটি পেয়েছেন।<br>
            &copy; ২০২৬ দই বিলাস। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `দই বিলাস <${fromEmail}>`,
        to: [toEmail],
        subject: `দই বিলাসে আপনাকে স্বাগতম, ${safeName}! (১০% ডিসকাউন্ট ভাউচার ভিতরে)`,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Mail] Resend API error:", data);
      return { ok: false, error: data?.message || "ইমেইল পাঠাতে ব্যর্থ হয়েছে" };
    }

    console.log("[Mail] Welcome email sent successfully:", data?.id, "to:", toEmail);
    return { ok: true, id: data?.id };
  } catch (error: any) {
    console.error("[Mail] Failed to send email via Resend:", error);
    return { ok: false, error: error?.message || "নেটওয়ার্ক সমস্যা" };
  }
}

