"""
Daily question allowances.

Signed-in users are recognised by the login token the frontend sends.
Everyone else is a guest, recognised by a scrambled (hashed) version of
their IP address, so we never store anyone's real IP.

Counts live in Supabase (ask_usage table), so they survive restarts and
are shared by every copy of the backend once it's deployed.
"""

import hashlib
import logging
import os
from dataclasses import dataclass

from fastapi import Request
from slowapi.util import get_remote_address

from supabase_client import supabase

logger = logging.getLogger("pcos-api.allowance")

GUEST_DAILY_LIMIT = int(os.getenv("GUEST_DAILY_LIMIT", "3"))
USER_DAILY_LIMIT = int(os.getenv("USER_DAILY_LIMIT", "15"))

# A secret mixed into the IP before hashing, so the stored values can't be
# reversed by trying every possible IP. Any long random string works.
USAGE_SALT = os.getenv("USAGE_SALT", "")
if not USAGE_SALT:
    logger.warning("USAGE_SALT is not set; guest IP hashes are weaker without it")


@dataclass
class Asker:
    subject: str  # what we count against: "user:<id>" or "guest:<hash>"
    is_guest: bool
    limit: int


def identify(request: Request) -> Asker:
    """Works out who is asking: a signed-in user, or a guest."""
    auth = request.headers.get("authorization", "")
    if auth.lower().startswith("bearer "):
        token = auth[7:]
        try:
            user = supabase.auth.get_user(token).user
            if user:
                return Asker(f"user:{user.id}", False, USER_DAILY_LIMIT)
        except Exception:
            # Expired or fake token: just treat them as a guest
            logger.info("Invalid or expired token, treating request as a guest")

    ip = get_remote_address(request)
    hashed = hashlib.sha256(f"{USAGE_SALT}{ip}".encode()).hexdigest()[:32]
    return Asker(f"guest:{hashed}", True, GUEST_DAILY_LIMIT)


def use(asker: Asker) -> tuple[bool, int | None]:
    """
    Uses one question. Returns (allowed, questions_left).
    If Supabase can't be reached, the question is allowed: the per-minute
    rate limit still protects us, and answering needs Supabase anyway.
    """
    try:
        left = supabase.rpc(
            "use_ask_allowance",
            {"p_subject": asker.subject, "p_limit": asker.limit},
        ).execute().data
        if left == -1:
            return False, 0
        return True, left
    except Exception:
        logger.exception("Allowance check failed, allowing the question")
        return True, None


def refund(asker: Asker) -> None:
    """Gives a question back when the failure was our fault."""
    try:
        supabase.rpc("refund_ask_allowance", {"p_subject": asker.subject}).execute()
    except Exception:
        logger.exception("Allowance refund failed")


def limit_message(asker: Asker) -> str:
    if asker.is_guest:
        return (
            f"You've used your {asker.limit} free questions for today. "
            "Sign in for more, or come back tomorrow."
        )
    return f"You've used today's {asker.limit} questions. Orchid will be ready for more tomorrow."