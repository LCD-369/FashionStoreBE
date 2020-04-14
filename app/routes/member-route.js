const express = require('express');
const moment = require('moment');
const _ = require('underscore');
const uuidv4 = require('uuid/v4');

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const tableName = 'FashionrusStore';
const indexName = 'SK-index';
docClient = new AWS.DynamoDB.DocumentClient();

//Get all members
router.get('/api/members', (req, res, next) => {
  let params = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: 'SK = :SK',
    ExpressionAttributeValues: {
      ':SK': 'MEMBER'
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
      return res.status(200).send(data);
    }
  });
});

//Create/add new member
router.post('/api/member', (req, res, next) => {
  let item = req.body.Item;
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

//Find member by email
router.get('/api/member/:EMAIL', (req, res, next) => {
  let email = req.params.EMAIL;
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
        return res.status(200).send(data.Items[0]);
      } else {
        return res.status(404).send();
      }
    }
  });
});

module.exports = router;
