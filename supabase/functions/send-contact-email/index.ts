import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactEmailRequest = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    console.log("Sending contact form emails for:", { name, email });

    // Send confirmation email to the user
    const confirmationResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Thanas R <onboarding@resend.dev>",
        to: [email],
        subject: "Thank you for reaching out!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Thank You for Getting in Touch!</h1>
            <p style="color: #666; font-size: 16px;">Hi ${name},</p>
            <p style="color: #666; font-size: 16px;">
              I've received your message and will get back to you as soon as possible.
            </p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #666; font-size: 14px; margin: 0;"><strong>Your message:</strong></p>
              <p style="color: #666; font-size: 14px; margin-top: 10px;">${message}</p>
            </div>
            <p style="color: #666; font-size: 16px;">
              Best regards,<br>
              <strong>Thanas R</strong>
            </p>
          </div>
        `,
      }),
    });

    const confirmationData = await confirmationResponse.json();
    console.log("Confirmation email sent:", confirmationData);

    // Send notification email to you
    const notificationResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ["thanas5.rd@gmail.com"],
        subject: `New Contact Form Message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">New Contact Form Submission</h1>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>Name:</strong> ${name}</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="color: #666; font-size: 14px; margin: 15px 0 5px 0;"><strong>Message:</strong></p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">${message}</p>
            </div>
            <p style="color: #999; font-size: 12px;">
              Reply directly to this person at: <a href="mailto:${email}">${email}</a>
            </p>
          </div>
        `,
        reply_to: email,
      }),
    });

    const notificationData = await notificationResponse.json();
    console.log("Notification email sent:", notificationData);

    return new Response(
      JSON.stringify({ 
        success: true,
        confirmationEmail: confirmationData,
        notificationEmail: notificationData
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
