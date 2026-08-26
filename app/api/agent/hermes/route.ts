import { NextRequest, NextResponse } from "next/server";
import { authenticateAgentRequest, getAgentContext } from "@/lib/dal/agent";
import { executeAgentAction } from "@/lib/actions/agent";

export const dynamic = "force-dynamic";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
};

/**
 * GET /api/agent/hermes
 * Protected endpoint returning live contextual intelligence for Hermes / external AI agents.
 * Strictly requires 'Authorization: Bearer <API_KEY>' header.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const auth = await authenticateAgentRequest(authHeader);

  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message:
          "Invalid or missing API Key. Include 'Authorization: Bearer <API_KEY>' header with your request.",
      },
      { status: 401, headers: JSON_HEADERS },
    );
  }

  try {
    const context = await getAgentContext(auth.userId);
    return NextResponse.json(
      {
        ok: true,
        authMethod: auth.authMethod,
        context,
      },
      { status: 200, headers: JSON_HEADERS },
    );
  } catch (error) {
    console.error("GET /api/agent/hermes error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to retrieve agent context." },
      { status: 500, headers: JSON_HEADERS },
    );
  }
}

/**
 * POST /api/agent/hermes
 * Protected endpoint allowing Hermes / external AI agents to perform structured operations.
 * Strictly requires 'Authorization: Bearer <API_KEY>' header.
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const auth = await authenticateAgentRequest(authHeader);

  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message:
          "Invalid or missing API Key. Include 'Authorization: Bearer <API_KEY>' header with your request.",
      },
      { status: 401, headers: JSON_HEADERS },
    );
  }

  try {
    const rawText = await req.text();
    const body = JSON.parse(rawText);
    const result = await executeAgentAction(auth.userId, body);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400, headers: JSON_HEADERS },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        authMethod: auth.authMethod,
        result: result.data,
      },
      { status: 200, headers: JSON_HEADERS },
    );
  } catch (error) {
    console.error("POST /api/agent/hermes error:", error);
    return NextResponse.json(
      { ok: false, error: "Malformed request payload." },
      { status: 400, headers: JSON_HEADERS },
    );
  }
}
