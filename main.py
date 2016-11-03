# -*- coding: utf-8 -*-
import webapp2
import os
import jinja2
import logging
import json
import sys
import csv

from google.appengine.api import app_identity
import cloudstorage as gcs
import googlecloudstorage


#--- define bucket & storage file name ---
bucket_name = os.environ.get('GCS_BUCKET_NAME', app_identity.get_default_gcs_bucket_name())
storaged_userdata = '/' + bucket_name + '/userdata2.json'
storaged_data_dir ='/' + bucket_name

#--- initialize
try:
    gcs.delete(storaged_userdata)
except gcs.NotFoundError:
    pass

 
#--- delete google cloud storage file ----
mygcs = googlecloudstorage.GoogleCloudStorage()

#--- define and read user data ---
class UserData():
    def __init__(self):

#        try:
#            self.userData = json.loads(mygcs.read_file(storaged_userdata))
#            logging.info("file exist")
#        except gcs.NotFoundError:
#            logging.info("file not exist")
            org_file = open('./data/userdata.json','r')
            self.userData = json.load(org_file)


userdata = UserData()
logging.info(type(userdata.userData))
logging.info(userdata.userData)


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

            logging.info("=== Login ID check ===")

            if userdata.userData.has_key(userID):
                if userdata.userData[userID]["password"] == userPW:
                    logging.info("HIT")
                    self.response.content_type = "application/json; charset=utf-8"
                    obj2 = { 'status': 1 , 'username': userdata.userData[userID]["name"], 'projects': userdata.userData[userID]["projects"] }
                    self.response.out.write(json.dumps(obj2))
                else:
                    logging.info("password error : " + userPW)
                    obj2 = { 'status': 2 }
                    self.response.out.write(json.dumps(obj2))

            else:
                logging.info("OUT")
                obj2 = { 'status': 3 }
                self.response.out.write(json.dumps(obj2))

        elif status == "account":
            userID = obj['user_id']
            userPW = obj['user_pw']
            userNM = obj['user_nm']

            if userdata.userData.has_key(userID):
                logging.info("already exit your ID")
                self.response.content_type = "application/json; charset=utf-8"
                obj2 = { 'status': 9 }
                self.response.out.write(json.dumps(obj2))
            else:           
                userdata.userData[userID] = { 'password' : userPW , 'name' : userNM, 'projects' : [] }
                userDataString = json.dumps(userdata.userData)
                logging.info(userDataString)

                mygcs.create_file('text', storaged_userdata, userDataString)

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
            project_name = obj['project']
            sitelist = obj['sitelist']
            obs_point_list = obj['obs_cntl_file']

            splited_strings = obs_point_list.split("\r\n")
            num_sites = len(splited_strings) - 1
            logging.info("number of sites : " + str(len(splited_strings)))
            json_string = ' { ' 
            for i in range(1, num_sites):
                sitesdata = splited_strings[i].split(",")
                json_string = json_string + ' \"' + sitesdata[2] + '\" : {'
                json_string = json_string + ' \"longitude" : ' + str(sitesdata[0])
                json_string = json_string + ', \"latitude\" : ' + str(sitesdata[1])
                json_string = json_string + ', \"observer_name\" : null'
                json_string = json_string + ', \"start_time\" : null'
                json_string = json_string + ', \"end_time\" : null'
                json_string = json_string + ', \"flag\" : 0'
                json_string = json_string + ', \"time_stamp\" : null }'
                if i != num_sites-1:
                    json_string += ' , '
                else:
                    json_string += ' } '
            
#            logging.info(json_string)
            storaged_sitelist = storaged_data_dir + '/' + project_name + '/sitelist.json'
            mygcs.create_file('text', storaged_sitelist, json_string)

            obj2 = { 'status': 1 }
            self.response.out.write(json.dumps(obj2))

        elif status == "select_project":
            user_id = obj['userid']
            project_name = obj['project']
#            logging.info(user_id)
#            logging.info(project_name)

            storaged_sitelist = storaged_data_dir + '/' + project_name + '/sitelist.json'
            logging.info(storaged_sitelist)

            fileavability, filedata = mygcs.read_file(storaged_sitelist)
            logging.info("file exist : " + str(fileavability))
#            logging.info("data :" + filedata)

            if fileavability == 1:
                obj2 = { 'status': 1 , 'sitesdata': filedata }
                self.response.out.write(json.dumps(obj2))
                #--- add project to userdata
                count = 0
                for already_project in userdata.userData[user_id]["projects"]:
                    if already_project == project_name:
                        count = 1
                        break
                if count == 0:
                    userdata.userData[user_id]["projects"].append(project_name)
                else:
                    logging.info("you already joined the project : " + project_name)

            else:
                logging.info("Can not find project name : " + project_name)
                obj2 = { 'status': 9 }
                self.response.out.write(json.dumps(obj2))
                
        else:
            pass


app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)
