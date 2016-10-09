# -*- coding: utf-8 -*-
import webapp2
import os
import jinja2
import logging
import json
import sys
sys.path.append('/lib')

import smtplib
from google.appengine.api import app_identity
from google.appengine.api import urlfetch
from google.appengine.ext import ndb
import cloudstorage as gcs

from google.appengine.api import mail

#--- define and read user data ---
class UserData(ndb.Model):
    def __init__(self):

#        file = open('./data/userdata.json','r')
#        self.userData = json.load(file)
#        logging.info(type(self.userData))
#        logging.info(self.userData[0]["id"])

#        self.userData = ndb.StringProperty()
        self.bucket_name = os.environ.get('BUCKET_NAME', app_identity.get_default_gcs_bucket_name())
        file = '/' + self.bucket_name + '/files/' + 'userdata.json'
        logging.info("file = " + file)

        if os.path.isfile(file):
            logging.info("file exist")
            gcs_file = gcs.open(file,'r')
            self.userData = json.load(gcs_file)
        else:
            logging.info("file dose not exist")
            self.userData = []


userdata = UserData()
logging.info(userdata.userData)
login_status = 0


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class BaseHandler(webapp2.RequestHandler):
    def render(self, html, values={}):
        template = JINJA_ENVIRONMENT.get_template(html)
        self.response.write(template.render(values))

def send_password_mail(sender_address, to_address, user_password):
    message = mail.EmailMessage(
        sender=sender_address,
        subject="Send your password" )
        
    message.to = to_address
    message.body= "your password is " + user_password
    message.send()


class MainPage(BaseHandler):

    def get(self):
        values = { "image": "/img/title.png", } 
        self.render("./html/title.html", values)

    def post(self):
        json_data = self.request.body
        obj = json.loads(json_data)

        status = obj['button_status']
        logging.info("status = " + status)
        
        if status == "login":
            userID = obj['user_id']
            userPW = obj['user_pw']
#            logging.info("user id =" + userID)
#            logging.info("user pw =" + userPW)


            logging.info("=== Login ID check ===")
            flag = -9
            for user in userdata.userData:
#                logging.info(user["id"])

                if user["id"] == userID:
                    flag = 0
                    if user["password"] == userPW:
                        logging.info("HIT")
                        self.response.content_type = "application/json; charset=utf-8"
                        obj2 = { 'status': 1 , 'projects': user["projects"] }
                        logging.info(obj2)
                        self.response.out.write(json.dumps(obj2))
                    else:
                        logging.info("password error : " + userPW)
                        obj2 = { 'status': 2 }
 #                       logging.info(obj2)
                        self.response.out.write(json.dumps(obj2))
                    break

            if flag == -9:
                logging.info("OUT")
                obj2 = { 'status': 3 }
#                logging.info(obj2)
                self.response.out.write(json.dumps(obj2))


        elif status == "account":
            userID = obj['user_id']
            userPW = obj['user_pw']
            userNM = obj['user_nm']

            flag = 0
            for user in userdata.userData:
                if user["id"] == userID:
                    flag = -9
                    logging.info("already exit your ID")
                    self.response.content_type = "application/json; charset=utf-8"
                    obj2 = { 'status': 9 }
                    self.response.out.write(json.dumps(obj2))
                    break
            
            logging.info(flag)
            if flag == 0:
                new_account = { "id": userID, "password": userPW, "name": userNM, "projects": [] }
                userdata.userData.append(new_account)

#                bucket_name = os.environ.get('BUCKET_NAME', app_identity.get_default_gcs_bucket_name())
                file = '/' + userdata.bucket_name + '/files/' + 'userdata.json'
                logging.info(file)
                with gcs.open(file,'w') as gcs_file:
                    userDataString = str(map(str, userdata.userData))
                    logging.info(userDataString)
                    gcs_file.write(userDataString)



        elif status == "send_password":
            userID = obj['user_id']

            flag = -9
            for user in userdata.userData:
                if user["id"] == userID:
                    flag = 0
                    logging.info("exist your ID")

                    app_id = app_identity.get_default_gcs_bucket_name()
                    logging.info(app_id)
                    send_password_mail('{}@appspot.gserviceaccount.com'.format(app_id), user["id"], user["password"])

                    self.response.content_type = "application/json; charset=utf-8"
                    obj2 = { 'status': 1 }
                    self.response.out.write(json.dumps(obj2))
                    break
            
            logging.info(flag)
            if flag == -9:
                obj2 = { 'status': 9 }
                self.response.out.write(json.dumps(obj2))


        elif status == "send_obspointlist":
            project = obj["project"]
            data = obj["data"]

            bucket_name = os.environ.get('BUCKET_NAME', app_identity.get_default_gcs_bucket_name())
            file_path = '/' + bucket_name + '/files/' + 'test.txt'
            with gcs.open(file_path,'w') as gcs_file:
                gcs_file.write("test")

#            if os.path.isdir(project):
#                pass
#            else:
#                logging.info(project)
#                os.mkdir("./kathmandu")


        else:
            pass

app = webapp2.WSGIApplication([
    ('/', MainPage),
#    ('/', MesMapPage),
], debug=True)
