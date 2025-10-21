import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)
const TABLE_NAME = process.env.TABLE_NAME!

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const slug = event.pathParameters?.slug

    if (!slug) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/html' },
        body: '<h1>Waitlist not found</h1>'
      }
    }

    const result = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'slug = :slug AND SK = :sk',
      ExpressionAttributeValues: {
        ':slug': slug,
        ':sk': 'WAITLIST'
      }
    }))

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/html' },
        body: '<h1>Waitlist not found</h1>'
      }
    }

    const waitlist = result.Items[0]
    const html = generateWaitlistHTML(waitlist)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html
    }
  } catch (error) {
    console.error('Get waitlist error:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: '<h1>Internal server error</h1>'
    }
  }
}

function generateWaitlistHTML(waitlist: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${waitlist.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { max-width: 600px; width: 100%; background: white; border-radius: 12px; padding: 48px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .logo { width: 64px; height: 64px; background: ${waitlist.primaryColor}; border-radius: 50%; margin: 0 auto 24px; }
    h1 { font-size: 36px; font-weight: bold; color: ${waitlist.primaryColor}; margin-bottom: 16px; }
    p { color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 32px; }
    .form { display: flex; flex-direction: column; gap: 12px; }
    input { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; }
    input:focus { outline: none; border-color: ${waitlist.primaryColor}; box-shadow: 0 0 0 3px ${waitlist.primaryColor}20; }
    button { width: 100%; padding: 12px 16px; background: ${waitlist.primaryColor}; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .success { display: none; color: #10b981; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo"></div>
    <h1>${waitlist.name}</h1>
    <p>${waitlist.description}</p>
    <form class="form" onsubmit="handleSubmit(event)">
      <input type="email" id="email" placeholder="Enter your email" required />
      <button type="submit">Join Waitlist</button>
    </form>
    <div class="success" id="success">✓ Thank you for joining!</div>
  </div>
  <script>
    async function handleSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const button = e.target.querySelector('button');
      const successEl = document.getElementById('success');
      
      button.disabled = true;
      button.textContent = 'Joining...';
      
      try {
        const response = await fetch('https://project.waitlist.vberkoz.com/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, waitlistId: '${waitlist.id}' })
        });
        
        if (response.ok) {
          successEl.style.display = 'block';
          e.target.reset();
        } else {
          alert('Failed to join waitlist. Please try again.');
        }
      } catch (error) {
        alert('Failed to join waitlist. Please try again.');
      } finally {
        button.disabled = false;
        button.textContent = 'Join Waitlist';
      }
    }
  </script>
</body>
</html>`
}
