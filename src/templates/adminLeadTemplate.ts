interface AdminLeadTemplateProps {
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  chessExperience: string;
  preferredTime: string;
  message?: string;
  submittedAt: string;
}

export const adminLeadTemplate = (data: AdminLeadTemplateProps): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Demo Lead</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #0f172a;
      color: #e2e8f0;
      padding: 20px;
    }
    .container {
      max-width: 640px;
      margin: 0 auto;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #334155;
    }
    .header {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      padding: 32px 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .header p {
      color: #451a03;
      margin-top: 6px;
      font-size: 14px;
      font-weight: 500;
    }
    .badge {
      display: inline-block;
      background: #0f172a;
      color: #f59e0b;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 100px;
      margin-bottom: 10px;
    }
    .body { padding: 36px 40px; }
    .alert-box {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 28px;
      font-size: 14px;
      color: #fbbf24;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #1e293b;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 28px;
    }
    .info-item {
      background: rgba(255,255,255,0.03);
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 14px 16px;
    }
    .info-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 6px;
    }
    .info-value {
      font-size: 15px;
      font-weight: 600;
      color: #f1f5f9;
    }
    .full-width { grid-column: 1 / -1; }
    .message-box {
      background: rgba(255,255,255,0.03);
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 16px 18px;
      font-size: 14px;
      color: #cbd5e1;
      line-height: 1.7;
      margin-bottom: 28px;
      font-style: italic;
    }
    .cta-button {
      display: block;
      text-align: center;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      font-weight: 800;
      font-size: 15px;
      padding: 14px 24px;
      border-radius: 10px;
      text-decoration: none;
      margin-bottom: 28px;
      letter-spacing: 0.3px;
    }
    .footer {
      text-align: center;
      padding: 20px 40px;
      border-top: 1px solid #1e293b;
      font-size: 12px;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">♟ Chess Academy</div>
      <h1>New Demo Request!</h1>
      <p>A student has requested a free demo class</p>
    </div>
    <div class="body">
      <div class="alert-box">
        🔔 <strong>Action Required:</strong> Please contact this student within 24 hours to confirm their demo class.
      </div>

      <p class="section-title">Student Information</p>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Student Name</div>
          <div class="info-value">${data.studentName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Parent Name</div>
          <div class="info-value">${data.parentName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Email</div>
          <div class="info-value">${data.email}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Phone</div>
          <div class="info-value">${data.phone}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Age</div>
          <div class="info-value">${data.age} years</div>
        </div>
        <div class="info-item">
          <div class="info-label">City</div>
          <div class="info-value">${data.city}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Chess Experience</div>
          <div class="info-value">${data.chessExperience}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Preferred Time</div>
          <div class="info-value">${data.preferredTime}</div>
        </div>
        ${
          data.message
            ? `<div class="info-item full-width">
          <div class="info-label">Message from Parent/Student</div>
        </div>`
            : ""
        }
      </div>

      ${
        data.message
          ? `<div class="message-box">"${data.message}"</div>`
          : ""
      }

      <p class="section-title">Submission Details</p>
      <div class="info-grid">
        <div class="info-item full-width">
          <div class="info-label">Submitted At</div>
          <div class="info-value">${data.submittedAt}</div>
        </div>
      </div>

      <a href="mailto:${data.email}" class="cta-button">
        📧 Reply to Student
      </a>
    </div>
    <div class="footer">
      <p>This is an automated notification from your Chess Academy backend system.</p>
      <p style="margin-top: 6px;">© ${new Date().getFullYear()} Chess Academy. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
