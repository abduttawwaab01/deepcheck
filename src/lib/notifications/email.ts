interface EmailConfig {
  smtpHost: string;
  smtpPort: string;
  fromAddress: string;
  username: string;
  password: string;
}

function getConfig(): EmailConfig {
  return {
    smtpHost: process.env.SMTP_HOST || "smtp.sendgrid.net",
    smtpPort: process.env.SMTP_PORT || "587",
    fromAddress: process.env.FROM_EMAIL || "noreply@deepcheck.app",
    username: process.env.SMTP_USERNAME || "",
    password: process.env.SMTP_PASSWORD || "",
  };
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const config = getConfig();
  if (!config.username || !config.password) {
    console.warn(`[EMAIL] SMTP not configured. Skipping email to ${message.to}: "${message.subject}". Set SMTP_USERNAME and SMTP_PASSWORD environment variables to enable email delivery.`);
    return false;
  }

  try {
    const NodemailerTransport = new Function('return import("nodemailer")') as () => Promise<any>;
    const nodemailer = await NodemailerTransport().catch(() => null);
    if (!nodemailer?.default) {
      console.error(`[EMAIL] nodemailer package not installed. Cannot send email to ${message.to}: "${message.subject}". Run: npm install nodemailer`);
      return false;
    }
    const transporter = nodemailer.default.createTransport({
      host: config.smtpHost,
      port: parseInt(config.smtpPort),
      secure: parseInt(config.smtpPort) === 465,
      auth: { user: config.username, pass: config.password },
    });

    await transporter.sendMail({
      from: config.fromAddress,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
    console.log(`[EMAIL] Sent successfully to ${message.to}: "${message.subject}"`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Failed to send to ${message.to}: "${message.subject}"`, error);
    return false;
  }
}

export function welcomeEmail(name: string, role: string): EmailMessage & { subject: string } {
  return {
    to: "",
    subject: "Welcome to Deep Check!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Welcome to Deep Check, ${name}!</h1>
        <p>Your account has been created as a <strong>${role}</strong>.</p>
        <p>Deep Check uses advanced psychometric analysis (Item Response Theory) to provide the most accurate assessment of your learning gaps.</p>
        <h2>Getting Started:</h2>
        <ul>
          <li>Take your first diagnostic assessment</li>
          <li>Review your detailed learning report</li>
          <li>Follow your personalized study plan</li>
        </ul>
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_URL || "https://deepcheck.app"}/auth/login" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
            Log In to Your Dashboard
          </a>
        </p>
        <p style="color: #666; margin-top: 30px;">Best regards,<br>The Deep Check Team</p>
      </div>
    `,
  };
}

export function assessmentCompleteEmail(name: string, score: number, category: string): EmailMessage & { subject: string } {
  const categoryEmoji: Record<string, string> = {
    mastered: "🏆", strong: "💪", competent: "👍",
    developing: "📈", weak: "⚡", critical: "🎯",
  };
  return {
    to: "",
    subject: `Assessment Complete - Your Score: ${score}%`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">${categoryEmoji[category] || "📊"} Assessment Complete!</h1>
        <p>Hi ${name},</p>
        <p>You've completed your diagnostic assessment. Here are your results:</p>
        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
          <div style="font-size: 48px; font-weight: bold; color: #2563eb;">${score}%</div>
          <div style="font-size: 18px; color: #64748b; text-transform: capitalize;">${category}</div>
        </div>
        <p>Your detailed report is ready with personalized recommendations for improvement.</p>
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_URL || "https://deepcheck.app"}/student/reports" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
            View Your Report
          </a>
        </p>
      </div>
    `,
  };
}

export function reportReadyEmail(name: string, reportType: string): EmailMessage & { subject: string } {
  return {
    to: "",
    subject: `Your ${reportType} Report is Ready!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">📄 Your Report is Ready!</h1>
        <p>Hi ${name},</p>
        <p>Your ${reportType} report has been generated with AI-powered insights.</p>
        <p>This includes:</p>
        <ul>
          <li>Detailed concept mastery analysis</li>
          <li>Cognitive profile assessment</li>
          <li>Personalized study plan</li>
          <li>Recommended learning resources</li>
        </ul>
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_URL || "https://deepcheck.app"}/student/reports" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
            View Your Report
          </a>
        </p>
      </div>
    `,
  };
}

export function weeklyDigestEmail(
  name: string,
  data: { assessmentsTaken: number; avgScore: number; topWeakness: string; streak: number }
): EmailMessage & { subject: string } {
  return {
    to: "",
    subject: `Your Weekly Learning Digest - ${data.assessmentsTaken} assessments this week`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">📊 Weekly Learning Digest</h1>
        <p>Hi ${name},</p>
        <p>Here's your learning progress this week:</p>
        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <div style="display: flex; justify-content: space-around; text-align: center;">
            <div>
              <div style="font-size: 32px; font-weight: bold; color: #2563eb;">${data.assessmentsTaken}</div>
              <div style="color: #64748b;">Assessments</div>
            </div>
            <div>
              <div style="font-size: 32px; font-weight: bold; color: #16a34a;">${data.avgScore}%</div>
              <div style="color: #64748b;">Avg Score</div>
            </div>
            <div>
              <div style="font-size: 32px; font-weight: bold; color: #f59e0b;">${data.streak}</div>
              <div style="color: #64748b;">Day Streak</div>
            </div>
          </div>
        </div>
        ${data.topWeakness ? `<p><strong>Focus area:</strong> ${data.topWeakness}</p>` : ""}
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_URL || "https://deepcheck.app"}/student" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
            Continue Learning
          </a>
        </p>
      </div>
    `,
  };
}
