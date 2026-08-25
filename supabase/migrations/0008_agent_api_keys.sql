-- Migration 0008: Agent API Keys for Protected External AI Agent Integration
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS agent_api_key TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_profiles_agent_api_key 
ON profiles(agent_api_key);
