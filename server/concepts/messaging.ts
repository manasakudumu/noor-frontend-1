import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ChatMessage extends BaseDoc {
  recipient: ObjectId; // Receiver's User ID
  sender: ObjectId; // Sender's User ID
  messageText: string; // Content of the message
  sentAt: Date; // Timestamp for when the message was sent
}

/**
 * Concept: Messaging [User]
 * Handles sending, retrieving, and deleting messages between users.
 */
export default class MessagingService {
  public readonly messageStore: DocCollection<ChatMessage>;

  /**
   * Initialize the messaging service with a collection name.
   */
  constructor(collectionName: string) {
    this.messageStore = new DocCollection<ChatMessage>(collectionName);
  }

  /**
   * Send a message from one user to another.
   */
  async sendMessage(recipient: ObjectId, sender: ObjectId, messageText: string) {
    if (recipient.equals(sender)) {
      throw new NotAllowedError("Cannot send a message to yourself.");
    }

    const timestamp = new Date();
    const newMessage = { recipient, sender, messageText, sentAt: timestamp };
    const createdId = await this.messageStore.createOne(newMessage);
    const createdMessage = await this.messageStore.readOne({ _id: createdId });

    return { message: "Message sent successfully!", data: createdMessage };
  }

  async fetchAllMessages() {
    return await this.messageStore.readMany({}, { sort: { _id: -1 } });
  }

  async getMessagesBySender(senderId: ObjectId) {
    return await this.messageStore.readMany({ sender: senderId });
  }

  async getConversation(user1: ObjectId, user2: ObjectId) {
    const messages = await this.messageStore.readMany({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    });

    if (!messages.length) {
      throw new NotFoundError(`No conversation found between these users.`);
    }

    return messages;
  }

  async removeMessage(messageId: ObjectId) {
    const result = await this.messageStore.deleteOne({ _id: messageId });
    if (!result) {
      throw new NotFoundError(`Message with ID ${messageId} not found.`);
    }
    return { message: "Message successfully deleted." };
  }

  async verifySender(messageId: ObjectId, userId: ObjectId) {
    const message = await this.messageStore.readOne({ _id: messageId });
    if (!message) {
      throw new NotFoundError(`Message with ID ${messageId} does not exist.`);
    }

    if (!message.sender.equals(userId)) {
      throw new SenderMismatchError(userId, messageId);
    }
  }
}

export class SenderMismatchError extends NotAllowedError {
  constructor(
    public readonly userId: ObjectId,
    public readonly messageId: ObjectId,
  ) {
    super(`User ${userId} is not the sender of message ${messageId}.`);
  }
}
