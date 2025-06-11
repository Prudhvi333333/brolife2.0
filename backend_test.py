import requests
import unittest
import uuid
import json
from datetime import datetime

class BrolifeAPITester:
    def __init__(self, base_url="https://e4b85ed5-07e0-40ef-b7f3-7cc549d0a48d.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_id = f"test_user_{uuid.uuid4().hex[:8]}"
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            
            # Try to get JSON response, but handle cases where it's not JSON
            try:
                response_data = response.json()
                response_text = json.dumps(response_data, indent=2)
            except:
                response_data = {}
                response_text = response.text[:200] + "..." if len(response.text) > 200 else response.text
            
            result = {
                "name": name,
                "success": success,
                "status_code": response.status_code,
                "expected_status": expected_status,
                "response": response_text
            }
            
            self.test_results.append(result)
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                print(f"Response: {response_text}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response_text}")

            return success, response_data

        except Exception as e:
            error_msg = str(e)
            print(f"❌ Failed - Error: {error_msg}")
            self.test_results.append({
                "name": name,
                "success": False,
                "error": error_msg
            })
            return False, {}

    def test_health_check(self):
        """Test the health check endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )

    def test_user_setup(self):
        """Test user setup endpoint"""
        data = {
            "user_id": self.test_user_id,
            "bro_name": "TestBro",
            "goals": ["Learn Python", "Get fit", "Build a startup"],
            "preferences": "I prefer working in the morning"
        }
        return self.run_test(
            "User Setup",
            "POST",
            "api/user/setup",
            200,
            data=data
        )

    def test_get_user(self):
        """Test get user endpoint"""
        return self.run_test(
            "Get User",
            "GET",
            f"api/user/{self.test_user_id}",
            200
        )

    def test_chat(self):
        """Test chat endpoint"""
        data = {
            "message": "Hello, can you help me be more productive?",
            "user_id": self.test_user_id
        }
        return self.run_test(
            "Chat with AI",
            "POST",
            "api/chat",
            200,
            data=data
        )

    def test_generate_timetable(self):
        """Test timetable generation endpoint"""
        data = {
            "goals": ["Learn Python", "Get fit", "Build a startup"],
            "preferences": "I prefer working in the morning",
            "user_id": self.test_user_id
        }
        return self.run_test(
            "Generate Timetable",
            "POST",
            "api/generate-timetable",
            200,
            data=data
        )

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Brolife API Tests")
        print(f"Base URL: {self.base_url}")
        print(f"Test User ID: {self.test_user_id}")
        print("=" * 50)
        
        # Run tests in sequence
        self.test_health_check()
        self.test_user_setup()
        self.test_get_user()
        self.test_chat()
        self.test_generate_timetable()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Tests Summary: {self.tests_passed}/{self.tests_run} passed")
        
        # Print detailed results
        print("\n📋 Detailed Test Results:")
        for i, result in enumerate(self.test_results, 1):
            status = "✅ PASSED" if result.get("success") else "❌ FAILED"
            print(f"{i}. {result.get('name')}: {status}")
            if not result.get("success") and "error" in result:
                print(f"   Error: {result.get('error')}")
        
        return self.tests_passed == self.tests_run

if __name__ == "__main__":
    tester = BrolifeAPITester()
    tester.run_all_tests()
