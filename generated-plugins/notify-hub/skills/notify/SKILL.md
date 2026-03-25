# notify

## Description

The notify skill helps set up notification services across multiple channels (email, SMS, push notifications), create reusable notification templates, and build notification pipelines with user preference management. Use this skill whenever the user asks about sending notifications, creating email/SMS templates, or building notification workflows.

## Allowed Tools

Read, Write, Edit, Bash, Grep, Glob

## Tools

### notify_setup_service
Use this tool to set up and configure notification service integrations for email (SendGrid, SES, Mailgun), SMS (Twilio, SNS), and push notifications (Firebase, APNs). It generates the configuration files, service classes, and environment variable templates needed to send notifications. Invoke this when the user asks to "set up email notifications," "configure SMS sending," "add push notifications," or "integrate a notification provider."

### notify_create_templates
Use this tool to create reusable notification templates with variable interpolation, conditional content, and multi-channel support. It generates HTML email templates, SMS text templates, and push notification payloads with consistent branding. Invoke this when the user asks to "create a notification template," "design an email template," "build an SMS template," or "set up notification content."

### notify_build_pipeline (Pro)
Use this tool to build complete notification pipelines that handle routing, user preferences, rate limiting, retry logic, and delivery tracking. It generates the orchestration code, preference management schemas, and queue configurations for reliable multi-channel notification delivery. Invoke this when the user asks to "build a notification pipeline," "set up notification routing," "handle user notification preferences," or "create a reliable notification system." This is a Pro-tier tool.

## Workflow

1. Use `notify_setup_service` to configure the notification providers your project needs.
2. Use `notify_create_templates` to build reusable templates for each notification type.
3. Use `notify_build_pipeline` to wire everything together with routing, preferences, and reliability (Pro users).
