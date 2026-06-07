import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr


def send_email(email: str, code, subject: str = "Tasdiqlash Kodi"):
    sender_email = os.getenv("EMAIL_HOST_USER", "jamolxonyoldashaliyev3@gmail.com")
    sender_name = "OnlineShop"
    receiver_email = email
    password = os.getenv("GMAIL_APP_PASSWORD")

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = formataddr((sender_name, sender_email))
    message["To"] = receiver_email

    html = f"""
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px">
            <div style="max-width:400px; margin:auto; background:#ffffff; padding:20px; border-radius:8px;">
                <h2 style="color:#333; text-align:center;">🔐 {subject}</h2>
                <p style="font-size:16px; color:#555; text-align:center;">
                    Sizning OTP kodingiz:
                </p>
                <div style="font-size:28px; font-weight:bold; letter-spacing:4px; 
                            text-align:center; margin:20px 0; color:#000;">
                    {code}
                </div>
                <p style="font-size:14px; color:#777; text-align:center;">
                    Kod 1 daqiqa amal qiladi.<br>
                    Uni hech kimga bermang.
                </p>
                <hr>
                <p style="font-size:12px; color:#aaa; text-align:center;">
                    OnlineShop
                </p>
            </div>
        </div>
        """

    message.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())