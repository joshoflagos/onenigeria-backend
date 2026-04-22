export const welcomeTemplate = (fullname: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .features { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
    .features ul { padding-left: 20px; }
    .features li { margin: 10px 0; }
    .signature { margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to the Movement!</h2>
    <p>Dear ${fullname},</p>
    <p>Welcome — and thank you for joining us.</p>
    <p>We're excited to have you on board. By signing up, you've taken an important step toward shaping the future we believe in. This platform was created to connect committed members, volunteers, and supporters like you into one coordinated, action-driven community.</p>
    
    <div class="features">
      <h3>Here's what you can do inside the app:</h3>
      <ul>
        <li>Stay updated with official announcements and campaign news</li>
        <li>Connect with your ward, LGA, and state coordinators</li>
        <li>Participate in events, town halls, and grassroots activities</li>
        <li>Receive timely voting and mobilization alerts</li>
        <li>Track your engagement and impact</li>
        <li>PVC registration, transfer and collection support</li>
        <li>Election tracking and more</li>
      </ul>
    </div>
    
    <p>Our strength lies in organization, unity, and action. Through this platform, we are building a structured digital grassroots network that ensures every supporter has a voice and every effort counts.</p>
    
    <p>Over the coming days, you'll begin receiving updates tailored to your location and level of engagement. No spamming.</p>
    
    <p>Together, we are not just supporting a cause — we are building a winning movement.</p>
    
    <p>Welcome aboard.</p>
    
    <div class="signature">
      <p>Warm regards,<br>
      <strong>Oluwadamilola Adesanya</strong><br>
      Team Lead<br>
      National Coordinator</p>
    </div>
  </div>
</body>
</html>
`;
