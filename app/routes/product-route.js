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
const indexName = 'SK-index';
docClient = new AWS.DynamoDB.DocumentClient();

//Find all products
router.get('/api/products', (req, res, next) => {

  let params = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: 'SK = :SK',
    ExpressionAttributeValues: {
      ':SK': 'PRODUCT'
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

//Find products by gender
router.get('/api/products/:GENDER', (req, res, next) => {
  let gender = req.params.GENDER;
  let product = 'PRODUCT';
  let params = {
    TableName: tableName,
    ScanIndexForward: false,
    IndexName: indexName,
    KeyConditionExpression: 'SK = :SK',
    FilterExpression: 'GENDER = :GENDER',
    ExpressionAttributeValues: {
      ':SK': product,
      ':GENDER': gender
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

//Find products by category
router.get('/api/products/:CATEGORY', (req, res, next) => {
  let category = req.params.CATEGORY;
  let product = 'PRODUCT';
  let params = {
    TableName: tableName,
    ScanIndexForward: false,
    IndexName: indexName,
    KeyConditionExpression: 'SK = :SK',
    FilterExpression: 'CATEGORY = :CATEGORY',
    ExpressionAttributeValues: {
      ':SK': product,
      ':CATEGORY': category
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
