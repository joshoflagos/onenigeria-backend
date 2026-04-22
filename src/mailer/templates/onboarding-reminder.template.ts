export const onboardingReminderTemplate = (
  name: string,
  onboardingLink: string,
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background-color: #4CAF50; 
      color: white; 
      text-decoration: none; 
      border-radius: 5px; 
      margin: 20px 0;
    }
    .footer { margin-top: 30px; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Complete Your Profile</h2>
    <p>Dear ${name},</p>
    <p>Thank you for verifying your email. You're one step away from joining the movement.</p>
    <p>To get started, please complete your profile with your location and contact information. This helps us connect you with your local coordinators and relevant updates.</p>
    <p>
      <a href="${onboardingLink}" class="button">Complete Profile</a>
    </p>
    <p>It only takes 2 minutes and ensures you're properly connected to your ward and polling unit.</p>
    <div class="footer">
      <p>If the button doesn't work, copy and paste this link:<br>
      <a href="${onboardingLink}">${onboardingLink}</a></p>
    </div>
  </div>
</body>
</html>
`;
