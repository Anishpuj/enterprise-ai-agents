from database import init_db, get_db, User, Organization
from auth import get_password_hash
import uuid

def setup_demo_user():
    """Create demo user and organization for testing"""
    init_db()
    
    db = next(get_db())
    
    # Create demo organization
    org = Organization(
        id=str(uuid.uuid4()),
        name="Demo Organization",
        plan="enterprise",
        max_requests=10000
    )
    db.add(org)
    
    # Create demo user
    user = User(
        id=str(uuid.uuid4()),
        email="demo@enterprise.com",
        password_hash="demo123_hash",  # Simple hash for demo
        organization_id=org.id,
        api_key="demo-api-key-12345",
        is_active=True
    )
    db.add(user)
    
    db.commit()
    
    print(f"✅ Demo user created:")
    print(f"   Email: demo@enterprise.com")
    print(f"   Password: demo123")
    print(f"   API Key: demo-api-key-12345")
    print(f"   Organization: {org.name}")
    print(f"   Plan: {org.plan}")
    print(f"   Max Requests: {org.max_requests}")

if __name__ == "__main__":
    setup_demo_user()
