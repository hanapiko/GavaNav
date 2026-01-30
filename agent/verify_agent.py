import sys
import os
import json
from rich import print as rprint

# Add current dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models import AgentInput, UserProfile, ServiceRequest, SessionContext
from app.graph import GavaNavAgent

def test_agent():
    print("Initializing Agent...")
    agent = GavaNavAgent()
    
    # Test Case: Passport Application
    input_payload = {
        "user_profile": {
            "county": "Nairobi",
            "sub_county": "Westlands",
            "age": 25,
            "citizenship_status": "kenyan_citizen",
            "application_type": "first_time"
        },
        "service_request": {
            "service_category": "identity",
            "service_name": "Kenyan Passport",
            "urgency_level": "normal"
        },
        "session_context": {
            "language_preference": "en",
            "device_type": "desktop",
            "timestamp": "2023-10-27T10:00:00Z"
        }
    }
    
    # Validating Input Model (normally done by FastAPI)
    valid_input = AgentInput(**input_payload)
    
    initial_state = {"input_data": valid_input}
    
    print("\nInvoking Agent...")
    result = agent.invoke(initial_state)
    
    final = result.get("final_response")
    err = result.get("error")
    
    if err:
        rprint(f"[bold red]Error:[/bold red] {err}")
    elif final:
        rprint("[bold green]Success![/bold green]")
        print(json.dumps(final, indent=2))
    else:
        rprint("[bold yellow]No response and no error?[/bold yellow]")
        print(result)

if __name__ == "__main__":
    test_agent()
