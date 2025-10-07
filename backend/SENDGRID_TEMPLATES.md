# SendGrid Template Usage Guide

This document explains how to use SendGrid email templates in the project.

## 📧 Available Templates

### 1. Email Verification Template
**File:** `sendgrid-email-template.html`
**Usage:** Email verification after user registration

**Features:**
- Modern gradient header (blue-purple)
- Large verification button
- Alternative link option
- Security warning
- Mobile responsive
- English content

### 2. Welcome Template
**File:** `sendgrid-welcome-template.html`
**Usage:** Welcome message after email verification

**Features:**
- Modern gradient header (green)
- Success badge
- Feature list
- CTA buttons
- Mobile responsive
- English content

## 🚀 SendGrid Dashboard Setup

### Step 1: Create Dynamic Templates

1. **Login to SendGrid Dashboard**
   - Go to https://sendgrid.com/
   - Login to your account

2. **Navigate to Dynamic Templates**
   - Go to Email API > Dynamic Templates
   - Click "Create a Dynamic Template"

3. **Create Verification Template**
   - Name: "Email Verification"
   - Click "Create Template"
   - Click "Add Version"
   - Choose "Code Editor"
   - Copy content from `sendgrid-email-template.html`
   - Click "Save"
   - Note the Template ID (starts with d-)

4. **Create Welcome Template**
   - Name: "Welcome Email"
   - Click "Create Template"
   - Click "Add Version"
   - Choose "Code Editor"
   - Copy content from `sendgrid-welcome-template.html`
   - Click "Save"
   - Note the Template ID (starts with d-)

### Step 2: Update Environment Variables

Add the template IDs to your `.env` file:

```env
SENDGRID_VERIFICATION_TEMPLATE_ID=d-your-verification-template-id
SENDGRID_WELCOME_TEMPLATE_ID=d-your-welcome-template-id
```

## 📝 Dynamic Template Data

### Verification Email Data Structure

```typescript
interface VerificationEmailData {
  username: string;           // User's username
  verification_link: string;  // Full verification URL
  app_name: string;          // Application name
  app_base_url: string;      // Base application URL
}
```

**Example:**
```json
{
  "username": "johndoe",
  "verification_link": "http://localhost:3000/user/verify-email/johndoe/abc123token",
  "app_name": "Email Verification System",
  "app_base_url": "http://localhost:3000"
}
```

### Welcome Email Data Structure

```typescript
interface WelcomeEmailData {
  username: string;     // User's username
  app_name: string;    // Application name
  app_base_url: string; // Base application URL
}
```

**Example:**
```json
{
  "username": "johndoe",
  "app_name": "Email Verification System",
  "app_base_url": "http://localhost:3000"
}
```

## 🎨 Template Customization

### Color Scheme
- **Primary**: #667eea (Blue)
- **Secondary**: #764ba2 (Purple)
- **Success**: #48bb78 (Green)
- **Text**: #2d3748 (Dark Gray)
- **Background**: #f7fafc (Light Gray)

### Typography
- **Headers**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Body**: Same as headers
- **Button Text**: Bold, White

### Responsive Design
- Mobile-first approach
- Flexible container widths
- Scalable buttons and text
- Optimized for email clients

## 🔧 Template Variables Usage

### In HTML Templates

Use double curly braces for variables:

```html
<h1>Hello {{username}}!</h1>
<a href="{{verification_link}}">Verify Email</a>
<p>Visit {{app_base_url}} to learn more</p>
```

### In Service Code

Pass data object to SendGrid:

```typescript
const msg = {
  to: receiverEmail,
  from: {
    email: fromEmail,
    name: fromName,
  },
  templateId: verificationTemplateId,
  dynamicTemplateData: {
    username: username,
    verification_link: verificationLink,
    app_name: 'Email Verification System',
    app_base_url: appBaseUrl,
  },
};
```

## 🧪 Testing Templates

### SendGrid Test Feature

1. **Go to Dynamic Templates**
2. **Select your template**
3. **Click "Test Data" tab**
4. **Add test JSON data:**

```json
{
  "username": "testuser",
  "verification_link": "http://localhost:3000/user/verify-email/testuser/test123",
  "app_name": "Email Verification System",
  "app_base_url": "http://localhost:3000"
}
```

5. **Click "Send Test"**
6. **Enter your email address**
7. **Check your inbox**

### Local Testing

Use the API endpoints to test:

```bash
# Register a user (triggers verification email)
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"your-email@example.com"}'
```

## 📱 Email Client Compatibility

### Tested Clients
- ✅ Gmail (Web, Mobile)
- ✅ Outlook (Web, Desktop)
- ✅ Apple Mail (iOS, macOS)
- ✅ Yahoo Mail
- ✅ Thunderbird

### Known Issues
- Some older Outlook versions may not display gradients
- Dark mode support varies by client
- Custom fonts may fallback to system fonts

## 🔒 Security Considerations

### Template Security
- Never include sensitive data in templates
- Use HTTPS for all links
- Validate all dynamic data
- Sanitize user inputs

### Link Security
- Verification tokens should be cryptographically secure
- Links should expire after reasonable time
- Use HTTPS for verification URLs
- Log all verification attempts

## 📊 Analytics and Tracking

### SendGrid Analytics
- Open rates
- Click rates
- Bounce rates
- Spam reports

### Custom Tracking
Add UTM parameters to links:

```html
<a href="{{app_base_url}}?utm_source=email&utm_medium=verification&utm_campaign=signup">
  Visit Our App
</a>
```

## 🚨 Troubleshooting

### Common Issues

1. **Template Not Found**
   - Check template ID in `.env`
   - Verify template exists in SendGrid dashboard
   - Ensure template is active

2. **Variables Not Rendering**
   - Check variable names match exactly
   - Verify JSON structure
   - Test with SendGrid test feature

3. **Emails Not Sending**
   - Check API key permissions
   - Verify sender email is verified
   - Check SendGrid activity feed

4. **Styling Issues**
   - Test in multiple email clients
   - Use inline CSS for better compatibility
   - Avoid complex CSS features

### Debug Steps

1. **Check SendGrid Activity**
   - Go to Activity Feed in dashboard
   - Look for delivery status
   - Check for errors or bounces

2. **Test Template Separately**
   - Use SendGrid test feature
   - Send to known good email
   - Check spam folder

3. **Validate Template Data**
   - Log data being sent to template
   - Verify all required fields present
   - Check data types match expected

## 📚 Additional Resources

- [SendGrid Dynamic Templates Documentation](https://docs.sendgrid.com/ui/sending-email/how-to-send-an-email-with-dynamic-transactional-templates)
- [Email Template Best Practices](https://sendgrid.com/blog/email-template-best-practices/)
- [HTML Email Development Guide](https://www.campaignmonitor.com/dev-resources/guides/coding/)

---

**Note**: Keep templates updated with your brand guidelines and test thoroughly across different email clients before production deployment.