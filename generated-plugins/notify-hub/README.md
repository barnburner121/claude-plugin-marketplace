# notify-hub

**Set up notification services (email/SMS/push), create templates, and build notification pipelines with user preferences.**

Category: Communication

---

## Features

### Free Tier
- **Service Setup** -- Configure notification providers for email (SendGrid, SES, Mailgun), SMS (Twilio, SNS), and push notifications (Firebase, APNs) with generated service classes, config files, and environment templates.
- **Template Creation** -- Build reusable notification templates with variable interpolation, conditional content, and multi-channel support. Includes HTML email templates, SMS text templates, and push notification payloads.

### Pro Tier
- **Notification Pipelines** -- Build complete notification pipelines with intelligent routing, user preference management, rate limiting, retry logic, and delivery tracking across all channels.
- Everything in Free, with unlimited requests.

---

## Installation

```
/plugin install notify-hub@barnburner121
```

---

## Usage Examples

**Set up email notifications:**
> "Configure SendGrid for transactional emails in my Node.js project."

**Create templates:**
> "Create a welcome email template and an order confirmation SMS template with variable placeholders."

**Build a notification pipeline (Pro):**
> "Build a notification pipeline that routes alerts to email or SMS based on user preferences, with retry logic and rate limiting."

---

## Pricing

| Plan       | Price       | Requests       | Features                        |
|------------|-------------|----------------|---------------------------------|
| Free       | $0          | 50 req/day     | notify_setup_service, notify_create_templates |
| Pro        | $9/mo       | Unlimited      | All tools including notify_build_pipeline |
| Enterprise | $49/mo      | Unlimited + SLA| Priority support, custom channel integrations |

---

## License

MIT
