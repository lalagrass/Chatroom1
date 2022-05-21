// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

    // The body field of the event in a proxy integration is a raw string.
    // In order to extract meaningful values, we need to first parse this string
    // into an object. A more robust implementation might inspect the Content-Type
    // header first and use a different parsing strategy based on that value.
    console.log(JSON.stringify(event));
    //const queryString = JSON.parse(event.queryStringParameters);

    let queryUser = event.queryStringParameters.user_id;
    let queryTimestamp = parseInt(event.queryStringParameters.timestamp);
    
    console.log(queryUser);
    console.log(queryTimestamp);

    let p1 = queryMessage(queryUser, queryTimestamp);
    let p2 = queryMessage2(queryUser, queryTimestamp);

    Promise.all([p1, p2]).then((data) => {
        console.log(JSON.stringify(data));
        console.log(JSON.stringify(data[0]));
        console.log(JSON.stringify(data[1]));
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                data
            }),
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
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

function queryMessage(queryUser, queryTimestamp) {
    const params = {
        KeyConditionExpression: "user_id = :u and #t > :t",
        ExpressionAttributeValues: {
            ":u": queryUser,
            ":t": queryTimestamp
        },
        ExpressionAttributeNames: {
            "#t": "timestamp"
        },
        TableName: "Chatroom1.Message",
    };
    return ddb.query(params).promise();
}

function queryMessage2(queryUser, queryTimestamp) {
    const params = {
        KeyConditionExpression: "user_to = :u and #t > :t",
        ExpressionAttributeValues: {
            ":u": queryUser,
            ":t": queryTimestamp
        },
        ExpressionAttributeNames: {
            "#t": "timestamp"
        },
        TableName: "Chatroom1.Message",
        IndexName: 'user_to-timestamp-index'
    };
    return ddb.query(params).promise();
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