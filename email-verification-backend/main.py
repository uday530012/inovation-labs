from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

import os
import random
import time
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


# =====================================================
# LOAD ENVIRONMENT VARIABLES
# =====================================================

load_dotenv()

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


# =====================================================
# FASTAPI
# =====================================================

app = FastAPI(
    title="INNOVATION LABS Email Verification API"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# OTP STORAGE
# =====================================================

otp_storage = {}


# =====================================================
# REQUEST MODELS
# =====================================================

class EmailRequest(BaseModel):
    email: str


class VerifyOTPRequest(BaseModel):
    email: str
    otp: str


# =====================================================
# SEND EMAIL FUNCTION
# =====================================================

def send_otp_email(receiver_email, otp):

    subject = "INNOVATION LABS - Email Verification OTP"

    message = f"""
Hello,

Thank you for contacting INNOVATION LABS.

Your email verification OTP is:

{otp}

This OTP is valid for 5 minutes.

Please do not share this OTP with anyone.

Regards,
INNOVATION LABS
Hyderabad, Telangana, India
"""

    email_message = MIMEMultipart()

    email_message["From"] = SMTP_EMAIL
    email_message["To"] = receiver_email
    email_message["Subject"] = subject

    email_message.attach(
        MIMEText(message, "plain")
    )

    with smtplib.SMTP(
        "smtp.gmail.com",
        587
    ) as server:

        server.starttls()

        server.login(
            SMTP_EMAIL,
            SMTP_PASSWORD
        )

        server.sendmail(
            SMTP_EMAIL,
            receiver_email,
            email_message.as_string()
        )


# =====================================================
# SEND OTP
# =====================================================

@app.post("/send-otp")
def send_otp(data: EmailRequest):

    email = data.email.strip().lower()

    otp = str(
        random.randint(100000, 999999)
    )

    expiry_time = time.time() + 300

    otp_storage[email] = {
        "otp": otp,
        "expiry": expiry_time
    }

    try:

        send_otp_email(
            email,
            otp
        )

        print()
        print("====================================")
        print("OTP SENT SUCCESSFULLY")
        print("Email:", email)
        print("====================================")
        print()

        return {
            "success": True,
            "message": "OTP sent successfully to your email."
        }

    except Exception as error:

        print()
        print("====================================")
        print("EMAIL ERROR")
        print(error)
        print("====================================")
        print()

        return {
            "success": False,
            "message": "Unable to send OTP email."
        }


# =====================================================
# VERIFY OTP
# =====================================================

@app.post("/verify-otp")
def verify_otp(data: VerifyOTPRequest):

    email = data.email.strip().lower()
    otp = data.otp.strip()

    if email not in otp_storage:

        return {
            "success": False,
            "message": "OTP not found. Please request a new OTP."
        }

    stored_data = otp_storage[email]

    if time.time() > stored_data["expiry"]:

        del otp_storage[email]

        return {
            "success": False,
            "message": "OTP has expired. Please request a new OTP."
        }

    if otp != stored_data["otp"]:

        return {
            "success": False,
            "message": "Invalid OTP."
        }

    del otp_storage[email]

    return {
        "success": True,
        "message": "Email verified successfully."
    }


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():

    return {
        "message": "INNOVATION LABS Email Verification API is running."
    }