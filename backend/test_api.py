import unittest
from main import create_app
from config import TestConfig
from exts import db

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.client = self.app.test_client(self)
        
        with self.app.app_context():            
            db.create_all()

    # AUTHENTICATION TESTS

    # Test the signup endpoint
    def test_signup(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        self.assertEqual(signup_response.status_code, 201)

    # Test the login endpoint
    def test_login(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )
        self.assertEqual(login_response.status_code, 200)

    # Test the refresh access token endpoint
    def test_get_fresh_token(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )
        refresh_response=self.client.post('/Authentification/refresh', headers={
            "Authorization": f"Bearer {login_response.json['refresh_token']}"
        })
        self.assertEqual(refresh_response.status_code, 200)

    # ACCOUNT TESTS
    
    # Test the get account details endpoint
    def test_get_account(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )

        get_account_response=self.client.get('/Account/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"} )
        
        self.assertEqual(get_account_response.status_code, 200)

    # Test the create API key endpoint
    def test_create_api_key(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )

        create_api_key_response=self.client.post('/Account/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"},
            json={
                "api_key": "123",
                "account_id": 1
            })
        self.assertEqual(create_api_key_response.status_code, 201)

    # Test update username endpoint
    def test_update_username(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )

        update_username_response=self.client.put('/Account/username/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"},
            json={
                "username": "test_user1234"
            })
        self.assertEqual(update_username_response.status_code, 200)

    # Test update name endpoint
    def test_update_name(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )

        update_name_response=self.client.put('/Account/name/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"},
            json={
                "name": "test name"
            })
        self.assertEqual(update_name_response.status_code, 200)

    # Test update password endpoint
    def test_update_password(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )

        update_password_response=self.client.put('/Account/password/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"},
            json={
                "password": "pass123"
            })
        self.assertEqual(update_password_response.status_code, 200)

    # Test update api key endpoint
    def test_update_api_key(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )

        create_api_key_response=self.client.post('/Account/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"},
            json={
                "api_key": "123",
                "account_id": 1
            })

        update_api_key_response=self.client.put('/Account/api_key/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"},
            json={
                "api_key": "api_key123"
            })
        self.assertEqual(update_api_key_response.status_code, 200)

    # Test delete account endpoint
    def test_delete_account(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )

        delete_account_response=self.client.delete('/Account/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"})
        
        self.assertEqual(delete_account_response.status_code, 200)

    # GALLERY TESTS

    # Test get all conversations for an account endpoint
    def test_get_conversations(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )

        get_conversations_response=self.client.get('/Gallery/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"})
        
        self.assertEqual(get_conversations_response.status_code, 200)

    # Test get conversation by conversation ID endpoint
    def test_get_conversation_by_id(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )

        get_conversation_by_id_response=self.client.get('/Gallery/conversation/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"})
        
        self.assertEqual(get_conversation_by_id_response.status_code, 404)

    # SETTINGS TESTS

    # Test get all accounts endpoint
    def test_get_all_accounts(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )

        get_all_accounts_response=self.client.get('/Admin Settings/', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"})
        
        self.assertEqual(get_all_accounts_response.status_code, 200)
    
    # Test get account by username endpoint
    def test_get_account_by_username(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )

        get_account_by_username_response=self.client.get('/Admin Settings/test_user123', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"})
        
        self.assertEqual(get_account_by_username_response.status_code, 200)

    # Test create account endpoint
    def test_create_account(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )

        create_account_response=self.client.post('/Admin Settings/', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"},
            json={
                "name": "Test User",
                "username": "test_user1234",
                "password": "password123",
                "role": "User"
            })
        self.assertEqual(create_account_response.status_code, 201)

    # Test delete user account endpoint
    def test_delete_user_account(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )
        create_account_response=self.client.post('/Admin Settings/', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"},
            json={
                "name": "Test User",
                "username": "test_user1234",
                "password": "password123",
                "role": "User"
            })
        
        delete_user_account_response=self.client.delete('/Admin Settings/2', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"})
        
        self.assertEqual(delete_user_account_response.status_code, 200)

    
    # IMAGE ANALYSIS TESTS

    def test_upload_image(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )
        upload_image_response=self.client.post('/Image Analysis/upload/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"})
            
        self.assertEqual(upload_image_response.status_code, 400)

    def test_get_scan_results(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )
        get_scan_results_response=self.client.get('/Image Analysis/scan_results/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"})
        
        self.assertEqual(get_scan_results_response.status_code, 404)

    def test_send_message(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )
        send_message_response=self.client.post('/Image Analysis/message/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"},
            json={
                "content": "test message"
            })
        
        self.assertEqual(send_message_response.status_code, 404)

    def test_get_message(self):
        signup_response=self.client.post('/Authentification/signup', json={
            "name": "Test User",
            "username": "test_user123",
            "email": "test@gmail.com",
            "password": "password123"
        } )
        login_response=self.client.post('/Authentification/login', json={
            "username": "test_user123",
            "password": "password123"
        } )
        get_message_response=self.client.get('/Image Analysis/message/1', headers={
            "Authorization": f"Bearer {login_response.json['access_token']}"})
        
        self.assertEqual(get_message_response.status_code, 404)
                                             
    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
        
if __name__ == "__main__":
    unittest.main()