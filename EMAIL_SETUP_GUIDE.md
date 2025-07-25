# DriveLink Auto - Email Setup Guide

This guide will help you set up email functionality for your DriveLink Auto website using your company email addresses.

## 🏢 Your Company Email Configuration

Based on your hosting details, your email addresses are:

- **Main Email**: info@drivelinkauto.co.za
- **Sales Email**: sales@drivelinkauto.co.za  
- **Service Email**: service@drivelinkauto.co.za
- **Support Email**: support@drivelinkauto.co.za

## 📧 Email Server Settings

**SMTP Configuration** (from your hosting provider):
- **Host**: mail.drivelinkauto.co.za
- **POP3 Host**: mail.drivelinkauto.co.za
- **SMTP Host**: mail.drivelinkauto.co.za
- **Username**: Your email address (e.g., info@drivelinkauto.co.za)
- **Password**: As specified in your cPanel

## 🚀 Setting Up EmailJS (Recommended for Contact Forms)

EmailJS allows your contact forms to send emails directly from the frontend without a backend server.

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail**: If you want to use a Gmail account
   - **Outlook**: If you want to use Outlook
   - **Custom SMTP**: Use your hosting email server

#### For Custom SMTP (Recommended):
- **Service ID**: `service_drivelink`
- **SMTP Server**: `mail.drivelinkauto.co.za`
- **Port**: `587` (or `465` for SSL)
- **Username**: `info@drivelinkauto.co.za`
- **Password**: Your email password from cPanel
- **Secure**: `false` for port 587, `true` for port 465

### Step 3: Create Email Templates

Create these 4 templates in EmailJS:

#### 1. Contact Form Template (`template_contact`)
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px; text-align: center;">
    <h1>DriveLink Auto</h1>
    <h2>New Contact Form Submission</h2>
  </div>
  <div style="padding: 20px; background: #f9f9f9;">
    <p><strong>Customer Name:</strong> {{from_name}}</p>
    <p><strong>Email:</strong> <a href="mailto:{{from_email}}">{{from_email}}</a></p>
    <p><strong>Phone:</strong> <a href="tel:{{phone}}">{{phone}}</a></p>
    <p><strong>Service Interest:</strong> {{service}}</p>
    <p><strong>Subject:</strong> {{subject}}</p>
    <div style="background: white; padding: 15px; border-left: 4px solid #2a5298; margin: 15px 0;">
      <strong>Message:</strong><br>
      {{message}}
    </div>
    <p style="color: #666; font-size: 12px;">Sent from: {{website}}</p>
  </div>
</div>
```

#### 2. Quote Request Template (`template_quote`)
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px; text-align: center;">
    <h1>DriveLink Auto</h1>
    <h2>Vehicle Quote Request</h2>
  </div>
  <div style="padding: 20px; background: #f9f9f9;">
    <h3 style="color: #2a5298;">Customer Information</h3>
    <p><strong>Name:</strong> {{from_name}}</p>
    <p><strong>Email:</strong> <a href="mailto:{{from_email}}">{{from_email}}</a></p>
    <p><strong>Phone:</strong> <a href="tel:{{phone}}">{{phone}}</a></p>
    
    <h3 style="color: #2a5298;">Vehicle Details</h3>
    <p><strong>Vehicle:</strong> {{vehicle_year}} {{vehicle_make}} {{vehicle_model}}</p>
    <p><strong>Budget Range:</strong> {{budget_range}}</p>
    <p><strong>Financing Needed:</strong> {{financing_needed}}</p>
    <p><strong>Trade-in Vehicle:</strong> {{trade_in}}</p>
    
    <div style="background: white; padding: 15px; border-left: 4px solid #2a5298; margin: 15px 0;">
      <strong>Additional Notes:</strong><br>
      {{additional_notes}}
    </div>
  </div>
</div>
```

#### 3. Service Appointment Template (`template_service`)
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px; text-align: center;">
    <h1>DriveLink Auto</h1>
    <h2>Service Appointment Request</h2>
  </div>
  <div style="padding: 20px; background: #f9f9f9;">
    <h3 style="color: #2a5298;">Customer Information</h3>
    <p><strong>Name:</strong> {{from_name}}</p>
    <p><strong>Email:</strong> <a href="mailto:{{from_email}}">{{from_email}}</a></p>
    <p><strong>Phone:</strong> <a href="tel:{{phone}}">{{phone}}</a></p>
    
    <h3 style="color: #2a5298;">Service Details</h3>
    <p><strong>Service Type:</strong> {{service_type}}</p>
    <p><strong>Vehicle:</strong> {{vehicle_info}}</p>
    <p><strong>Preferred Date:</strong> {{preferred_date}}</p>
    <p><strong>Preferred Time:</strong> {{preferred_time}}</p>
    
    <div style="background: white; padding: 15px; border-left: 4px solid #2a5298; margin: 15px 0;">
      <strong>Service Description:</strong><br>
      {{description}}
    </div>
  </div>
</div>
```

#### 4. Newsletter Template (`template_newsletter`)
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px; text-align: center;">
    <h1>DriveLink Auto</h1>
    <h2>New Newsletter Subscription</h2>
  </div>
  <div style="padding: 20px; background: #f9f9f9;">
    <p><strong>Subscriber Name:</strong> {{subscriber_name}}</p>
    <p><strong>Email Address:</strong> <a href="mailto:{{subscriber_email}}">{{subscriber_email}}</a></p>
    <p><strong>Subscription Date:</strong> {{subscription_date}}</p>
    <p style="color: #666; font-size: 12px;">Add this subscriber to your mailing list.</p>
  </div>
</div>
```

### Step 4: Get Your Public Key
1. In EmailJS dashboard, go to "Account"
2. Copy your "Public Key"

### Step 5: Update Configuration
Update the file `src/app/config/email.config.ts` with your EmailJS credentials:

```typescript
emailJS: {
  serviceId: 'your_actual_service_id',
  templateIds: {
    contact: 'template_contact',
    quote: 'template_quote',
    service: 'template_service',
    newsletter: 'template_newsletter'
  },
  publicKey: 'your_actual_public_key'
}
```

## 📱 Setting Up Email Accounts in cPanel

1. Log into your cPanel: https://cp62.domains.co.za:2083
2. Username: `driveli2`
3. Password: `8-0U-9CnAxyB0i`

### Create Email Accounts:
1. Go to "Email Accounts"
2. Create these accounts:
   - info@drivelinkauto.co.za
   - sales@drivelinkauto.co.za
   - service@drivelinkauto.co.za
   - support@drivelinkauto.co.za

## 📧 Email Client Setup

Configure your email client (Outlook, Thunderbird, etc.) with these settings:

**Incoming Mail (POP3/IMAP):**
- Server: mail.drivelinkauto.co.za
- Port: 995 (POP3 SSL) or 993 (IMAP SSL)
- Security: SSL/TLS

**Outgoing Mail (SMTP):**
- Server: mail.drivelinkauto.co.za
- Port: 465 (SSL) or 587 (TLS)
- Security: SSL/TLS
- Authentication: Required

## 🔧 Testing Your Setup

1. Fill out the contact form on your website
2. Check if emails are received in your inbox
3. Test all email links (mailto links should open your email client)
4. Verify newsletter subscription works

## 🚨 Important Security Notes

1. **Never store email passwords in your frontend code**
2. **Use environment variables for sensitive data**
3. **Enable two-factor authentication on your email accounts**
4. **Regularly update your passwords**
5. **Monitor your email usage to prevent spam**

## 📞 Support

If you need help with setup:
- **EmailJS Support**: https://www.emailjs.com/docs/
- **Hosting Support**: Contact domains.co.za
- **Developer Support**: Contact your web developer

## ✅ Checklist

- [ ] EmailJS account created
- [ ] Email service configured in EmailJS
- [ ] All 4 email templates created
- [ ] Public key obtained
- [ ] Configuration file updated
- [ ] Email accounts created in cPanel
- [ ] Email client configured
- [ ] Contact form tested
- [ ] All email links tested
- [ ] Newsletter subscription tested

---

**Your website is now configured to use your company email addresses for all communications!**