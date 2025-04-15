import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const ANALYSIS_PROMPT = `You are an advanced AI model designed to analyze sales chat conversations for potential violations of terms of service. Your primary objective is to review the provided chat history, identify suspicious messages based on specific flag categories, and assign a risk score (1-10) to the participants involved which will contribute to the average risk score of the user over all of the chats where user was involved.

1. Input Details:
Chat History: A chronological log of messages between a private buyer and seller. Each message will include:
Timestamp
Username
Message content

Message content should be copied EXACTLY AS IT IS, including all special characters and formatting into the content field. Failure to do so will result in the complete failure of the analysis. I cannot stress this enough.

2. Flag Categories:
Do not make up your own flags, use their aliases when assigning them to the user.

Off-Platform Links or Requests:"Hey, I have a better deal if we move to WhatsApp. Here's my number: +1234567890""Check out this link to finalize payment: bit.ly/fakepayment"

Urgency and Pressure"You must transfer the money now, or I'll sell it to someone else!""The deal is only valid for the next hour. Act fast!"

Phishing
Attempts to collect sensitive user information under false pretenses."Can you send me your bank account details for the transfer?""Share your card number so I can hold the reservation for you."

Suspicious Payment Offers
"I'll send you a payment link. Just click on it to confirm!""Pay me directly via crypto. It's safer for both of us."

Too-Good-To-Be-True Deals
"I'm selling this luxury item at half price because I need to move urgently.""You don't need to pay; just send me a small deposit, and I'll ship the item."

Hate Speech
Use of discriminatory language targeting race, religion, gender, ethnicity, or other identities.Example:"People like you shouldn't even be here.""This platform is overrun with [racial slur]."

Harassment
Threats, derogatory comments, or unsolicited messages of a persistent nature."I'm going to find you and make you pay.""You'll regret rejecting my offer."

Sexual Content
Inappropriate or explicit sexual messages.Example:"Let's meet for something fun. I'll pay extra.""Check out my pics on this site."

Illegal Activity
Chat-Based:
Conversations discussing illegal goods or services (e.g., drugs, weapons, stolen goods).Example:"Selling a batch of pills for cheap. DM me.""Looking for someone to get me fake IDs."

3. User flags: Historical data about each participant, detailing previous flags or concerns raised in prior conversations.

Guidelines for Analysis:
1. Context-Aware Analysis:
Analyze the chat history in its entirety, considering the flow and context of the conversation.
Detect subtle patterns of behavior or language indicating fraudulent intent.

2. Flag Detection:
Only flag a message if there is a high confidence in its alignment with the provided flag categories.
Avoid false positives by maintaining a conservative approach to flagging.

3. Risk Assessment:
Evaluate both participants (buyer and seller) using their current chat behavior and historical flag records.
Assign a risk score (1-10) to each participant, considering:
The severity of flagged messages in the current conversation.
The user's history of flagged behavior.
Do not be afraid to give a user a 9 or 10 rating if their conduct is really bad or they have multiple flags.
If the user did not have a flagged message, give him a score of 0, and don't include him in the flaggedUsers array.
Do not make separate entries for each user flag, combine the flags into a single entry for each user.

Additional Considerations:
Your analysis must be objective and impartial.
Use the historical flag records judiciously, ensuring past behaviors influence but do not entirely dictate the current risk assessment.
Adapt dynamically to the conversational tone, intent, and behavioral nuances of the participants.

You will return a structured output which will contain the specific messages you found concerning and flags and risk score for both users.`;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const chatMessages = req.body;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are analyzing WhatsApp chat messages. Provide insights in the specified JSON format.",
          },
          {
            role: "user",
            content: `${ANALYSIS_PROMPT}\n\nHere are the messages to analyze: ${chatMessages}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "chat_analysis",
            schema: {
              type: "object",
              properties: {
                chat_id: { type: "number" },
                flaggedMessages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      content: { type: "string" },
                      sender: { type: "string" },
                      flag: { type: "array", items: { type: "string" } },
                    },
                    required: ["content", "sender", "flag"],
                  },
                },
                flaggedUsers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      sender: { type: "string" },
                      flag: { type: "array", items: { type: "string" } },
                      riskScore: { type: "number", minimum: 1, maximum: 10 },
                    },
                    required: ["sender", "flag", "riskScore"],
                  },
                },
              },
              required: ["chat_id", "flaggedMessages", "flaggedUsers"],
            },
          },
        },
      });

      const parsedResponse = JSON.parse(response.choices[0].message.content);

      // Read the existing analyzed chats
      const analyzedChatsPath = path.join(
        process.cwd(),
        "database",
        "analyzedChats.json"
      );
      const analyzedChatsData = await fs.readFile(analyzedChatsPath, "utf8");
      const analyzedChats = JSON.parse(analyzedChatsData);

      // Append the new analysis
      analyzedChats.analyzedChats.push(parsedResponse);

      // Write back to the file
      await fs.writeFile(
        analyzedChatsPath,
        JSON.stringify(analyzedChats, null, 2)
      );

      res.status(200).json(parsedResponse);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
