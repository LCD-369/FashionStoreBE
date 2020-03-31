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


//Find coupon by coupon code
router.get('/api/coupon/:COUPONCODE', (req, res, next) => {
  let couponcode = req.params.COUPONCODE;
  let coupon = 'COUPON';
  let params = {
    TableName: tableName,
    ScanIndexForward: false,
    IndexName: indexName,
    KeyConditionExpression: 'SK = :SK',
    FilterExpression: 'COUPONCODE = :COUPONCODE',
    ExpressionAttributeValues: {
      ':SK': coupon,
      ':COUPONCODE': couponcode
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
