import { NextResponse } from 'next/server';
import transporter from '@/config/email-config';
import { SITE_EMAIL } from '@/content/contact';

type ContactBody = {
    fullname?: string;
    email?: string;
    message?: string;
};

function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function validate(body: ContactBody): string[] {
    const errors: string[] = [];
    if (!body.fullname || body.fullname.trim().length < 2) {
        errors.push('Full name must be at least 2 characters long');
    }
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        errors.push('Please provide a valid email address');
    }
    if (!body.message || body.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    return errors;
}

async function sendViaNodemailer(fullname: string, email: string, message: string) {
    const user = process.env.NEXT_EMAIL_USER;
    const pass = process.env.NEXT_EMAIL_PASS;
    if (!user || !pass) return false;

    const safeName = escapeHtml(fullname);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');

    await transporter.sendMail({
        from: `"Vitaway Website" <${user}>`,
        to: SITE_EMAIL,
        replyTo: email,
        subject: `Website contact from ${fullname}`,
        text: `New contact message\n\nName: ${fullname}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
            <h2>New contact message</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Message:</strong></p>
            <blockquote>${safeMessage}</blockquote>
        `,
    });

    return true;
}

async function sendViaFormSubmit(fullname: string, email: string, message: string) {
    const response = await fetch(`https://formsubmit.co/ajax/${SITE_EMAIL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            name: fullname,
            email,
            message,
            _replyto: email,
            _subject: `Website contact from ${fullname}`,
            _template: 'table',
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to deliver contact message');
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ContactBody;
        const errors = validate(body);
        if (errors.length > 0) {
            return NextResponse.json({ message: errors.join(', ') }, { status: 400 });
        }

        const fullname = body.fullname!.trim();
        const email = body.email!.trim();
        const message = body.message!.trim();

        const sentWithSmtp = await sendViaNodemailer(fullname, email, message);
        if (!sentWithSmtp) {
            await sendViaFormSubmit(fullname, email, message);
        }

        return NextResponse.json({
            message: 'Your message has been sent successfully. Thank you for contacting us!',
            data: { id: crypto.randomUUID(), status: 'sent' },
            status: 'success',
        });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            {
                message: `Could not send your message right now. Please email ${SITE_EMAIL} or try WhatsApp.`,
            },
            { status: 500 },
        );
    }
}
