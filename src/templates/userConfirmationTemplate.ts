interface UserConfirmationTemplateProps {
  studentName: string;
  parentName: string;
  preferredTime: string;
  chessExperience: string;
}

export const userConfirmationTemplate = (
  data: UserConfirmationTemplateProps
): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Demo Class Confirmation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 40px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%);
      padding: 48px 40px;
      text-align: center;
    }
    .chess-icon {
      font-size: 56px;
      display: block;
      margin-bottom: 16px;
      filter: drop-shadow(0 4px 12px rgba(245,158,11,0.4));
    }
    .header h1 {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
    }
    .header .subtitle {
      color: #f59e0b;
      font-size: 15px;
      margin-top: 8px;
      font-weight: 500;
    }
    .body { padding: 40px; }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 16px;
    }
    .intro-text {
      font-size: 15px;
      color: #475569;
      line-height: 1.8;
      margin-bottom: 32px;
    }
    .highlight { color: #f59e0b; font-weight: 700; }
    .card {
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 28px;
    }
    .card-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #94a3b8;
      margin-bottom: 16px;
    }
    .detail-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .detail-row:last-child { border-bottom: none; }
    .detail-icon { font-size: 18px; }
    .detail-label {
      font-size: 13px;
      color: #64748b;
      min-width: 130px;
    }
    .detail-value {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }
    .steps {
      margin-bottom: 32px;
    }
    .steps-title {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 20px;
    }
    .step {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      align-items: flex-start;
    }
    .step-number {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14px;
      flex-shrink: 0;
    }
    .step-content h4 {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .step-content p {
      font-size: 13px;
      color: #64748b;
      line-height: 1.6;
    }
    .promise-box {
      background: linear-gradient(135deg, #0f172a, #1e3a5f);
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 32px;
      text-align: center;
      color: white;
    }
    .promise-box .emoji { font-size: 32px; margin-bottom: 10px; display: block; }
    .promise-box h3 {
      font-size: 17px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #f59e0b;
    }
    .promise-box p { font-size: 13px; color: #94a3b8; line-height: 1.7; }
    .footer {
      background: #f1f5f9;
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p { font-size: 12px; color: #94a3b8; line-height: 1.8; }
    .footer .brand {
      font-weight: 700;
      color: #64748b;
      font-size: 13px;
      margin-bottom: 6px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="chess-icon">♟</span>
      <h1>You're All Set!</h1>
      <p class="subtitle">Your free demo class is confirmed</p>
    </div>

    <div class="body">
      <p class="greeting">Dear ${data.parentName},</p>
      <p class="intro-text">
        Thank you for registering <span class="highlight">${data.studentName}</span> for a free demo chess class!
        We are excited to have you on board. Our team will reach out to you
        shortly to schedule the demo at your preferred time.
      </p>

      <div class="card">
        <p class="card-title">📋 Your Registration Summary</p>
        <div class="detail-row">
          <span class="detail-icon">🧒</span>
          <span class="detail-label">Student Name</span>
          <span class="detail-value">${data.studentName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-icon">👨‍👩‍👧</span>
          <span class="detail-label">Parent Name</span>
          <span class="detail-value">${data.parentName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-icon">🕐</span>
          <span class="detail-label">Preferred Time</span>
          <span class="detail-value">${data.preferredTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-icon">♟</span>
          <span class="detail-label">Chess Level</span>
          <span class="detail-value">${data.chessExperience}</span>
        </div>
      </div>

      <div class="steps">
        <p class="steps-title">What happens next?</p>
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>Team Review</h4>
            <p>Our team reviews your registration and assigns the best-fit coach for ${data.studentName}'s level.</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>Personal Call</h4>
            <p>We'll reach out within 24 hours to confirm the demo class schedule at your preferred time.</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>Free Demo Class</h4>
            <p>Enjoy a completely free, no-obligation 45-minute live demo class with our expert coach!</p>
          </div>
        </div>
      </div>

      <div class="promise-box">
        <span class="emoji">🏆</span>
        <h3>Our Promise to You</h3>
        <p>
          We are committed to nurturing every child's potential through the art of chess.
          No pressure, no commitment — just pure learning and fun in your first class.
        </p>
      </div>
    </div>

    <div class="footer">
      <p class="brand">♟ Chess Academy</p>
      <p>
        If you have any questions, simply reply to this email.<br />
        © ${new Date().getFullYear()} Chess Academy. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;
