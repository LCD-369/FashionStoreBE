const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const tableName = 'FashionrusStore';
const indexName = 'SK-index';
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
router.post("/api/login", (req, res, next) => {
  let fetchedUser;
  let email = req.body.email;
  let member = 'MEMBER';
  let params = {
    TableName: tableName,
    ScanIndexForward: false,
    IndexName: indexName,
    KeyConditionExpression: 'SK = :SK',
    FilterExpression: 'EMAIL = :EMAIL',
    ExpressionAttributeValues: {
      ':SK': member,
      ':EMAIL': email
    }
  };

  docClient.query(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(err.statusCode).send({
        message: err.message,
        status: err.statusCode
      });
    } else {
      if (!_.isEmpty(data.Items)) {
        fetchedUser = data.Items[0];
        return bcrypt.compare(req.body.password, user.password);
      } else {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
    }
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Auth failed"
      });
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
