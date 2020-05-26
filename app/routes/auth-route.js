const express = require('express');
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const tableName = 'FashionrusStore';
const indexName = 'SK-index';
const indexAuth = 'EMAIL-PASSWORD-index';
docClient = new AWS.DynamoDB.DocumentClient();

//Registers new user while encrypting password and verifying
//if the email provided does not exist in the system
router.post("/api/signup", (req, res, next) => {
  let item = req.body;

  bcrypt.hash(req.body.PASSWORD, 10, (err, hash) => {
    item.PASSWORD = hash;
    docClient.put({
      TableName: tableName,
      Item: item
    }, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(err.statusCode).send({
          message: err.message,
          status: err.statusCode
        });
      } else {
        return res.status(200).send(item);
      }
    });
  });
});

//Login api
router.post("/api/login", (req, res, then) => {
  let fetchedUser;
  let email = req.body.EMAIL;
  let tempPwd = req.body.PASSWORD;
  let password = bcrypt.hashSync(tempPwd, 10);
  let params = {
    TableName: indexAuth,
    ScanIndexForward: false,
    IndexName: indexName,
    KeyConditionExpression: 'EMAIL = :EMAIL and PASSWORD = :PASSWORD',
    ExpressionAttributeValues: {
      ':EMAIL': email,
      ':PASSWORD': password
    }
  };
  docClient.query(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(err.statusCode).send({
        message: err.message,
        status: err.statusCode
      });
    }
    if (!_.isEmpty(data.Items)) {
      fetchedUser = data.Items[0];
    } else {
      return res.status(401).json({
        message: "Auth failed"
      });
    }}).next(result => {
      if (!result) {
        return res.status(401).json({message: "Auth failed"});
      }
      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser.username
      }, process.env.JWT_KEY, {
        expiresIn: "1h"
      });
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser.username
      });
    }).catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
  });



module.exports = router;
