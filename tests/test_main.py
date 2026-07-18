import os
import pytest
from main import get_system_prompt, DEFAULT_SYSTEM_PROMPT

def test_get_system_prompt_default(monkeypatch):
    """Test that get_system_prompt returns the default prompt when env var is not set."""
    monkeypatch.delenv("SYSTEM_PROMPT", raising=False)
    assert get_system_prompt() == DEFAULT_SYSTEM_PROMPT

def test_get_system_prompt_custom(monkeypatch):
    """Test that get_system_prompt returns the custom prompt when SYSTEM_PROMPT env var is set."""
    custom_prompt = "You are a custom network assistant."
    monkeypatch.setenv("SYSTEM_PROMPT", custom_prompt)
    assert get_system_prompt() == custom_prompt
