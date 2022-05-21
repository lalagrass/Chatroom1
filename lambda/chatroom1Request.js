// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

    // The body field of the event in a proxy integration is a raw string.
    // In order to extract meaningful values, we need to first parse this string
    // into an object. A more robust implementation might inspect the Content-Type
    // header first and use a different parsing strategy based on that value.
    const requestBody = JSON.parse(event.body);

    const message = requestBody.message;
    let userfrom = message.user_from;
    let userto = message.user_to;
    let usermsg = message.user_msg;
    let timestamp = message.timestamp;

    recordMessage(userfrom, userto, usermsg, timestamp).then(() => {
        // You can use the callback function to provide a return value from your Node.js
        // Lambda functions. The first parameter is used for failed invocations. The
        // second parameter specifies the result data of the invocation.

        // Because this Lambda function is called by an API Gateway proxy integration
        // the result object must use the following structure.
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                result: "success"
            }),
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
        });
    }).catch((err) => {
        console.error(err);

        // If there is an error during processing, catch it and return
        // from the Lambda function successfully. Specify a 500 HTTP status
        // code and provide an error message in the body. This will provide a
        // more meaningful error response to the end client.
        errorResponse(err.message, context.awsRequestId, callback)
    });
};

function recordMessage(userfrom, userto, usermsg, timestamp) {
    return ddb.put({
        TableName: 'Chatroom1.Message',
        Item: {
            user_id: userfrom,
            user_to: userto,
            user_message: usermsg,
            timestamp: timestamp,
        },
    }).promise();
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}