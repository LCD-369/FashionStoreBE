const express = require('express');
const moment = require('moment');
const _ = require('underscore');
const uuidv4 = require('uuid/v4');

const router = express.Router();

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});
const tableName = 'FashionrusStore';
const indexName = 'SK-email-index';
docClient = new AWS.DynamoDB.DocumentClient();

//Add new order
router.post('/api/order', (req, res, next) => {
  let item = req.body;

  var params = {
    TableName: tableName,
    Item: item
  };
  docClient.put(params, (err, data) => {
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

//Find order by email
router.get('/api/order/:EMAIL', (req, res, next) => {
  let email = req.params.EMAIL;
  let order = 'ORDER';
  let params = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: 'SK = :SK and email = :email',
    ExpressionAttributeValues: {
      ':SK': order,
      ':email': email
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
        return res.status(200).send(data.Items);
      } else {
        return res.status(404).send();
      }
    }
  });
});

module.exports = router;
